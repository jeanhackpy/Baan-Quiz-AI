
import { GoogleGenAI, Chat } from "@google/genai";
import { GeminiChatSession, QuizAnswers, Property, Message } from '../types';

let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
  if (!ai) {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("Gemini API Key (process.env.API_KEY) is not configured.");
      throw new Error("API_KEY_NOT_CONFIGURED: Gemini API Key is missing. Please set the API_KEY environment variable.");
    }
    ai = new GoogleGenAI({ apiKey });
  }
  return ai;
};

// --- Hypothetical Vector DB Interaction Service (Illustrative) ---
interface VectorDBContext {
  retrievedContext?: string; // Context fetched from Vector DB
  interactionToLog?: any; // Data to be logged for this interaction
}

// Placeholder for a service that would interact with your vector DB backend
const vectorDBService = {
  fetchContext: async (userId: string | null, query: string, quizAnswers?: QuizAnswers | null): Promise<string | null> => {
    // In a real implementation:
    // 1. Send userId, query, quizAnswers to your backend.
    // 2. Backend generates embedding for the query/context.
    // 3. Backend queries vector DB for relevant past interactions or knowledge.
    // 4. Backend returns the retrieved context as a string.
    console.log('[VectorDBService] Hypothetically fetching context for query:', query, 'User ID:', userId, 'Quiz:', quizAnswers);
    // Simulate a delay and no context found for now
    // await new Promise(resolve => setTimeout(resolve, 300));
    // return "Previously, the user expressed strong interest in properties near international schools.";
    return null;
  },
  logInteraction: async (userId: string | null, userMessage: Message, aiMessage: Message, currentQuizAnswers?: QuizAnswers | null, propertiesInView?: Array<Property & {compatibilityScore?: number}> | null) => {
    // In a real implementation:
    // 1. Send interaction data (user message, AI response, context) to your backend.
    // 2. Backend generates embeddings and stores them in the vector DB.
    console.log('[VectorDBService] Hypothetically logging interaction:', { userId, userMessage, aiMessage, currentQuizAnswers, propertiesInView });
    // Simulate a delay
    // await new Promise(resolve => setTimeout(resolve, 100));
  }
};
// --- End of Hypothetical Vector DB Interaction Service ---


const SYSTEM_INSTRUCTION = `You are 'Properly', a friendly and expert AI real estate and hospitality assistant specializing in the Thai market for European clients.

**VERY IMPORTANT: You MUST detect the language the user is writing in and respond in THE SAME LANGUAGE.** For example, if the user writes in French, you must respond in French. If they write in German, respond in German. If in English, respond in English.

**Your Current Role: Dashboard Assistant**
The user has already completed a 'Home Match Quiz' through the application's UI. They are now viewing a personalized dashboard showing property suggestions based on their quiz answers.

**Contextual Information:**
*   **User's Quiz Answers:** These will be provided with their message.
*   **Properties in View:** Information about properties currently displayed to the user will be provided.
*   **Retrieved Knowledge (from Vector DB - if provided):** You might receive additional 'Retrieved Knowledge' or 'Past Interaction Summary'. This is information from a long-term memory system (vector database) that has found relevant past interactions or user profile notes. Treat this as verified, highly relevant context to enhance your current response. If provided, weave it naturally into your answer.

Your role is to:
1.  **Answer Questions:** Respond to user questions about the properties displayed on their dashboard, general Thai real estate topics, or specific locations in Thailand.
2.  **Utilize ALL Provided Context:** Synthesize information from the user's quiz answers, properties in view, and any 'Retrieved Knowledge' to make your responses as relevant and personalized as possible.
3.  **Clarify and Refine:** If the user wants to refine their search or has new criteria, acknowledge their existing preferences (from quiz and any retrieved knowledge) and help them think through new options.
4.  **Language and Tone Adaptation:**
    *   **Respond in User's Language:** Always reply in the language the user has used for their message.
    *   **Mirror Style (Subtly):** Adapt your language style to the user. If the user is informal, you can be slightly more informal. If the user is very formal, maintain a professional and formal tone. Always remain helpful, clear, and professional. Avoid slang or overly casual language.

**Core Expertise (Maintain this regardless of language):**
*   You understand the nuances of the Thai market and can help bridge the gap for European clients.
*   You cannot directly search a live database of *new* current listings beyond what's presented based on the quiz, but you can discuss the provided sample properties, general market conditions, explain local real estate concepts, and summarize requirements.
*   Keep your responses concise, empathetic, culturally aware, and helpful.
*   If the user asks about something you cannot do (e.g., provide legal advice on property ownership structures, arrange visas, give financial advice), politely explain your limitations as an AI assistant and suggest they consult with relevant professionals, in their language.
*   Be positive and encouraging.
*   When discussing prices, you can talk in terms of EUR or THB. If the user states their budget in a specific currency, try to use that currency in your discussion about budget, or clarify if you need to convert.

Default to English only if the user's language is highly ambiguous or one you cannot process. However, make every effort to use the user's language.`;

