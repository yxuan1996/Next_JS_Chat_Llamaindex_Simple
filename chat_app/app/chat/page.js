/**
 * Chat Page (Default - No Thread Selected)
 * Shows welcome message and prompts user to create a new chat
 */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { PlusCircle, Settings } from 'lucide-react';

export default function ChatPage() {
  const router = useRouter();
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

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
    setLoading(true);
    try {
      const settings = getSettings();
      if (!settings.backendUrl || !settings.apiKey) {
        setLoading(false);
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
    } finally {
      setLoading(false);
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
    <div className="flex h-screen">
      <Sidebar
        threads={threads}
        currentThreadId={null}
        onNewChat={handleNewChat}
      />
      
      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 p-8">
        <div className="max-w-md text-center space-y-6">
          <div className="text-6xl mb-4">💬</div>
          <h1 className="text-3xl font-bold text-slate-800">
            Welcome to AI Chat
          </h1>
          <p className="text-slate-600">
            Create a new chat to start a conversation with your AI assistant.
          </p>
          
          <div className="space-y-3">
            <Button onClick={handleNewChat} size="lg" className="w-full">
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Chat
            </Button>
            
            {!getSettings().backendUrl && (
              <Button
                onClick={() => router.push('/settings')}
                variant="outline"
                size="lg"
                className="w-full"
              >
                <Settings className="mr-2 h-5 w-5" />
                Configure Settings First
              </Button>
            )}
          </div>

          {!getSettings().backendUrl && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
              ⚠️ Please configure your backend URL and API key in Settings before chatting.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}