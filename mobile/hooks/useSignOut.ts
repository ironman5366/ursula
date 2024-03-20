import { supabase } from "../utils/supabase.ts";
import { router } from "expo-router";

export default function useSignOut() {
  const signOut = async () => {
    router.replace("/(onboard)/login");
    await supabase.auth.signOut();
  };

  return signOut;
}
