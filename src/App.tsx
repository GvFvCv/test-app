import { Route, Switch, Redirect, useLocation } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { cartSharp, listSharp, scanSharp, settingsSharp } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';
import Tab4 from './pages/Tab4';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider} from './pages/AuthContext';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

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
  const location = useLocation();
  const showTabs = !['/Login', '/Register'].includes(location.pathname);

  return (
    <>
      <IonRouterOutlet>
        <Switch>
          <Route path="/Register" component={Register} />
          <Route path="/Login" component={Login} />

          {showTabs && (
            <IonTabs>
              <IonRouterOutlet>
                <Route path="/tab1" component={Tab1} />
                <Route path="/tab2" component={Tab2} />
                <Route path="/tab3" component={Tab3} />
                <Route path="/tab4" component={Tab4} />
                <Route path="/" exact>
                  <Redirect to="/tab1" />
                </Route>
              </IonRouterOutlet>

              <IonTabBar slot="bottom" color={'tertiary'}>
                <IonTabButton tab="tab1" href="/tab1">
                  <IonIcon color='light' aria-hidden="true" icon={listSharp} />
                </IonTabButton>
                <IonTabButton tab="tab2" href="/tab2">
                  <IonIcon color='light' aria-hidden="true" icon={cartSharp} />
                </IonTabButton>
                <IonTabButton tab="tab3" href="/tab3">
                  <IonIcon color='light' aria-hidden="true" icon={scanSharp} />
                </IonTabButton>
                <IonTabButton tab="tab4" href="/tab4">
                  <IonIcon color='light' aria-hidden="true" icon={settingsSharp} />
                </IonTabButton>
              </IonTabBar>
            </IonTabs>
          )}

          {/* Rutas para tabs también se pueden manejar aquí si es necesario */}
          <Route path="/tab1" component={Tab1} />
          <Route path="/tab2" component={Tab2} />
          <Route path="/tab3" component={Tab3} />
          <Route path="/tab4" component={Tab4} />
          <Route path="/" exact>
            <Redirect to="/Login" />
          </Route>
        </Switch>
      </IonRouterOutlet>
    </>
  );
};

export default App;