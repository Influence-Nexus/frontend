import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.cognitiondecision.app',
  appName: 'Cognition Decision',
  webDir: 'build',
  server: {
    url: 'http://192.168.0.116:3000',
    cleartext: true,
  },
};

export default config;
