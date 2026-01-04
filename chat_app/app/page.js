/**
 * Home Page
 * Redirects to login or chat based on auth status
 */

'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/supabase';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  const checkAuthAndRedirect = async () => {
    const user = await getUser();
    if (user) {
      router.push('/chat');
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-slate-500">Loading...</div>
    </div>
  );
}