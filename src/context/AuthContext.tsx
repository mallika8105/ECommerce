import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
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

  // Helper function to create a profile if it doesn't exist
  const createProfileIfNotExist = useCallback(async (currentUser: User) => {
    // This function should not be called for mock admin users, but adding a safeguard
    if (currentUser.id === 'mock-admin-id') {
      console.log('AuthContext: Skipping profile creation for mock admin user.');
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', currentUser.id)
        .single();

      if (error && error.code === 'PGRST116') { // PGRST116 means no rows found
        // Profile does not exist, create it
        const { error: createError } = await supabase.from('profiles').insert({
          id: currentUser.id,
          email: currentUser.email,
          phone: currentUser.phone,
          name: currentUser.user_metadata?.name || 'New User',
          role: 'customer',
        });
        if (createError) {
          console.error('AuthContext: Error creating profile for new user:', createError);
        } else {
          console.log('AuthContext: Profile created for user:', currentUser.id);
        }
      } else if (error) {
        console.error('AuthContext: Error checking existing profile:', error);
      }
    } catch (err) {
      console.error('AuthContext: Unexpected error in createProfileIfNotExist:', err);
    }
  }, []);

  const checkAdminStatus = useCallback(async (userId: string) => {
    if (userId === 'mock-admin-id') {
      setIsAdmin(true);
      console.log('AuthContext: Skipping admin status check for mock admin user.');
      return;
    }
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
    }
  }, []);

  useEffect(() => {
    console.log('AuthContext: useEffect triggered. Initializing auth...');
    setLoading(true); // Ensure loading is true at the very start of auth process

    // Set up auth state listener for all changes, including initial session
    console.log('AuthContext: Setting up onAuthStateChange listener.');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        console.log('AuthContext: onAuthStateChange event triggered. Event:', _event, 'Session:', currentSession);

        try {
          // Handle mock admin session separately if it's active
          const adminLoggedIn = localStorage.getItem('adminLoggedIn');
          if (adminLoggedIn === 'true') {
            console.log('AuthContext: Mock admin session found. Setting mock user/session.');
            const mockUser: User = {
              id: 'mock-admin-id',
              email: 'admin@example.com',
              app_metadata: { provider: 'email' },
              aud: 'authenticated',
              created_at: new Date().toISOString(),
              user_metadata: { role: 'admin' },
            };
            
            const mockSession: Session = {
              access_token: 'mock-token',
              token_type: 'bearer',
              expires_in: 3600,
              refresh_token: 'mock-refresh-token',
              user: mockUser,
              expires_at: Date.now() + 3600000,
            };
            
            setUser(mockUser);
            setSession(mockSession);
            setIsAdmin(true);
            console.log('AuthContext: Mock admin session restored.');
          } else {
            // Process real Supabase session
            setSession(currentSession);
            setUser(currentSession?.user ?? null);
            console.log('AuthContext: User state updated to:', currentSession?.user ?? null); // Added log
            
            if (currentSession?.user) {
              // For real users, ensure profile exists and check admin status
              await createProfileIfNotExist(currentSession.user);
              await checkAdminStatus(currentSession.user.id);
            } else {
              setIsAdmin(false); // No user, not admin
              console.log('AuthContext: onAuthStateChange: No current user.');
            }
          }
        } catch (error) {
          console.error('AuthContext: onAuthStateChange error:', error);
          setUser(null);
          setSession(null);
          setIsAdmin(false);
        } finally {
          // This single call handles all cases for both mock and real sessions.
          setLoading(false);
          console.log('AuthContext: Auth state processed. Loading set to false. Current User:', user);
        }
      }
    );

    // Cleanup
    return () => {
      console.log('AuthContext: Cleaning up auth state listener.');
      subscription.unsubscribe();
    };
  }, [createProfileIfNotExist, checkAdminStatus]); // Dependencies for useCallback functions

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      // Handle mock admin authentication
      if (email === 'admin@example.com' && password === 'Admin@123') {
        const mockUser: User = {
          id: 'mock-admin-id',
          email: 'admin@example.com',
          app_metadata: { provider: 'email' },
          aud: 'authenticated',
          created_at: new Date().toISOString(),
          user_metadata: { role: 'admin' },
        };
        
        // Set mock session with 24-hour expiry
        const expiresAt = Date.now() + (24 * 60 * 60 * 1000); // 24 hours from now
        const mockSession: Session = {
          access_token: 'mock-token',
          token_type: 'bearer',
          expires_in: 24 * 60 * 60, // 24 hours in seconds
          refresh_token: 'mock-refresh-token',
          user: mockUser,
          expires_at: expiresAt,
        };
        
        // Store session details
        localStorage.setItem('adminLoggedIn', 'true');
        localStorage.setItem('adminSessionExpiresAt', expiresAt.toString());
        
        setUser(mockUser);
        setSession(mockSession);
        setIsAdmin(true);
        return { user: mockUser, error: null };
      }

      // Regular user authentication
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        setUser(data.user);
        setSession(data.session);
        await checkAdminStatus(data.user.id);
      }

      return { user: data.user, error: null };
    } catch (err: any) {
      console.error('Login error:', err.message);
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      localStorage.removeItem('adminLoggedIn');
      return { user: null, error: new Error(err.message) };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Clear mock admin session if it exists
      if (localStorage.getItem('adminLoggedIn')) {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminSessionExpiresAt');
        setUser(null);
        setSession(null);
        setIsAdmin(false);
        return { error: null };
      }

      // Regular user signout
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error(error.message);
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
