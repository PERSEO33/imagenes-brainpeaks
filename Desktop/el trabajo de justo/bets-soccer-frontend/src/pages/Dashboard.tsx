import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
  IonCard,
  IonCardContent,
  IonBadge,
  IonGrid,
  IonRow,
  IonCol,
  IonSkeletonText
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { Timer } from 'lucide-react';
import { soccerService } from '../services/soccerService';
import { notificationService } from '../services/notificationService';

const Dashboard: React.FC = () => {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useHistory();

  const fetchMatches = async () => {
    try {
      const data = await soccerService.getMatches();
      setMatches(data);
      
      data.forEach((m: any) => {
        if (m.status === 'live' && m.minute === 1) {
          notificationService.scheduleMatchAlert(m);
        }
      });
    } catch (e) {
      console.error('Error fetching matches', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = async (event: CustomEvent) => {
    await fetchMatches();
    event.detail.complete();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'danger';
      case 'finished': return 'medium';
      case 'pending': return 'primary';
      default: return 'primary';
    }
  };

  const getStatusText = (match: any) => {
    if (match.status === 'live') return `${match.minute}'`;
    if (match.status === 'finished') return 'Finalizado';
    return match.time ? new Date(match.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Pendiente';
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle style={{ fontWeight: '800', letterSpacing: '1px' }}>
            BETS<span className="text-neon">SOCCER</span>
          </IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        <div className="ion-padding">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <Timer className="text-neon" size={20} style={{ marginRight: '8px' }} />
            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '600' }}>Partidos de Hoy</h2>
          </div>

          {loading ? (
            [1, 2, 3, 4].map(i => (
              <IonCard key={i} className="glass-card" style={{ margin: '0 0 16px 0' }}>
                <IonCardContent>
                  <IonSkeletonText animated style={{ width: '100%', height: '60px', borderRadius: '8px' }} />
                </IonCardContent>
              </IonCard>
            ))
          ) : (
            matches.map(match => (
              <IonCard 
                key={match.id} 
                className="glass-card" 
                style={{ margin: '0 0 16px 0' }}
                onClick={() => history.push(`/tabs/match/${match.id}`)}
              >
                <IonCardContent className="ion-no-padding" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <IonBadge color={getStatusColor(match.status)} style={{ borderRadius: '4px', padding: '4px 8px' }}>
                      {getStatusText(match)}
                    </IonBadge>
                    <IonText style={{ fontSize: '0.8rem', opacity: 0.5 }}>{match.league || 'La Liga'}</IonText>
                  </div>

                  <IonGrid className="ion-no-padding">
                    <IonRow className="ion-align-items-center">
                      <IonCol size="5" style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{match.home}</div>
                      </IonCol>
                      <IonCol size="2" style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '1.5rem', 
                          fontWeight: '800', 
                          color: match.status === 'live' ? 'var(--neon-green)' : '#fff' 
                        }}>
                          {match.status === 'pending' ? 'vs' : `${match.homeScore} - ${match.awayScore}`}
                        </div>
                      </IonCol>
                      <IonCol size="5" style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: '600', fontSize: '1.1rem' }}>{match.away}</div>
                      </IonCol>
                    </IonRow>
                  </IonGrid>

                  {match.events?.length > 0 && match.status === 'live' && (
                    <div style={{ 
                      marginTop: '12px', 
                      padding: '8px', 
                      background: 'rgba(255,255,255,0.05)', 
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <div className="text-neon" style={{ marginRight: '8px' }}>●</div>
                      <div style={{ opacity: 0.8 }}>
                        {match.events[match.events.length - 1].player} marcó el último gol
                      </div>
                    </div>
                  )}
                </IonCardContent>
              </IonCard>
            ))
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Dashboard;

const IonText: React.FC<{ children: React.ReactNode, style?: React.CSSProperties, className?: string }> = ({ children, style, className }) => (
  <span className={className} style={style}>{children}</span>
);
