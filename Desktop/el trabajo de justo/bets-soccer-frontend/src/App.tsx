import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonLoading,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { LayoutDashboard, Trophy, ListOrdered, User } from 'lucide-react';

import '@ionic/react/css/core.css';

import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

import './theme/variables.css';
import './index.css';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MatchDetail from './pages/MatchDetail';
import League from './pages/League';
import TeamDetail from './pages/TeamDetail';
import Ranking from './pages/Ranking';
import Profile from './pages/Profile';
import { App as CapApp } from '@capacitor/app';
import { useAuth } from './context/AuthContext';

setupIonicReact({
  mode: 'md'
});

const App: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  React.useEffect(() => {

    const setupListener = async () => {
      const listener = await CapApp.addListener('appStateChange', ({ isActive }) => {
        if (isActive) {
          console.log('El ninja ha vuelto al dojo. Refrescando datos...');
        }
      });
      return listener;
    };

    const listenerPromise = setupListener();

    return () => {
      listenerPromise.then(l => l.remove());
    };
  }, []);

  if (isLoading) return <IonLoading isOpen={true} message="Cargando..." />;

  return (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        
        <Route path="/tabs" render={() => (
          isAuthenticated ? (
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/tabs/dashboard" component={Dashboard} />
              <Route exact path="/tabs/match/:id" component={MatchDetail} />
              <Route exact path="/tabs/league" component={League} />
              <Route exact path="/tabs/team/:name" component={TeamDetail} />
              <Route exact path="/tabs/ranking" component={Ranking} />
              <Route exact path="/tabs/profile" component={Profile} />
            </IonRouterOutlet>
            
            <IonTabBar slot="bottom" className="glass">
              <IonTabButton tab="dashboard" href="/tabs/dashboard">
                <LayoutDashboard size={20} />
                <IonLabel>Partidos</IonLabel>
              </IonTabButton>
              <IonTabButton tab="league" href="/tabs/league">
                <Trophy size={20} />
                <IonLabel>La Liga</IonLabel>
              </IonTabButton>
              <IonTabButton tab="ranking" href="/tabs/ranking">
                <ListOrdered size={20} />
                <IonLabel>Ranking</IonLabel>
              </IonTabButton>
              <IonTabButton tab="profile" href="/tabs/profile">
                <User size={20} />
                <IonLabel>Perfil</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
          ) : <Redirect to="/login" />
        )} />
        
        <Route exact path="/">
          <Redirect to="/tabs/dashboard" />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
  );
};

export default App;
