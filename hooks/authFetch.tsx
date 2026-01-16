import { supabase } from "@/lib/supabaseClient";

export const authFetch = async (url: string, options: RequestInit = {}) => {
  let {
    data: { session },
  } = await supabase.auth.getSession();
  if (
    !session ||
    (session.expires_at && Date.now() / 1000 > session.expires_at)
  ) {
    const {
      data: { session: refreshedSession },
    } = await supabase.auth.refreshSession();
    session = refreshedSession;
  }
  const token = session?.access_token;
  if (!token) {
    throw new Error("No active session");
  }

  const headers = new Headers(options.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  if (
    options.method &&
    options.method !== "GET" &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...options,
    headers,
  });

  // const headers: Record<string, string> = {
  //   Authorization: `Bearer ${token}`,
  //   "Content-Type": "application/json",
  //   ...options.headers,
  // };

  // return fetch(url, {
  //   ...options,
  //   headers,
  // });
};
