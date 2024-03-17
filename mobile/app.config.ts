module.exports = {
  expo: {
    name: "Ursula",
    slug: "ursula",
    version: "1.0.2",
    orientation: "portrait",
    icon: "./assets/images/logo-192.png",
    scheme: "ursula",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/logo_cutout.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      buildNumber: "2",
      icon: "./assets/images/logo-192.png",
      bundleIdentifier: "com.willbeddow.ursula",
      supportsTablet: true,
    },
    android: {
      package: "com.willbeddow.ursula",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
    },
    web: {
      bundler: "metro",
      favicon: "./assets/images/favicon.png",
    },
    experiments: {
      typedRoutes: true,
    },
    plugins: [
      "expo-router",
      "expo-localization",
      [
        "expo-image-picker",
        {
          photosPermission: "The app lets you upload photos to your profile.",
        },
      ],
    ],
    extra: {
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      eas: {
        // Uncomment this for builds
        //projectId: "ac90d169-a022-4526-95a5-95e58f0151a4",
      },
    },
  },
};
