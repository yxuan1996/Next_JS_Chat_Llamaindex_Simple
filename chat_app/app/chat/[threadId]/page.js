/**
 * Chat Thread Page
 * Displays a specific chat conversation with proper layout
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUser } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import ChatInterface from '@/components/ChatInterface';

export default function ChatThreadPage() {
  const router = useRouter();
  const params = useParams();
  const threadId = params.threadId;
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    checkAuth();
    loadThreads();
  }, []);

  const checkAuth = async () => {
    const user = await getUser();
    if (!user) {
      router.push('/login');
    }
  };

  const loadThreads = async () => {
    try {
      const settings = getSettings();
      if (!settings.backendUrl || !settings.apiKey) {
        return;
      }

      const response = await fetch(`${settings.backendUrl}/threads`, {
        headers: {
          'X-API-Key': settings.apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setThreads(data.threads || []);
      }
    } catch (error) {
      console.error('Error loading threads:', error);
    }
  };

  const getSettings = () => {
    if (typeof window !== 'undefined') {
      return {
        backendUrl: localStorage.getItem('backendUrl') || '',
        apiKey: localStorage.getItem('apiKey') || '',
      };
    }
    return { backendUrl: '', apiKey: '' };
  };

  const handleNewChat = () => {
    const newThreadId = `thread_${Date.now()}`;
    router.push(`/chat/${newThreadId}`);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar
        threads={threads}
        currentThreadId={threadId}
        onNewChat={handleNewChat}
      />
      <ChatInterface threadId={threadId} />
    </div>
  );
}