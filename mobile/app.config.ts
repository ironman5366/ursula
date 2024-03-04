module.exports = {
  name: "ursula",
  slug: "ursula",
  version: "1.0.1",
  orientation: "portrait",
  icon: "./assets/images/logo-192.png",
  scheme: "ursula",
  userInterfaceStyle: "automatic",
  splash: {
    image: "./assets/images/logo.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
  },
  web: {
    bundler: "metro",
    favicon: "./assets/images/favicon.png",
  },
  extra: {
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  },
  expo: {
    scheme: "ursula",
    slug: "ursula",
    name: "Ursula",
    experiments: {
      typedRoutes: true,
    },
    android: {
      package: "com.willbeddow.ursula",
    },
    ios: {
      bundleIdentifier: "com.willbeddow.ursula",
    },
    plugins: ["expo-router"],
    extra: {
      eas: {
        projectId: "ac90d169-a022-4526-95a5-95e58f0151a4",
      },
    },
  },
};