export const startChatSession = async (
  userId: string | null, // Added userId for vector DB operations
  quizAnswers?: QuizAnswers | null,
  propertiesForContext?: Array<Property & {compatibilityScore?: number}> | null
): Promise<GeminiChatSession> => {
  const client = getAiClient();

  let historyForChat = [];
  if (quizAnswers) {
    historyForChat.push({
      role: "user",
      parts: [{ text: `Context: User's quiz preferences are: ${JSON.stringify(quizAnswers)}.`}]
    });
  }
  if (propertiesForContext && propertiesForContext.length > 0) {
     historyForChat.push({
      role: "user",
      parts: [{ text: `Context: User is currently viewing properties like: ${propertiesForContext.slice(0,3).map(p => `${p.propertyType} in ${p.location} (Match: ${p.compatibilityScore}%)`).join(', ')}.`}]
    });
  }

  // Hypothetically fetch initial context if relevant (e.g., user profile summary)
  // const initialVectorContext = await vectorDBService.fetchContext(userId, "Initial dashboard view context", quizAnswers);
  // if (initialVectorContext) {
  //   historyForChat.push({
  //     role: "user", // Or model, if you want it to look like AI's memory
  //     parts: [{ text: `Retrieved Knowledge: ${initialVectorContext}` }]
  //   });
  // }

  const chat: Chat = client.chats.create({
    model: 'gemini-2.5-flash-preview-04-17',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
    },
    history: historyForChat.length > 0 ? historyForChat : undefined,
  });

  return {
    sendMessage: async (params: { message: string; userId?: string | null; quizAnswers?: QuizAnswers | null, propertiesForContext?: Array<Property & {compatibilityScore?: number}> | null }) => {
      let augmentedMessage = params.message;

      // Hypothetically fetch context from Vector DB based on current query
      const dynamicVectorContext = await vectorDBService.fetchContext(params.userId || null, params.message, params.quizAnswers);
      if (dynamicVectorContext) {
        augmentedMessage = `Retrieved Knowledge: ${dynamicVectorContext}\n\nUser Query: ${params.message}`;
      }
      
      const response = await chat.sendMessage({ message: augmentedMessage });
      
      // After getting a response, hypothetically log the interaction
      // This would be more robust in ChatInterface.tsx after user and AI messages are formed.
      // For simplicity, showing a conceptual call here.
      // await vectorDBService.logInteraction(params.userId || null, /* user message object */, /* AI response object */, params.quizAnswers, params.propertiesForContext);

      return { text: response.text };
    }
  };
};

// This function might be refactored or merged if chatSession.sendMessage handles all logic
export const sendMessageToGemini = async (
  chatSession: GeminiChatSession,
  userMessageText: string, // Original user text
  userId: string | null,
  quizAnswers?: QuizAnswers | null,
  propertiesForContext?: Array<Property & {compatibilityScore?: number}> | null
): Promise<{ text: string }> => {
  if (!chatSession) {
    throw new Error("Chat session not initialized.");
  }
  try {
    // The sendMessage method in the enhanced chatSession object now handles context fetching
    const result = await chatSession.sendMessage({ 
        message: userMessageText, 
        userId, 
        quizAnswers, 
        propertiesForContext 
    });
    return { text: result.text };
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    if (error instanceof Error && error.message.includes("API_KEY")) {
         throw new Error("GEMINI_API_ERROR: There seems to be an issue with the API key configuration. Please check and try again.");
    }
    throw new Error("GEMINI_API_ERROR: Failed to get response from AI assistant.");
  }
};

// Export the conceptual vectorDBService if you want to call logInteraction from elsewhere (e.g., ChatInterface)
export { vectorDBService };
