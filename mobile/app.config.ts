module.exports = {
  expo: {
    name: "Ursula",
    slug: "ursula",
    version: "1.0.6",
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
      buildNumber: "1",
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
      "expo-secure-store",
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
        // Supplied as an env variable because we don't want this to be set when
        // running locally - otherwise it blocks local dev on logging into EAS.
        // We set it in package.json for build and submit commands.
        projectId: process.env.EAS_PROJECT_ID,
      },
    },
  },
};
