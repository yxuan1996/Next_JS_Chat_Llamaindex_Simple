/**
 * Sidebar Component
 * Displays list of chat threads and navigation
 */

'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { signOut } from '@/lib/supabase';
import { PlusCircle, MessageSquare, Settings, LogOut } from 'lucide-react';

export default function Sidebar({ threads, currentThreadId, onNewChat }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  };

  const handleThreadClick = (threadId) => {
    router.push(`/chat/${threadId}`);
  };

  const handleSettings = () => {
    router.push('/settings');
  };

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col h-screen">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">AI Chat</h1>
        <Button
          onClick={onNewChat}
          className="w-full"
          variant="outline"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Chat
        </Button>
      </div>

      <Separator className="bg-slate-700" />

      {/* Thread List */}
      <ScrollArea className="flex-1 px-2">
        <div className="space-y-2 py-4">
          {threads.length === 0 ? (
            <div className="text-center text-slate-400 text-sm py-8">
              No chats yet. Create a new chat to get started!
            </div>
          ) : (
            threads.map((thread) => (
              <button
                key={thread.thread_id}
                onClick={() => handleThreadClick(thread.thread_id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                  currentThreadId === thread.thread_id
                    ? 'bg-slate-700 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="truncate text-sm font-medium">
                    {thread.thread_id}
                  </div>
                  <div className="text-xs text-slate-400">
                    {thread.message_count} messages
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>

      <Separator className="bg-slate-700" />

      {/* Bottom Navigation */}
      <div className="p-4 space-y-2">
        <Button
          onClick={handleSettings}
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button
          onClick={handleSignOut}
          variant="ghost"
          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}