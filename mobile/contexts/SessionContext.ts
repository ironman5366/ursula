import constate from "constate";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase.ts";
import { usePostHog } from "posthog-react-native";
import { ENVIRONMENT } from "../constants.ts";

export const [SessionProvider, useSession] = constate(() => {
  const [session, setSession] = useState<Session | null>(null);
  const posthog = usePostHog();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  useEffect(() => {
    if (session && session.user) {
      const identifier = `${ENVIRONMENT}:${session?.user?.id}`;
      posthog.identify(identifier, {
        id: session?.user?.id,
        email: session?.user?.email,
        environment: ENVIRONMENT,
      });
    }
  }, [posthog, session]);

  return {
    session,
    setSession,
  };
});
