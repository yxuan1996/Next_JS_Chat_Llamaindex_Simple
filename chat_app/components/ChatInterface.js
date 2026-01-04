/**
 * ChatInterface Component
 * Main chat interface with scrollable messages and fixed input at bottom
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function ChatInterface({ threadId }) {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  // Load chat history when thread changes
  useEffect(() => {
    if (threadId) {
      loadChatHistory();
    } else {
      setMessages([]);
      setLoadingHistory(false);
    }
  }, [threadId]);

  /**
   * Load existing chat history from backend
   */
  const loadChatHistory = async () => {
    setLoadingHistory(true);
    try {
      const settings = getSettings();
      if (!settings.backendUrl || !settings.apiKey) {
        console.log('Settings not configured');
        setLoadingHistory(false);
        return;
      }

      const response = await fetch(`${settings.backendUrl}/threads/${threadId}`, {
        headers: {
          'X-API-Key': settings.apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        console.error('Failed to load chat history');
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  /**
   * Get settings from localStorage
   */
  const getSettings = () => {
    if (typeof window !== 'undefined') {
      return {
        backendUrl: localStorage.getItem('backendUrl') || '',
        apiKey: localStorage.getItem('apiKey') || '',
      };
    }
    return { backendUrl: '', apiKey: '' };
  };

  /**
   * Send message to backend and get AI response
   */
  const handleSendMessage = async (message) => {
    const settings = getSettings();

    // Check if settings are configured
    if (!settings.backendUrl || !settings.apiKey) {
      alert('Please configure your backend settings first!');
      router.push('/settings');
      return;
    }

    // Add user message to UI immediately
    const userMessage = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await fetch(`${settings.backendUrl}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': settings.apiKey,
        },
        body: JSON.stringify({
          thread_id: threadId,
          message: message,
          system_prompt: 'You are a helpful AI assistant.',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from backend');
      }

      const data = await response.json();

      // Add assistant message to UI
      const assistantMessage = { role: 'assistant', content: data.response };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please check your settings and try again.');
      
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  if (loadingHistory) {
    return (
      <div className="flex-1 flex items-center justify-center h-screen overflow-hidden">
        <div className="text-slate-400">Loading chat history...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white h-screen overflow-hidden relative">
      <MessageList messages={messages} />
      <ChatInput onSend={handleSendMessage} disabled={loading} />
    </div>
  );
}