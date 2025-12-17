"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";

interface UserContextProps {
  userId: string | null;
  userName: string | null;
  loading: boolean;
}

const UserContext = createContext<UserContextProps>({
  userId: null,
  loading: false,
  userName: "",
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
    <UserContext.Provider value={{ userId, loading, userName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
