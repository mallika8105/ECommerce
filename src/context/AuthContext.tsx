import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js'; // Keep User type for now, might need to define a custom User type later
import { supabase } from '../supabaseClient'; // Import supabase client
import type { Session } from '@supabase/supabase-js';
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ user: User | null; error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log("AuthContext: useEffect started. Initial loading state:", loading);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        try {
          setSession(session);
          setUser(session?.user || null);
          if (session?.user) {
            await checkAdminStatus(session.user.id);
          } else {
            setIsAdmin(false);
          }
        } catch (error) {
          console.error("Error in onAuthStateChange callback:", error);
          setUser(null);
          setSession(null);
          setIsAdmin(false);
        } finally {
          setLoading(false);
          console.log("AuthContext: onAuthStateChange callback finished. Loading set to false.");
        }
      }
    );

    // Initial session check
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user || null);
      if (session?.user) {
        await checkAdminStatus(session.user.id);
      }
    }).catch((error) => {
      console.error("Error getting initial session:", error);
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }).finally(() => {
      setLoading(false); // Ensure loading is always set to false
      console.log("AuthContext: Initial session check finished. Loading set to false.");
    });

    return () => {
      subscription.unsubscribe();
      console.log("AuthContext: useEffect cleanup. Subscription unsubscribed.");
    };
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching user role:', error);
        setIsAdmin(false);
        return;
      }
      setIsAdmin(data?.role?.toLowerCase() === 'admin');
    } catch (error) {
      console.error('Error fetching user role:', error);
      setIsAdmin(false);
    } finally {
      // Ensure loading is handled if this is part of an initial load, though useEffect's finally should cover it.
      // This is more for robustness if checkAdminStatus is called independently.
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    console.log("AuthContext: signIn started. Loading set to true.");
    try {
      // Mock admin authentication
      if (email === 'admin@example.com' && password === 'Admin@123') {
        // Simulate a user object for the mock admin
        const mockUser: User = {
          id: 'mock-admin-id',
          email: 'admin@example.com',
          app_metadata: { provider: 'email' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          user_metadata: {},
        };
        setUser(mockUser);
        setIsAdmin(true); // Directly set isAdmin for mock admin
        return { user: mockUser, error: null };
      }

      // Actual Supabase authentication for other users
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        console.error('Login error:', error.message);
        return { user: null, error: new Error(error.message) };
      }
      setUser(data.user);
      if (data.user) {
        await checkAdminStatus(data.user.id);
      }
      return { user: data.user, error: null };
    } catch (err: any) {
      console.error('Login error:', err.message);
      return { user: null, error: new Error(err.message) };
    } finally {
      setLoading(false);
      console.log("AuthContext: signIn finished. Loading set to false.");
    }
  };

  const signOut = async () => {
    setLoading(true);
    console.log("AuthContext: signOut started. Loading set to true.");
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Logout error:', error.message);
        return { error: new Error(error.message) };
      }
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      return { error: null };
    } catch (err: any) {
      console.error('Logout error:', err.message);
      return { error: new Error(err.message) };
    } finally {
      setLoading(false);
      console.log("AuthContext: signOut finished. Loading set to false.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
