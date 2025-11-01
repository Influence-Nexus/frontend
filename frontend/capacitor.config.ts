import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cognitiondecision.app',
  appName: 'Cognition Decision',
  webDir: 'build',
  server: {
    url: 'http://192.168.0.116:3000',

    // url: 'http://10.131.103.114:3000',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      backgroundColor: '#ffffff',
      androidScaleType: 'CENTER_CROP',
    },
  },
};

export default config;
