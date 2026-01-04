/**
 * MessageList Component
 * Displays the conversation messages with proper scrolling
 */

'use client';

import { useEffect, useRef } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';

export default function MessageList({ messages }) {
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-slate-400 overflow-hidden">
        <div className="text-center">
          <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No messages yet</p>
          <p className="text-sm">Start a conversation with the AI!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4" ref={scrollRef}>
      <div className="max-w-3xl mx-auto py-4 space-y-6">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex gap-3 ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {message.role === 'assistant' && (
              <Avatar className="h-8 w-8 bg-blue-600 flex-shrink-0">
                <AvatarFallback>
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            )}
            
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-900'
              }`}
            >
              <p className="whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>

            {message.role === 'user' && (
              <Avatar className="h-8 w-8 bg-slate-600 flex-shrink-0">
                <AvatarFallback>
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}