import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonBadge,
  IonSkeletonText
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { soccerService } from '../services/soccerService';

const TeamDetail: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const data = await soccerService.getTeamPlayers(name);
        setPlayers(data);
      } catch (e) {
        console.error('Error fetching players', e);
      } finally {
        setLoading(false);
      }
    };
    fetchPlayers();
  }, [name]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/league" />
          </IonButtons>
          <IonTitle>{name}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ 
          background: 'linear-gradient(180deg, #050b18 0%, #0d121f 100%)', 
          padding: '30px 20px',
          textAlign: 'center'
        }}>
          <IonAvatar style={{ width: '80px', height: '80px', margin: '0 auto 16px' }}>
            <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${name}`} />
          </IonAvatar>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '800' }}>{name}</h1>
          <p style={{ opacity: 0.6 }}>Plantilla Oficial 2025/26</p>
        </div>

        <div className="ion-padding">
          <h2 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px' }}>Jugadores</h2>
          
          {loading ? (
            [1,2,3,4,5].map(i => (
              <IonItem key={i} lines="none" className="glass-card" style={{ marginBottom: '8px' }}>
                <IonAvatar slot="start">
                  <IonSkeletonText animated />
                </IonAvatar>
                <IonLabel>
                  <IonSkeletonText animated style={{ width: '60%' }} />
                  <IonSkeletonText animated style={{ width: '30%' }} />
                </IonLabel>
              </IonItem>
            ))
          ) : (
            <IonList style={{ background: 'transparent' }}>
              {players.map(player => (
                <IonItem key={player.id} lines="none" className="glass-card" style={{ marginBottom: '8px', '--padding-start': '12px' }}>
                  <IonAvatar slot="start" style={{ width: '40px', height: '40px' }}>
                    <img src={player.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`} />
                  </IonAvatar>
                  <IonLabel>
                    <div style={{ fontWeight: '600' }}>{player.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>{name}</div>
                  </IonLabel>
                  <IonBadge slot="end" color="primary" style={{ borderRadius: '4px' }}>
                    {player.goals} Goles
                  </IonBadge>
                </IonItem>
              ))}
            </IonList>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default TeamDetail;
