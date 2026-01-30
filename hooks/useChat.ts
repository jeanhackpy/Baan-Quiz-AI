import { useState, useEffect, useCallback } from 'react';
import { Message, Property, GeminiChatSession, QuizAnswers } from '../types';
import { startChatSession, sendMessageToGemini, vectorDBService } from '../services/geminiService';

export const useChat = (
  userId: string | null,
  quizAnswers: QuizAnswers | null,
  propertiesForContext: Array<Property & {compatibilityScore?: number}> | undefined
) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatSession, setChatSession] = useState<GeminiChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const initializeChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const session = await startChatSession(userId, quizAnswers, propertiesForContext);
      setChatSession(session);
      setMessages([
        {
          id: 'initial-ai-dashboard-message',
          text: "Sawasdee! I'm Properly, your AI assistant. I see you've completed the quiz. How can I help you further with these properties or your search in Thailand?",
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    } catch (err) {
      console.error('Failed to initialize chat session:', err);
      setError('Failed to connect to the AI assistant. Please ensure your API key is configured correctly.');
      setMessages([
         {
          id: 'initial-ai-message-error',
          text: "Sawasdee! I'm Properly. I'm having a little trouble connecting fully right now. However, you can still ask me general questions about Thai real estate.",
          sender: 'ai',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [userId, quizAnswers, propertiesForContext]);

  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const findPropertiesInContext = (query: string): Property[] => {
    const lowerQuery = query.toLowerCase();
    if (!lowerQuery.trim() || !propertiesForContext) return [];

    return (propertiesForContext as Property[]).filter(property => {
      const searchableText = `
        ${property.location.toLowerCase()}
        ${property.propertyType.toString().toLowerCase()}
        ${property.detailedDescription.toLowerCase()}
      `;
      const keywords = lowerQuery.split(/\s+/).filter(kw => kw.length > 2);
      return keywords.some(keyword => searchableText.includes(keyword));
    }).slice(0, 2);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    let aiResponseText = "I'm sorry, I couldn't process your request at the moment.";
    let aiMessage: Message;

    if (chatSession) {
        try {
            const response = await sendMessageToGemini(chatSession, text, userId, quizAnswers, propertiesForContext);
            aiResponseText = response.text;
        } catch (err) {
            console.error('Error sending message to Gemini:', err);
            setError('There was an issue communicating with the AI.');
            aiResponseText = "I'm having a little trouble connecting to my advanced knowledge base.";
        }
    } else {
        aiResponseText = `I'll try to answer based on general knowledge as my advanced connection is offline.`;
    }

    const contextFiltered = findPropertiesInContext(text);

    aiMessage = {
      id: `ai-${Date.now()}`,
      text: aiResponseText,
      sender: 'ai',
      timestamp: new Date(),
      associatedProperties: contextFiltered.length > 0 ? contextFiltered : undefined,
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);

    try {
      await vectorDBService.logInteraction(userId, userMessage, aiMessage, quizAnswers, propertiesForContext);
    } catch (logError) {
      console.warn("Failed to log interaction to VectorDB:", logError);
    }
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    initializeChat
  };
};
