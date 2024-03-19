import constate from "constate";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase.ts";
import { usePostHog } from "posthog-react-native";
import { ENVIRONMENT } from "../constants.ts";

export const [SessionProvider, useSession] = constate(() => {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const posthog = usePostHog();

  useEffect(() => {
    setLoading(true);
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        console.error("Error fetching session:", error.message);
      } else {
        setSession(data?.session);
      }
      setLoading(false);
    });

    return supabase.auth.onAuthStateChange((_event, session) =>
      setSession(session)
    ).data.subscription.unsubscribe;
  }, []);

  useEffect(() => {
    if (session && session.user && posthog) {
      const identifier = `${ENVIRONMENT}:${session.user.id}`;
      posthog.identify(identifier, {
        id: session.user.id,
        email: session.user.email,
        environment: ENVIRONMENT,
      });
    }
  }, [posthog, session]);

  return {
    loading,
    session,
    setSession,
  };
});
