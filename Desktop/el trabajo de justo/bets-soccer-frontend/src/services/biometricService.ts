import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { Capacitor } from '@capacitor/core';

export const biometricService = {
  async isAvailable() {
    if (Capacitor.getPlatform() === 'web') return false;
    const result = await NativeBiometric.isAvailable();
    return result.isAvailable;
  },

  async verifyIdentity() {
    if (Capacitor.getPlatform() === 'web') return true;
    
    try {
      await NativeBiometric.verifyIdentity({
        reason: "Identificación necesaria para acceder a tus datos sensibles.",
        title: "Seguridad Bets Soccer",
        subtitle: "Verifica tu identidad",
        description: "Usa tu huella o reconocimiento facial."
      });
      return true;
    } catch (e) {
      console.error('Biometric verification failed', e);
      return false;
    }
  }
};
