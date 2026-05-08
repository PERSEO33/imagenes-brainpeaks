import React, { useState } from 'react';
import {
  IonContent,
  IonPage,
  IonInput,
  IonButton,
  IonLoading,
  IonToast
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { UserPlus, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const history = useHistory();
  const { login } = useAuth();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      setToastMsg('Por favor, rellena todos los campos');
      return;
    }

    setShowLoading(true);
    try {
      const response = await api.post('/api/register', { username, email, password });
      const { user, token } = response.data;
      await login(user, token);
      history.replace('/tabs/dashboard');
    } catch (e: any) {
      setToastMsg(e.response?.data?.message || 'Error al registrarse');
    } finally {
      setShowLoading(false);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          height: '100%',
          maxWidth: '400px',
          margin: '0 auto'
        }}>
          <div 
            style={{ position: 'absolute', top: '20px', left: '20px', cursor: 'pointer' }}
            onClick={() => history.goBack()}
          >
            <ArrowLeft size={24} />
          </div>

          <div className="animate-fade" style={{ textAlign: 'center', marginBottom: '30px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', margin: '0' }}>
              NUEVO<span className="text-neon">CLAN</span>
            </h1>
            <p style={{ opacity: 0.7 }}>Únete a la élite de los tipsters</p>
          </div>

          <div className="glass-card ion-padding" style={{ padding: '30px' }}>
            <h2 style={{ marginBottom: '20px', fontWeight: '600' }}>Registro</h2>
            
            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px', display: 'block' }}>Nombre de usuario</span>
              <IonInput
                value={username}
                onIonChange={e => setUsername(e.detail.value!)}
                placeholder="NinjaTipster"
                className="glass"
                style={{ padding: '12px' }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px', display: 'block' }}>Email</span>
              <IonInput
                type="email"
                value={email}
                onIonChange={e => setEmail(e.detail.value!)}
                placeholder="email@ejemplo.com"
                className="glass"
                style={{ padding: '12px' }}
              />
            </div>

            <div style={{ marginBottom: '30px' }}>
              <span style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '8px', display: 'block' }}>Contraseña</span>
              <IonInput
                type="password"
                value={password}
                onIonChange={e => setPassword(e.detail.value!)}
                placeholder="••••••••"
                className="glass"
                style={{ padding: '12px' }}
              />
            </div>

            <IonButton expand="block" className="btn-primary" onClick={handleRegister}>
              <UserPlus size={20} style={{ marginRight: '8px' }} />
              Crear Cuenta
            </IonButton>
          </div>
        </div>

        <IonLoading isOpen={showLoading} message="Creando cuenta..." />
        <IonToast
          isOpen={!!toastMsg}
          message={toastMsg}
          duration={3000}
          onDidDismiss={() => setToastMsg('')}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default Register;
