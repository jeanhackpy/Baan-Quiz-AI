
import React from 'react';
import { Message } from '../types';
import { UserIcon, AiIcon, PropertyIcon } from './icons';
import { PropertyCard } from './PropertyCard';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
      <div className={`flex items-end max-w-xl ${isUser ? 'flex-row-reverse' : 'flex-row'} space-x-2 space-x-reverse`}>
        {isUser ? (
          <UserIcon className="w-8 h-8 rounded-full bg-sky-500 text-white p-1.5 ml-2 flex-shrink-0" />
        ) : (
          <AiIcon className="w-8 h-8 rounded-full bg-teal-500 text-white p-1.5 mr-2 flex-shrink-0" />
        )}
        <div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-sky-500 text-white rounded-br-none'
              : 'bg-slate-700 text-gray-200 rounded-bl-none'
          } shadow-md`}
        >
          <p className="text-sm whitespace-pre-wrap">{message.text}</p>
          {message.associatedProperties && message.associatedProperties.length > 0 && (
            <div className="mt-4 pt-3 border-t border-slate-600/50">
              <h4 className="text-xs font-semibold mb-2 flex items-center opacity-80">
                <PropertyIcon className="w-4 h-4 mr-1.5"/>
                Matching Properties:
              </h4>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-1"> {/* Changed to 1 column for chat bubble */}
                {message.associatedProperties.map(prop => (
                  <PropertyCard key={prop.id} property={prop} variant="compact" />
                ))}
              </div>
            </div>
          )}
           <p className={`text-xs mt-2 ${isUser ? 'text-sky-200 text-right' : 'text-slate-400 text-left'} opacity-70`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
      </div>
    </div>
  );
};
