import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router'; // Import necesario
import { cartSharp, listSharp, scanSharp, settingsSharp } from 'ionicons/icons';

// Importa tus páginas
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/Tab4';
import Login from './pages/Login';
import Register from './pages/Register';
import estadisticas from './pages/Minuta/Estadisticas';

// Contexto de autenticación
import { AuthProvider } from './pages/AuthContext';

// Notificaciones (si es necesario)
import Notification from './components/Notification';
import notificationService from './services/notificationService';

// Estilos de Ionic
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

setupIonicReact();

const App: React.FC = () => {
  return (
    <AuthProvider>
      <IonApp>
        <IonReactRouter>
          <MainContent />
        </IonReactRouter>
      </IonApp>
    </AuthProvider>
  );
};

const MainContent: React.FC = () => {
  const location = useLocation(); // Detecta la ubicación actual
  const showTabs = !['/Login', '/Register', '/estadisticas'].includes(location.pathname); // Oculta Tabs en ciertas rutas
  const [routeKey, setRouteKey] = useState(0); // Estado para forzar el recargado de componentes

  // Forzar recarga al cambiar de ruta
  useEffect(() => {
    setRouteKey((prevKey) => prevKey + 1); // Cambia la clave al detectar un cambio de ruta
  }, [location.pathname]);

  const [notifications, setNotifications] = useState<
    { id: string; message: string; type: 'success' | 'error' | 'info' }[]
  >([]);

  useEffect(() => {
    const handleNewNotification = (notification: {
      id: string;
      message: string;
      type: 'success' | 'error' | 'info';
    }) => {
      setNotifications((prev) => [...prev, notification]);
    };

    notificationService.subscribe(handleNewNotification);

    return () => {
      notificationService.unsubscribe(handleNewNotification);
    };
  }, []);

  return (
    <>
      <IonRouterOutlet key={routeKey}>
        <Switch>
          <Route path="/Register" component={Register} />
          <Route path="/Login" component={Login} />
          <Route path="/estadisticas" component={estadisticas} />

          {showTabs && (
            <IonTabs>
              <IonRouterOutlet>
                <Route path="/tab1" component={Tab1} />
                <Route path="/tab2" component={Tab2} />
                <Route path="/tab3" component={Tab3} />
                <Route path="/tab4" component={Tab4} />
                <Route path="/" exact>
                  <Redirect to="/Login" />
                </Route>
              </IonRouterOutlet>

              <IonTabBar slot="bottom" color={'tertiary'}>
                <IonTabButton tab="tab1" href="/tab1">
                  <IonIcon color="light" aria-hidden="true" icon={listSharp} />
                </IonTabButton>
                <IonTabButton tab="tab2" href="/tab2">
                  <IonIcon color="light" aria-hidden="true" icon={cartSharp} />
                </IonTabButton>
                <IonTabButton tab="tab3" href="/tab3">
                  <IonIcon color="light" aria-hidden="true" icon={scanSharp} />
                </IonTabButton>
                <IonTabButton tab="tab4" href="/tab4">
                  <IonIcon color="light" aria-hidden="true" icon={settingsSharp} />
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          )}

          {/* Rutas adicionales por seguridad */}
          <Route path="/tab1" component={Tab1} />
          <Route path="/tab2" component={Tab2} />
          <Route path="/tab3" component={Tab3} />
          <Route path="/tab4" component={Tab4} />
          <Route path="/" exact>
            <Redirect to="/Login" />
          </Route>
        </Switch>
      </IonRouterOutlet>

      {/* Renderiza las notificaciones */}
      {notifications.map((notif) => (
        <Notification key={notif.id} message={notif.message} type={notif.type} />
      ))}
    </>
  );
};

export default App;
