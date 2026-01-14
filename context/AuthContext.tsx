"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";

interface AuthContextProps {
  userId: string | null;
  userName: string | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  userId: null,
  loading: false,
  userName: "",
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUserId(null);
      setUserName(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
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

  return (
    <AuthContext.Provider value={{ userId, loading, userName, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
