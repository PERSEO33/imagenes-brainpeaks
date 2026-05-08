import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.perseo33.betssoccer',
  appName: 'BetsSoccer',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
