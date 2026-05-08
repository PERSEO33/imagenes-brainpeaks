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
import { LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showLoading, setShowLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const history = useHistory();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      setToastMsg('Por favor, rellena todos los campos');
      return;
    }

    setShowLoading(true);
    try {
      const response = await api.post('/api/login', { email, password });
      const { user, token } = response.data;
      await login(user, token);
      history.replace('/tabs/dashboard');
    } catch (e: any) {
      setToastMsg(e.response?.data?.message || 'Error al iniciar sesión');
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
          <div className="animate-fade" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', margin: '0' }}>
              BETS<span className="text-neon">SOCCER</span>
            </h1>
            <p style={{ opacity: 0.7 }}>Tu portal de pronósticos premium</p>
          </div>

          <div className="glass-card ion-padding" style={{ padding: '30px' }}>
            <h2 style={{ marginBottom: '20px', fontWeight: '600' }}>Bienvenido</h2>
            
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

            <IonButton expand="block" className="btn-primary" onClick={handleLogin}>
              <LogIn size={20} style={{ marginRight: '8px' }} />
              Entrar
            </IonButton>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <span style={{ opacity: 0.6 }}>¿No tienes cuenta? </span>
              <span 
                className="text-neon" 
                style={{ fontWeight: '600', cursor: 'pointer' }}
                onClick={() => history.push('/register')}
              >
                Regístrate aquí
              </span>
            </div>
          </div>
        </div>

        <IonLoading isOpen={showLoading} message="Iniciando sesión..." />
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

export default Login;
