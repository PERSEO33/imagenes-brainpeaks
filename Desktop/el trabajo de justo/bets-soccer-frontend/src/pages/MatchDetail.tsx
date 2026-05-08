import React, { useState, useEffect, useRef } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonButton,
  IonInput,
  IonToast,
  IonList,
  IonItem,
  IonAvatar
} from '@ionic/react';
import { useParams } from 'react-router-dom';
import { Send, Trophy, Ghost } from 'lucide-react';
import { soccerService } from '../services/soccerService';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const MatchDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<any>(null);
  const [segment, setSegment] = useState<'info' | 'chat'>('info');
  const [homeBet, setHomeBet] = useState<string>('');
  const [awayBet, setAwayBet] = useState<string>('');
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [toastMsg, setToastMsg] = useState('');
  const { user } = useAuth();
  const chatScrollRef = useRef<HTMLIonListElement>(null);

  const fetchMatch = async () => {
    try {
      const data = await soccerService.getMatchDetail(parseInt(id));
      setMatch(data);
    } catch (e) {
      console.error('Error fetching match detail', e);
    }
  };

  const fetchChat = async () => {
    try {
      const response = await api.get(`/api/messages/${id}`);
      setMessages(response.data);
    } catch (e) {
      console.error('Error fetching chat', e);
    }
  };

  useEffect(() => {
    fetchMatch();
    fetchChat();
    const interval = setInterval(() => {
      fetchMatch();
      if (segment === 'chat') fetchChat();
    }, 5000);
    return () => clearInterval(interval);
  }, [id, segment]);

  const handlePlaceBet = async () => {
    if (!homeBet || !awayBet) return;
    try {
      await api.post('/api/bets', {
        userId: user?.id,
        matchId: parseInt(id),
        homeScore: parseInt(homeBet),
        awayScore: parseInt(awayBet)
      });
      setToastMsg('¡Apuesta realizada con éxito!');
    } catch (e: any) {
      setToastMsg(e.response?.data?.message || 'Error al apostar');
    }
  };

  const handleSendMessage = async () => {
    if (!msg.trim()) return;
    try {
      await api.post('/api/messages', {
        matchId: parseInt(id),
        username: user?.username || 'Anónimo',
        text: msg
      });
      setMsg('');
      fetchChat();
    } catch (e) {
      console.error('Error sending message', e);
    }
  };

  if (!match) return null;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/dashboard" />
          </IonButtons>
          <IonTitle>Detalle del Partido</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ 
          background: 'linear-gradient(180deg, #050b18 0%, #0d121f 100%)', 
          padding: '40px 20px',
          textAlign: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.05)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{match.home}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: match.status === 'live' ? 'var(--neon-green)' : '#fff' }}>
                {match.status === 'pending' ? 'vs' : `${match.homeScore} - ${match.awayScore}`}
              </div>
              <div className="text-neon" style={{ fontSize: '0.9rem', fontWeight: '600' }}>
                {match.status === 'live' ? `${match.minute}'` : match.status === 'finished' ? 'Finalizado' : 'Próximamente'}
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{match.away}</div>
            </div>
          </div>
        </div>

        <IonSegment value={segment} onIonChange={e => setSegment(e.detail.value as any)} className="ion-padding-horizontal">
          <IonSegmentButton value="info">
            <IonLabel>Información</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="chat">
            <IonLabel>Chat</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {segment === 'info' ? (
          <div className="ion-padding">
            {match.status === 'pending' && (
              <div className="glass-card ion-padding" style={{ marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', display: 'flex', alignItems: 'center' }}>
                  <Trophy size={20} style={{ marginRight: '8px' }} className="text-gold" />
                  Realiza tu Pronóstico
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '4px' }}>{match.home}</div>
                    <IonInput 
                      type="number" 
                      value={homeBet} 
                      onIonChange={e => setHomeBet(e.detail.value!)}
                      className="glass" 
                      style={{ width: '60px', textAlign: 'center', fontSize: '1.2rem', fontWeight: '700' }}
                    />
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: '300', opacity: 0.3 }}>:</div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6, marginBottom: '4px' }}>{match.away}</div>
                    <IonInput 
                      type="number" 
                      value={awayBet} 
                      onIonChange={e => setAwayBet(e.detail.value!)}
                      className="glass" 
                      style={{ width: '60px', textAlign: 'center', fontSize: '1.2rem', fontWeight: '700' }}
                    />
                  </div>
                </div>
                <IonButton expand="block" className="btn-primary" onClick={handlePlaceBet}>
                  Enviar Apuesta
                </IonButton>
                <p style={{ fontSize: '0.75rem', opacity: 0.5, textAlign: 'center', marginTop: '12px' }}>
                  Gana 10 pts por resultado exacto o 5 pts por acertar el ganador/empate.
                </p>
              </div>
            )}

            <h3 style={{ margin: '0 0 12px 0', fontSize: '1rem', opacity: 0.6 }}>Línea de tiempo</h3>
            {match.events?.length > 0 ? (
              <div style={{ position: 'relative', paddingLeft: '20px', borderLeft: '2px solid rgba(255,255,255,0.05)' }}>
                {match.events.map((event: any, i: number) => (
                  <div key={i} style={{ marginBottom: '20px', position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', 
                      left: '-26px', 
                      top: '0', 
                      width: '10px', 
                      height: '10px', 
                      borderRadius: '50%', 
                      background: 'var(--neon-green)',
                      boxShadow: '0 0 8px var(--neon-green)'
                    }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div style={{ fontWeight: '600' }}>{event.player}</div>
                      <div className="text-neon">{event.minute}'</div>
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>
                      ¡Gol de {event.team}! ({event.score})
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', opacity: 0.4 }}>
                <Ghost size={48} style={{ marginBottom: '12px' }} />
                <p>No hay eventos registrados aún</p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <IonList ref={chatScrollRef} style={{ flex: 1, overflowY: 'auto', background: 'transparent' }}>
              {messages.map((m, i) => (
                <IonItem key={i} lines="none" style={{ '--padding-start': '16px', marginBottom: '8px' }}>
                  <IonAvatar slot="start" style={{ width: '32px', height: '32px' }}>
                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${m.username}`} />
                  </IonAvatar>
                  <div className="glass" style={{ padding: '8px 12px', borderRadius: '12px 12px 12px 0' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--neon-green)' }}>{m.username}</div>
                    <div style={{ fontSize: '0.9rem' }}>{m.text}</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.4, textAlign: 'right' }}>{m.time}</div>
                  </div>
                </IonItem>
              ))}
            </IonList>
            
            <div className="glass" style={{ padding: '12px', margin: '16px', display: 'flex', alignItems: 'center' }}>
              <IonInput 
                value={msg} 
                onIonChange={e => setMsg(e.detail.value!)}
                placeholder="Escribe un mensaje..."
                className="ion-no-padding"
                style={{ flex: 1 }}
              />
              <IonButton fill="clear" onClick={handleSendMessage} className="text-neon">
                <Send size={20} />
              </IonButton>
            </div>
          </div>
        )}

        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={3000}
          onDidDismiss={() => setToastMsg('')}
          color="success"
        />
      </IonContent>
    </IonPage>
  );
};

export default MatchDetail;
