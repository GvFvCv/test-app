import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle, IonSelect, IonSelectOption, IonButton, IonModal, IonAlert } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Tab4.css';
import NotificationModal from '../components/Notification/NotificationModal'; // Asegúrate de que la ruta sea correcta

const Tab4: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('es');
  const [showModal, setShowModal] = useState(false);
  const history = useHistory();

  const irAEstadisticas = () => {
    history.push('/estadisticas');
  };

  return (
    <IonPage className='tab-4 ion-page' >
      <div className='eee-1'>
        <h1 className='eef-2'>AJUSTES</h1>
      </div>
      <IonContent className='ion-padding'>
        <IonList className='list-not'>
          <IonItem className='list-1'>
            <IonLabel>
              <div className='op-1'>
                <h2 className='op-11'>
                  Notificaciones
                </h2>
              </div>
            </IonLabel>
            <IonToggle className='togles' checked={notificationsEnabled} onIonChange={(e) => setNotificationsEnabled(e.detail.checked)} />
            <IonButton className='modern-button' onClick={() => setShowModal(true)}>Ver</IonButton>
          </IonItem>
          <IonItem className='list-1'>
            <IonLabel>
              <div className='op-2'>
                <h2 className='op-22'>
                  Modo Oscuro
                </h2>
              </div>
            </IonLabel>
            <IonToggle className='togles' checked={darkMode} onIonChange={(e) => setDarkMode(e.detail.checked)} />
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
          <IonItem className='list-1'>
            <IonLabel>
              <div className='op-1'>
                <h2 className='op-11'>
                  Estadisticas de Usuario
                </h2>
              </div>
            </IonLabel>
            <IonButton className='modern-button' onClick={irAEstadisticas}>Ver</IonButton>
          </IonItem>
        </IonList>
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <NotificationModal showNotificationsCard={showModal} onClose={() => setShowModal(false)} />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
