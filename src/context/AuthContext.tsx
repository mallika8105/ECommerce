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

  // Helper function to create a profile if it doesn't exist
  const createProfileIfNotExist = async (user: User) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') { // PGRST116 means no rows found
        // Profile does not exist, create it
        const { error: createError } = await supabase.from('profiles').insert({
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.user_metadata?.name || 'New User',
          role: 'customer',
        });
        if (createError) {
          console.error('AuthContext: Error creating profile for new user:', createError);
        } else {
          console.log('AuthContext: Profile created for user:', user.id);
        }
      } else if (error) {
        console.error('AuthContext: Error checking existing profile:', error);
      }
    } catch (err) {
      console.error('AuthContext: Unexpected error in createProfileIfNotExist:', err);
    }
  };

  useEffect(() => {
    console.log('AuthContext: useEffect triggered. Initializing auth...');
    // setLoading(true); // Ensure loading is true at the very start of auth process

    // Initialize auth state
    const initializeAuth = async () => {
      console.log('AuthContext: initializeAuth started.');
      try {
        // First check for mock admin session
        const adminLoggedIn = localStorage.getItem('adminLoggedIn');
        if (adminLoggedIn === 'true') {
          console.log('AuthContext: Mock admin session found.');
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
          setLoading(false);
          console.log('AuthContext: Mock admin session restored. Loading set to false.');
          return; // Exit early as we've restored the mock admin session
        }

        // Check for existing Supabase session
        console.log('AuthContext: Checking for existing Supabase session...');
        const { data: { session: existingSession }, error: sessionError } = await supabase.auth.getSession();
        console.log('AuthContext: supabase.auth.getSession() completed. Session:', existingSession, 'Error:', sessionError);
        
        if (sessionError) {
          console.error('AuthContext: Error getting session:', sessionError);
          throw sessionError;
        }

        if (existingSession?.user) {
          console.log('AuthContext: Existing Supabase session found. User:', existingSession.user.id);
          
          console.log('AuthContext: initializeAuth: Before setSession(existingSession).');
          setSession(existingSession);
          console.log('AuthContext: initializeAuth: After setSession(existingSession). Before setUser(existingSession.user).');
          setUser(existingSession.user);
          console.log('AuthContext: initializeAuth: After setUser(existingSession.user).');

          try {
            console.log('AuthContext: initializeAuth: Before createProfileIfNotExist.');
            await createProfileIfNotExist(existingSession.user); // Ensure profile exists
            console.log('AuthContext: initializeAuth: After createProfileIfNotExist.');

            // Check for admin status in user metadata first
            if (existingSession.user.user_metadata?.role === 'admin') {
              setIsAdmin(true);
              console.log('AuthContext: initializeAuth: User is admin (from metadata).');
            } else {
              // Fallback to profiles table check
              try {
                console.log('AuthContext: initializeAuth: Before checking admin status from profiles table.');
                const { data: profile, error: profileError } = await supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', existingSession.user.id)
                  .single();
                console.log('AuthContext: initializeAuth: After checking admin status from profiles table. Data:', profile, 'Error:', profileError);

                if (profileError && profileError.code !== 'PGRST116') {
                  console.error('AuthContext: initializeAuth: Error fetching profile for admin check:', profileError);
                  throw profileError; // Re-throw if it's a different error
                }
                setIsAdmin(profile?.role?.toLowerCase() === 'admin');
                console.log('AuthContext: initializeAuth: Admin status from profiles:', profile?.role?.toLowerCase() === 'admin');
              } catch (profileFetchError: any) {
                console.error('AuthContext: initializeAuth: Error fetching profile for admin check:', profileFetchError);
                setIsAdmin(false); // Assume not admin if profile fetch fails or not found
              }
            }
          } catch (profileSetupError) {
            console.error('AuthContext: initializeAuth: Error during profile setup or admin check:', profileSetupError);
            // Even if profile setup fails, we should still proceed and not get stuck
            setIsAdmin(false); // Assume not admin if profile setup fails
          }
        } else {
          console.log('AuthContext: No existing Supabase session found.');
          // No existing session or user, ensure states are null and loading is false
          setUser(null);
          setSession(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('AuthContext: Auth initialization error:', error);
        // Only clear everything if there's no admin session
        if (localStorage.getItem('adminLoggedIn') !== 'true') {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
        }
      } finally {
        console.log('AuthContext: initializeAuth finally block reached. Setting loading to false.');
        setLoading(false);
        // Log the state variables directly, which will be updated by the time this finally block executes
        console.log('AuthContext: initializeAuth completed. User:', user);
        console.log('AuthContext: initializeAuth completed. Is Admin:', isAdmin);
      }
    };

    // Set up auth state listener
    console.log('AuthContext: Setting up onAuthStateChange listener.');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        console.log('AuthContext: onAuthStateChange event triggered. Event:', _event, 'Session:', currentSession);
        try {
          // Don't override mock admin session
          if (localStorage.getItem('adminLoggedIn') === 'true') {
            console.log('AuthContext: Mock admin session active, skipping onAuthStateChange update.');
            return;
          }

          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          
          if (currentSession?.user) {
            await createProfileIfNotExist(currentSession.user); // Ensure profile exists

            // Check user metadata first
            if (currentSession.user.user_metadata?.role === 'admin') {
              setIsAdmin(true);
              console.log('AuthContext: onAuthStateChange: User is admin (from metadata).');
            } else {
              try {
                console.log('AuthContext: onAuthStateChange: Checking admin status from profiles table...');
                const { data: profile, error: profileError } = await supabase
                  .from('profiles')
                  .select('role')
                  .eq('id', currentSession.user.id)
                  .single();

                if (profileError && profileError.code !== 'PGRST116') {
                  console.error('AuthContext: onAuthStateChange: Error fetching profile for admin check:', profileError);
                  throw profileError; // Re-throw if it's a different error
                }
                setIsAdmin(profile?.role?.toLowerCase() === 'admin');
                console.log('AuthContext: onAuthStateChange: Admin status from profiles:', profile?.role?.toLowerCase() === 'admin');
              } catch (profileFetchError: any) {
                console.error('AuthContext: onAuthStateChange: Error checking admin status:', profileFetchError);
                setIsAdmin(false); // Assume not admin if profile fetch fails or not found
              }
            }
          } else {
            setIsAdmin(false);
            console.log('AuthContext: onAuthStateChange: No current user.');
          }
          console.log('AuthContext: onAuthStateChange event completed. User:', currentSession?.user);
          console.log('AuthContext: onAuthStateChange event completed. Is Admin:', isAdmin);
        } catch (error) {
          console.error('AuthContext: onAuthStateChange error:', error);
          // Ensure loading is reset even if an error occurs in the listener
          setUser(null);
          setSession(null);
          setIsAdmin(false);
        } finally {
          setLoading(false); // Ensure loading is always reset after auth state changes
          console.log('AuthContext: onAuthStateChange finally. Loading set to false.');
        }
      }
    );

    // Initialize
    initializeAuth();

    // Cleanup
    return () => {
      console.log('AuthContext: Cleaning up auth state listener.');
      subscription.unsubscribe();
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
