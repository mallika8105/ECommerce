import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js"; // Keep User type for now, might need to define a custom User type later
import { supabase } from "../supabaseClient"; // Import supabase client
import type { Session } from "@supabase/supabase-js";
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ user: User | null; error: Error | null }>;
  signInWithGoogle: () => Promise<{ user: User | null; error: Error | null }>;
  signOut: () => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initialize auth state
    const initializeAuth = async () => {
      try {
        // First check for mock admin session
        const adminLoggedIn = localStorage.getItem("adminLoggedIn");
        const sessionExpiresAt = localStorage.getItem("adminSessionExpiresAt");
        
        if (adminLoggedIn === "true") {
          // Check if session has expired
          if (sessionExpiresAt && Date.now() > parseInt(sessionExpiresAt)) {
            // Session expired, clear it
            localStorage.removeItem("adminLoggedIn");
            localStorage.removeItem("adminSessionExpiresAt");
            setUser(null);
            setSession(null);
            setIsAdmin(false);
            setLoading(false);
            return;
          }

          const mockUser: User = {
            id: "a0000000-0000-4000-8000-000000000001", // Replaced with a valid UUID format
            email: "admin@example.com",
            app_metadata: { provider: "email" },
            aud: "authenticated",
            created_at: new Date().toISOString(),
            user_metadata: { role: "admin" },
          };

          const mockSession: Session = {
            access_token: "mock-token",
            token_type: "bearer",
            expires_in: 3600,
            refresh_token: "mock-refresh-token",
            user: mockUser,
            expires_at: parseInt(sessionExpiresAt || "0"),
          };

          setUser(mockUser);
          setSession(mockSession);
          setIsAdmin(true);
          setLoading(false);
          return; // Exit early as we've restored the mock admin session
        }

        // Check for existing Supabase session
        const {
          data: { session: existingSession },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;

        if (existingSession?.user) {
          setSession(existingSession);
          setUser(existingSession.user);

          // Check for admin status in user metadata first
          if (existingSession.user.user_metadata?.role === "admin") {
            setIsAdmin(true);
          } else {
            // Fallback to profiles table check
            const { data: profile } = await supabase
              .from("profiles")
              .select("role")
              .eq("id", existingSession.user.id)
              .single();

            setIsAdmin(profile?.role?.toLowerCase() === "admin");
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        // Only clear everything if there's no admin session
        if (localStorage.getItem("adminLoggedIn") !== "true") {
          setUser(null);
          setSession(null);
          setIsAdmin(false);
        }
      } finally {
        setLoading(false);
      }
    };

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, currentSession) => {
      console.log(
        "AuthContext: onAuthStateChange event:",
        event,
        "hasSession:",
        !!currentSession
      );

      // Don't override mock admin session
      if (localStorage.getItem("adminLoggedIn") === "true") {
        console.log("AuthContext: Skipping - mock admin session active");
        return;
      }

      // Update session and user immediately (synchronously)
      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      // Set admin status from user metadata only (no async DB call)
      if (currentSession?.user?.user_metadata?.role === "admin") {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }

      // ALWAYS set loading to false immediately
      console.log("AuthContext: Setting loading to false");
      setLoading(false);
    });

    // Initialize
    initializeAuth();

    // Cleanup
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        setIsAdmin(false);
        return;
      }
      setIsAdmin(data?.role?.toLowerCase() === "admin");
    } catch (error) {
      console.error("Error fetching user role:", error);
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
      if (email === "admin@example.com" && password === "Admin@123") {
        const mockUser: User = {
          id: "mock-admin-id",
          email: "admin@example.com",
          app_metadata: { provider: "email" },
          aud: "authenticated",
          created_at: new Date().toISOString(),
          user_metadata: { role: "admin" },
        };

        // Set mock session with 24-hour expiry
        const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
        const mockSession: Session = {
          access_token: "mock-token",
          token_type: "bearer",
          expires_in: 24 * 60 * 60, // 24 hours in seconds
          refresh_token: "mock-refresh-token",
          user: mockUser,
          expires_at: expiresAt,
        };

        // Store session details
        localStorage.setItem("adminLoggedIn", "true");
        localStorage.setItem("adminSessionExpiresAt", expiresAt.toString());

        setUser(mockUser);
        setSession(mockSession);
        setIsAdmin(true);
        return { user: mockUser, error: null };
      }

      // Regular user authentication
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

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
      console.error("Login error:", err.message);
      setUser(null);
      setSession(null);
      setIsAdmin(false);
      localStorage.removeItem("adminLoggedIn");
      return { user: null, error: new Error(err.message) };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      // Clear mock admin session if it exists
      if (localStorage.getItem("adminLoggedIn")) {
        localStorage.removeItem("adminLoggedIn");
        localStorage.removeItem("adminSessionExpiresAt");
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
      console.error("Logout error:", err.message);
      return { error: new Error(err.message) };
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
      });

      if (error) {
        throw new Error(error.message);
      }

      // Supabase redirects, so user/session will be updated by onAuthStateChange listener
      return { user: null, error: null };
    } catch (err: any) {
      console.error("Google login error:", err.message);
      return { user: null, error: new Error(err.message) };
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, isAdmin, loading, signIn, signInWithGoogle, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
