import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PROJECT_URL } from "../constants/Urls";
// We need this polyfill for supabase for now - https://github.com/supabase/supabase/issues/8464
import "react-native-url-polyfill/auto";

import Constants from "expo-constants";

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

export const supabase = createClient(
  SUPABASE_PROJECT_URL,
  Constants.expoConfig?.extra && Constants.expoConfig.extra.supabaseAnonKey,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  }
);
