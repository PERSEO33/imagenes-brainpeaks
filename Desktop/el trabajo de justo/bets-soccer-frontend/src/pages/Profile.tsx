import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonAvatar,
  IonList,
  IonBadge,
  IonToast
} from '@ionic/react';
import { LogOut, Camera, ShieldCheck, History } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useHistory } from 'react-router-dom';
import { biometricService } from '../services/biometricService';
import api from '../services/api';
import { Camera as CapCamera, CameraResultType } from '@capacitor/camera';

const Profile: React.FC = () => {
  const { user, logout, updateUser } = useAuth();
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const history = useHistory();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user) return;
      try {
        const response = await api.get(`/api/bets/user/${user.id}`);
        setBets(response.data);
      } catch (e) {
        console.error('Error fetching history', e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    history.replace('/login');
  };

  const handleEditProfile = async () => {
    const isAuth = await biometricService.verifyIdentity();
    if (isAuth) {
      setToastMsg('Identidad verificada. Puedes editar tu perfil.');

    } else {
      setToastMsg('Autenticación biométrica fallida');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const image = await CapCamera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Base64
      });
      
      const newAvatar = `data:image/jpeg;base64,${image.base64String}`;

      await api.put(`/api/users/${user?.id}`, { avatar: newAvatar });
      if (user) updateUser({ ...user, avatar: newAvatar });
      setToastMsg('Foto de perfil actualizada');
    } catch (e) {
      console.error('Camera error', e);
    }
  };

  if (!user) return null;

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>Mi Perfil</IonTitle>
          <IonButton slot="end" fill="clear" color="danger" onClick={handleLogout}>
            <LogOut size={20} />
          </IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ position: 'relative', width: '120px', margin: '0 auto 20px' }}>
            <IonAvatar style={{ width: '120px', height: '120px', border: '4px solid var(--neon-green)' }}>
              <img src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.username}`} />
            </IonAvatar>
            <div 
              onClick={handleTakePhoto}
              style={{ 
                position: 'absolute', 
                bottom: '0', 
                right: '0', 
                background: 'var(--neon-green)', 
                borderRadius: '50%', 
                padding: '8px',
                color: '#000',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)'
              }}
            >
              <Camera size={20} />
            </div>
          </div>

          <h2 style={{ margin: '0 0 4px 0', fontSize: '1.5rem', fontWeight: '800' }}>{user.username}</h2>
          <p style={{ opacity: 0.6, fontSize: '0.9rem', marginBottom: '20px' }}>{user.email}</p>

          <div className="glass-card ion-padding" style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '30px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--neon-green)' }}>{user.points}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>Puntos</div>
            </div>
            <div style={{ borderLeft: '1px solid rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--gold)' }}>{bets.length}</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.5, textTransform: 'uppercase' }}>Apuestas</div>
            </div>
          </div>

          <IonButton expand="block" fill="outline" className="btn-secondary" onClick={handleEditProfile} style={{ marginBottom: '30px' }}>
            <ShieldCheck size={20} style={{ marginRight: '8px' }} />
            Ajustes de Seguridad
          </IonButton>

          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center' }}>
              <History size={20} style={{ marginRight: '8px' }} className="text-neon" />
              Historial de Apuestas
            </h3>

            {loading ? (
              <p style={{ opacity: 0.5 }}>Cargando historial...</p>
            ) : bets.length > 0 ? (
              <IonList style={{ background: 'transparent' }}>
                {bets.map(bet => (
                  <div key={bet.id} className="glass-card" style={{ padding: '16px', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', opacity: 0.6 }}>
                      <span>Jornada {bet.match?.jornada}</span>
                      <IonBadge color={bet.pointsEarned > 0 ? 'success' : 'medium'} style={{ borderRadius: '4px' }}>
                        {bet.pointsEarned > 0 ? `+${bet.pointsEarned} Pts` : 'Sin puntos'}
                      </IonBadge>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ flex: 1, fontWeight: '600' }}>{bet.match?.home}</div>
                      <div style={{ padding: '0 10px', opacity: 0.4 }}>vs</div>
                      <div style={{ flex: 1, fontWeight: '600', textAlign: 'right' }}>{bet.match?.away}</div>
                    </div>
                    <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '1.1rem', fontWeight: '800' }}>
                      Tu pronóstico: {bet.homeScore} - {bet.awayScore}
                    </div>
                    {bet.match?.status === 'finished' && (
                      <div style={{ textAlign: 'center', marginTop: '4px', fontSize: '0.8rem', opacity: 0.5 }}>
                        Resultado final: {bet.match?.homeScore} - {bet.match?.awayScore}
                      </div>
                    )}
                  </div>
                ))}
              </IonList>
            ) : (
              <div style={{ textAlign: 'center', padding: '40px', opacity: 0.3 }}>
                <p>Aún no has realizado ninguna apuesta</p>
              </div>
            )}
          </div>
        </div>

        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={3000}
          onDidDismiss={() => setToastMsg('')}
          color="primary"
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
