import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption } from '@ionic/react';
import React, { useState } from 'react';
import './Tab4.css';

const Tab4: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('es');

  return (
    <IonPage color='light'>
      <div className='eee-1'>
        <h1 className='eef-2'>AJUSTES</h1>
      </div>
      <IonContent className='ion-padding'>
        <IonList>
          <IonItem className='list-1'>
            <IonLabel>
              <div className='op-1'>
                <h2 className='op-11'>
                  Notificaciones
                </h2>
              </div>
              </IonLabel>
            <IonToggle className='togle-1' checked={notificationsEnabled} onIonChange={(e) => setNotificationsEnabled(e.detail.checked)} />
          </IonItem>
          <IonItem className='list-1'>
            <IonLabel>
              <div className='op-2'>
                <h2 className='op-22'>
                Modo Oscuro
                </h2>
              </div>
            </IonLabel>
            <IonToggle className='togle-2' checked={darkMode} onIonChange={(e) => setDarkMode(e.detail.checked)} />
          </IonItem>
          <IonItem className='list-1'>
            <IonLabel>
              <div className='op-3'>
                <h2 className='op-33'>
                Idioma
                </h2>
              </div>
            </IonLabel>
            <IonSelect value={selectedLanguage} onIonChange={(e) => setSelectedLanguage(e.detail.value)}>
              <IonSelectOption value="es">Español</IonSelectOption>
              <IonSelectOption value="en">Inglés</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
