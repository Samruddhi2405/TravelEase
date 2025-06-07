module.exports = {
  expo: {
    name: "avent",
    slug: "avent",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icons/icon.png",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "cover",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.avent.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icons/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      package: "com.avent.app"
    },
    web: {
      favicon: "./assets/icons/favicon.png"
    },
    scheme: "avent",
    extra: {
      geoapifyKey: "169fa9a94ce74674bc3d02f84c84dd29"
    }
  }
}; 