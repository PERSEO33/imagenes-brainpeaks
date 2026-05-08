import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonAvatar,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { soccerService } from '../services/soccerService';

const League: React.FC = () => {
  const [standings, setStandings] = useState<any[]>([]);
  const [segment, setSegment] = useState<'table' | 'teams'>('table');
  const history = useHistory();

  useEffect(() => {
    const fetchStandings = async () => {
      try {
        const data = await soccerService.getStandings();
        setStandings(data);
      } catch (e) {
        console.error('Error fetching standings', e);
      }
    };
    fetchStandings();
  }, []);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>La Liga</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div className="ion-padding">
          <IonSegment value={segment} onIonChange={e => setSegment(e.detail.value as any)} style={{ marginBottom: '20px' }}>
            <IonSegmentButton value="table">
              <IonLabel>Clasificación</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="teams">
              <IonLabel>Equipos</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {segment === 'table' ? (
            <div className="glass-card" style={{ padding: '8px', overflowX: 'auto' }}>
              <IonGrid className="ion-no-padding">
                <IonRow style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '8px 0', fontSize: '0.75rem', fontWeight: '700', opacity: 0.5 }}>
                  <IonCol size="1">Pos</IonCol>
                  <IonCol size="5">Equipo</IonCol>
                  <IonCol size="1">PJ</IonCol>
                  <IonCol size="1">PG</IonCol>
                  <IonCol size="1">PE</IonCol>
                  <IonCol size="1">PP</IonCol>
                  <IonCol size="2" style={{ textAlign: 'right' }}>Pts</IonCol>
                </IonRow>
                {standings.map((team, i) => (
                  <IonRow 
                    key={team.name} 
                    style={{ 
                      padding: '12px 0', 
                      borderBottom: '1px solid rgba(255,255,255,0.05)', 
                      fontSize: '0.9rem',
                      alignItems: 'center'
                    }}
                    onClick={() => history.push(`/tabs/team/${team.name}`)}
                  >
                    <IonCol size="1" style={{ fontWeight: i < 4 ? '700' : '400', color: i < 4 ? 'var(--neon-green)' : '#fff' }}>
                      {i + 1}
                    </IonCol>
                    <IonCol size="5" style={{ fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                      <IonAvatar style={{ width: '20px', height: '20px', marginRight: '8px' }}>
                        <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${team.name}`} />
                      </IonAvatar>
                      {team.name}
                    </IonCol>
                    <IonCol size="1">{team.pj}</IonCol>
                    <IonCol size="1">{team.pg}</IonCol>
                    <IonCol size="1">{team.pe}</IonCol>
                    <IonCol size="1">{team.pp}</IonCol>
                    <IonCol size="2" style={{ textAlign: 'right', fontWeight: '800' }}>{team.pts}</IonCol>
                  </IonRow>
                ))}
              </IonGrid>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {standings.map(team => (
                <div 
                  key={team.name} 
                  className="glass-card ion-padding" 
                  style={{ textAlign: 'center', cursor: 'pointer' }}
                  onClick={() => history.push(`/tabs/team/${team.name}`)}
                >
                  <IonAvatar style={{ width: '48px', height: '48px', margin: '0 auto 12px' }}>
                    <img src={`https://api.dicebear.com/7.x/identicon/svg?seed=${team.name}`} />
                  </IonAvatar>
                  <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>{team.name}</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>{team.strength} STR</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default League;
