
import { GoogleGenerativeAI, ChatSession } from "@google/generative-ai";
import { GeminiChatSession, QuizAnswers, Property, Message } from '../types';

let genAI: GoogleGenerativeAI | null = null;

const getAiClient = (): GoogleGenerativeAI => {
  if (!genAI) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.error("Gemini API Key (VITE_GEMINI_API_KEY) is not configured.");
      throw new Error("API_KEY_NOT_CONFIGURED: Gemini API Key is missing.");
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
};

// Placeholder for a service that would interact with your vector DB backend
const vectorDBService = {
  fetchContext: async (userId: string | null, query: string, quizAnswers?: QuizAnswers | null): Promise<string | null> => {
    console.log('[VectorDBService] Hypothetically fetching context for query:', query, 'User ID:', userId);
    return null;
  },
  logInteraction: async (userId: string | null, userMessage: Message, aiMessage: Message, currentQuizAnswers?: QuizAnswers | null, propertiesInView?: Array<Property & {compatibilityScore?: number}> | null) => {
    console.log('[VectorDBService] Hypothetically logging interaction:', { userId, userMessage, aiMessage });
  }
};


const SYSTEM_INSTRUCTION = `You are 'Properly', a friendly and expert AI real estate and hospitality assistant specializing in the Thai market for European clients.

**VERY IMPORTANT: You MUST detect the language the user is writing in and respond in THE SAME LANGUAGE.**

**Your Current Role: Dashboard Assistant**
The user has already completed a 'Home Match Quiz'. They are now viewing property suggestions.

**Core Expertise:**
- You understand the nuances of the Thai market.
- You can discuss provided sample properties and general market conditions.
- Keep responses concise, empathetic, and culturally aware.`;

export const startChatSession = async (
  userId: string | null,
  quizAnswers?: QuizAnswers | null,
  propertiesForContext?: Array<Property & {compatibilityScore?: number}> | null
): Promise<GeminiChatSession> => {
  const client = getAiClient();
  const model = client.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: SYSTEM_INSTRUCTION
  });

  let historyForChat = [];
  if (quizAnswers) {
    historyForChat.push({
      role: "user",
      parts: [{ text: `Context: User's quiz preferences are: ${JSON.stringify(quizAnswers)}.`}]
    });
    historyForChat.push({
      role: "model",
      parts: [{ text: "Understood. I will use these preferences to guide my advice."}]
    });
  }
  if (propertiesForContext && propertiesForContext.length > 0) {
     historyForChat.push({
      role: "user",
      parts: [{ text: `Context: User is currently viewing properties like: ${propertiesForContext.slice(0,3).map(p => `${p.propertyType} in ${p.location}`).join(', ')}.`}]
    });
    historyForChat.push({
      role: "model",
      parts: [{ text: "I have noted the properties currently on the user's dashboard."}]
    });
  }

  const chat = model.startChat({
    history: historyForChat.length > 0 ? historyForChat : undefined,
  });

  return {
    sendMessage: async (params: { message: string; userId?: string | null; quizAnswers?: QuizAnswers | null, propertiesForContext?: Array<Property & {compatibilityScore?: number}> | null }) => {
      let augmentedMessage = params.message;

      const dynamicVectorContext = await vectorDBService.fetchContext(params.userId || null, params.message, params.quizAnswers);
      if (dynamicVectorContext) {
        augmentedMessage = `Retrieved Knowledge: ${dynamicVectorContext}\n\nUser Query: ${params.message}`;
      }
      
      const result = await chat.sendMessage(augmentedMessage);
      const response = await result.response;
      
      return { text: response.text() };
    }
  };
};

export const sendMessageToGemini = async (
  chatSession: GeminiChatSession,
  userMessageText: string,
  userId: string | null,
  quizAnswers?: QuizAnswers | null,
  propertiesForContext?: Array<Property & {compatibilityScore?: number}> | null
): Promise<{ text: string }> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized.");
  }
  try {
    const result = await chatSession.sendMessage({ 
        message: userMessageText, 
        userId, 
        quizAnswers, 
        propertiesForContext 
    });
    return result;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw new Error("GEMINI_API_ERROR: Failed to get response from AI assistant.");
  }
};

export { vectorDBService };
