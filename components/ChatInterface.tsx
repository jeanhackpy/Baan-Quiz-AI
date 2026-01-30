
import React, { useState, useEffect, useRef } from 'react';
import { Property, QuizAnswers } from '../types';
import { ChatMessage } from './ChatMessage';
import { LoadingSpinner } from './LoadingSpinner';
import { SendIcon, SparklesIcon } from './icons';
import { useChat } from '../hooks/useChat';

interface ChatInterfaceProps {
  userId: string | null;
  quizAnswers?: QuizAnswers | null;
  propertiesForContext?: Array<Property & {compatibilityScore?: number}>;
}


const ChatInterface: React.FC<ChatInterfaceProps> = ({ userId, quizAnswers, propertiesForContext }) => {
  const [inputValue, setInputValue] = useState<string>('');
  const { messages, isLoading, error, sendMessage } = useChat(userId, quizAnswers || null, propertiesForContext);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    const text = inputValue;
    setInputValue('');
    await sendMessage(text);
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
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about properties, areas, or Thai real estate..."
            className="flex-grow p-3 bg-slate-700 text-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-slate-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
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
