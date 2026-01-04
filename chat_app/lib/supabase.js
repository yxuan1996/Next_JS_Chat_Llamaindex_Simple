/**
 * Supabase Client Configuration
 * Using @supabase/ssr for Next.js App Router
 */

import { createBrowserClient } from '@supabase/ssr';

/**
 * Creates and returns a Supabase client for browser/client components
 * This is used throughout the app for authentication and database operations
 */
export const createClient = () => {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};

/**
 * Helper function to get the current user session
 * Returns null if no user is logged in
 */
export const getSession = async () => {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  return session;
};

/**
 * Helper function to get the current user
 * Returns null if no user is logged in
 */
export const getUser = async () => {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

/**
 * Sign up a new user with email and password
 */
// export const signUp = async (email, password) => {
//   const supabase = createClient();
//   return await supabase.auth.signUp({
//     email,
//     password,
//   });
// };

/**
 * Sign in an existing user
 */
export const signIn = async (email, password) => {
  const supabase = createClient();
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

/**
 * Sign out the current user
 */
export const signOut = async () => {
  const supabase = createClient();
  return await supabase.auth.signOut();
};