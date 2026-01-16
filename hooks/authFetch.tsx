import { supabase } from "@/lib/supabaseClient";

export const authFetch = async (url: string, options: RequestInit = {}) => {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession();

  let token = session?.access_token;

  if (
    !token ||
    (session?.expires_at && Date.now() / 1000 > session.expires_at)
  ) {
    const { data: refreshData, error: refreshError } =
      await supabase.auth.refreshSession();
    if (refreshError) {
      console.error("Sesión expirada, re-logueo necesario");
      return Promise.reject("Unauthorized");
    }
    token = refreshData.session?.access_token;
  }

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    console.warn("Token rechazado por el servidor");
  }

  return response;
};
