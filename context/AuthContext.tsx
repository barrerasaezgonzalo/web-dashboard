"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";
import { trackError } from "@/utils/logger";

interface AuthContextProps {
  userId: string | null;
  userName: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  userId: null,
  loading: false,
  userName: "",
  signInWithGoogle: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw new Error("signOut: Error al cerrar sesión con Google");
      }
      setUserId(null);
      setUserName(null);
    } catch (error) {
      trackError(error, "signOut");
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      const user = data.session?.user;

      setUserId(user?.id ?? null);
      setUserName(
        user?.user_metadata?.full_name ??
          user?.user_metadata?.name ??
          user?.email ??
          null,
      );
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      const user = session?.user;

      setUserId(user?.id ?? null);
      setUserName(
        user?.user_metadata?.full_name ??
          user?.user_metadata?.name ??
          user?.email ??
          null,
      );
      setLoading(false);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "select_account",
          },
        },
      });
      if (error) {
        throw new Error("signInWithGoogle: Error al iniciar sesión con Google");
      }
    } catch (error) {
      trackError(error, "signInWithGoogle");
    }
  };

  return (
    <AuthContext.Provider
      value={{ userId, loading, userName, signOut, signInWithGoogle }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
