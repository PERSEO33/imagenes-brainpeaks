import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel
} from '@ionic/react';
import { Award } from 'lucide-react';
import { soccerService } from '../services/soccerService';

const Ranking: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const data = await soccerService.getLeaderboard();
        setUsers(data);
      } catch (e) {
        console.error('Error fetching leaderboard', e);
      }
    };
    fetchLeaderboard();
  }, []);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Ranking Global</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding">
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            padding: '20px',
            marginBottom: '20px'
          }}>
            <Award size={64} className="text-gold" style={{ marginBottom: '12px' }} />
            <h2 style={{ margin: 0, fontWeight: '800' }}>LÍDERES</h2>
            <p style={{ opacity: 0.6, fontSize: '0.9rem' }}>Los mejores pronosticadores de la clase</p>
          </div>

          <IonList style={{ background: 'transparent' }}>
            {users.map((user, i) => (
              <IonItem 
                key={user.id} 
                lines="none" 
                className="glass-card animate-fade" 
                style={{ 
                  marginBottom: '12px', 
                  '--padding-start': '16px',
                  animationDelay: `${i * 0.1}s`
                }}
              >
                <div slot="start" style={{ 
                  width: '24px', 
                  textAlign: 'center', 
                  fontWeight: '800',
                  color: i === 0 ? 'var(--gold)' : i === 1 ? '#C0C0C0' : i === 2 ? '#CD7F32' : '#fff',
                  fontSize: '1.2rem'
                }}>
                  {i + 1}
                </div>
                <IonAvatar slot="start" style={{ width: '40px', height: '40px', marginRight: '12px' }}>
                  <img src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`} />
                </IonAvatar>
                <IonLabel>
                  <div style={{ fontWeight: '700', fontSize: '1rem' }}>{user.username}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{user.points} pronósticos acertados</div>
                </IonLabel>
                <div slot="end" style={{ textAlign: 'right' }}>
                  <div className="text-neon" style={{ fontWeight: '800', fontSize: '1.2rem' }}>{user.points}</div>
                  <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>PUNTOS</div>
                </div>
              </IonItem>
            ))}
          </IonList>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Ranking;
