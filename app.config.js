export default {
  expo: {
    name: 'pledgr',
    slug: 'pledgr',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'pledgr',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.pledgr.app'
    },
    android: {
      package: 'com.pledgr.app'
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png'
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true
    },
    extra: {
      // Only keep the native client ID since we're focusing on mobile
      googleClientId: 'YOUR_GOOGLE_CLIENT_ID',
    },
    scheme: 'pledgr'
  }
};