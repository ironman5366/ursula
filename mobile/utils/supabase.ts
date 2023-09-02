import * as SecureStore from "expo-secure-store";
import { createClient, User } from "@supabase/supabase-js";
import { SUPABASE_ANON_KEY, SUPABASE_PROJECT_URL } from "../constants";
import { Database } from "../types/Database";

// We need this polyfill for supabase for now - https://github.com/supabase/supabase/issues/8464
import "react-native-url-polyfill/auto";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    SecureStore.deleteItemAsync(key);
  },
};

export function getUser(): Promise<User> {
  // TODO: should this just be in a higher context? probably
  return new Promise((resolve, reject) => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        resolve(session.user);
      } else {
      }
    });
  });
}

export const supabase = createClient<Database>(
  SUPABASE_PROJECT_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
