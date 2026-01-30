
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Message, Property, GeminiChatSession, QuizAnswers } from '../types';
import { ChatMessage } from './ChatMessage';
import { LoadingSpinner } from './LoadingSpinner';
import { SendIcon, SparklesIcon, PropertyIcon } from './icons';
import { startChatSession, sendMessageToGemini, vectorDBService } from '../services/geminiService'; // Import vectorDBService

interface ChatInterfaceProps {
  userId: string | null; // Added userId
  quizAnswers?: QuizAnswers | null;
  propertiesForContext?: Array<Property & {compatibilityScore?: number}>;
}


const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId, quizAnswers, propertiesForContext }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chatSession, setChatSession] = useState<GeminiChatSession | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pass userId, quizAnswers, and propertiesForContext for initial context building if needed by Gemini or Vector DB
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
      setError('Failed to connect to the AI assistant. Please ensure your API key is configured correctly and try refreshing.');
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, quizAnswers, propertiesForContext]); // Re-initialize if context changes


  useEffect(() => {
    initializeChat();
  }, [initializeChat]);

  const findPropertiesInContext = (query: string): Property[] => {
    const lowerQuery = query.toLowerCase();
    if (!lowerQuery.trim() || !propertiesForContext) return [];

    return propertiesForContext.filter(property => {
      const searchableText = `
        ${property.location.toLowerCase()} 
        ${property.propertyType.toString().toLowerCase()} 
        ${property.detailedDescription.toLowerCase()}
      `;
      const keywords = lowerQuery.split(/\s+/).filter(kw => kw.length > 2);
      return keywords.some(keyword => searchableText.includes(keyword));
    }).slice(0, 2);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue; // Store before clearing
    setInputValue('');
    setIsLoading(true);
    setError(null);

    let aiResponseText = "I'm sorry, I couldn't process your request at the moment.";
    let aiMessage: Message;

    if (chatSession) {
        try {
            // Construct a more detailed prompt if needed, but rely on geminiService to add VectorDB context
            const promptForGemini = `User query: ${userMessage.text}. User's quiz preferences: ${JSON.stringify(quizAnswers)}. Properties currently shown to user: ${propertiesForContext?.map(p=>p.location + " ("+p.compatibilityScore+"%)").join(', ')}.`;
            
            // Using the sendMessageToGemini which now internally calls the chatSession's sendMessage
            // that might be augmented with vectorDB context
            const response = await sendMessageToGemini(chatSession, currentInput, userId, quizAnswers, propertiesForContext);
            aiResponseText = response.text;
        } catch (err) {
            console.error('Error sending message to Gemini:', err);
            setError('There was an issue communicating with the AI. Please try again.');
             aiResponseText = "I'm having a little trouble connecting to my advanced knowledge base. Could you try rephrasing, or ask a simpler question about Thai real estate?";
        }
    } else {
        aiResponseText = `Okay, you asked about: "${userMessage.text}". I'll try to answer based on general knowledge as my advanced connection is offline.`;
    }

    const contextFiltered = findPropertiesInContext(currentInput); // Use currentInput for context finding

    aiMessage = {
      id: `ai-${Date.now()}`,
      text: aiResponseText,
      sender: 'ai',
      timestamp: new Date(),
      associatedProperties: contextFiltered.length > 0 ? contextFiltered : undefined,
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);

    // Hypothetically log the full interaction to the Vector DB
    // This would be an async call to your backend service
    try {
      await vectorDBService.logInteraction(userId, userMessage, aiMessage, quizAnswers, propertiesForContext);
    } catch (logError) {
      console.warn("Failed to (hypothetically) log interaction to VectorDB:", logError);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-800 shadow-2xl rounded-xl overflow-hidden border border-slate-700">
      <div className="p-4 border-b border-slate-700 flex items-center space-x-2 bg-slate-800/50 backdrop-blur-sm">
        <SparklesIcon className="w-6 h-6 text-sky-400" />
        <h2 className="text-xl font-semibold text-gray-100">Properly AI Assistant</h2>
      </div>

      {error && (
        <div className="p-3 bg-red-500/20 text-red-300 border-b border-red-500/30 text-sm">
          {error}
        </div>
      )}

      <div className="flex-grow p-6 space-y-6 overflow-y-auto h-[300px] sm:h-[400px]">
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        {isLoading && (
          <div className="flex justify-center py-4">
            <LoadingSpinner />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && !isLoading && handleSendMessage()}
            placeholder="Ask about properties, areas, or Thai real estate..."
            className="flex-grow p-3 bg-slate-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-slate-500"
            disabled={isLoading && !chatSession} // Keep disabled if loading OR if chat session failed to init
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!chatSession && !inputValue.trim()) || !inputValue.trim()} // Disable if no input or no session
            className="p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 focus:ring-2 focus:ring-sky-400 focus:outline-none"
            aria-label="Send message"
          >
            <SendIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
