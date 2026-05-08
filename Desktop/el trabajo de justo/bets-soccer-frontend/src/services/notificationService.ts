import { LocalNotifications } from '@capacitor/local-notifications';

export const notificationService = {
  async requestPermissions() {
    const status = await LocalNotifications.requestPermissions();
    return status.display === 'granted';
  },

  async scheduleMatchAlert(match: any) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: "¡Partido en Directo!",
          body: `${match.home} vs ${match.away} ha comenzado.`,
          id: match.id,
          schedule: { at: new Date(Date.now() + 1000) },
          sound: 'notification.wav',
          extra: { matchId: match.id }
        }
      ]
    });
  },

  async scheduleBetResult(bet: any, won: boolean, points: number) {
    await LocalNotifications.schedule({
      notifications: [
        {
          title: won ? "¡Apuesta Ganada! 🏆" : "Apuesta Finalizada",
          body: won 
            ? `Has ganado ${points} puntos en el ${bet.match.home} vs ${bet.match.away}`
            : `El partido ${bet.match.home} vs ${bet.match.away} ha terminado.`,
          id: Math.floor(Math.random() * 10000),
          schedule: { at: new Date(Date.now() + 1000) }
        }
      ]
    });
  }
};
