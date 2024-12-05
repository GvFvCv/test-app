import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle, IonSelect,
IonSelectOption, IonButton, IonModal, IonAlert, IonCard, IonIcon } from '@ionic/react';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import './Tab4.css';
import NotificationModal from '../components/Notification/NotificationModal'; // Asegúrate de que la ruta sea correcta
import ObjetivosOn from '../components/Objetivos/ObjetivosOn';
import ObjetivosOff from '../components/Objetivos/ObjetivosOff';
import { barChartSharp, locateSharp, notificationsSharp } from 'ionicons/icons';


const Tab4: React.FC = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showObjetivosModal, setShowObjetivosModal] = useState(false);
  const [stateObjetivos, setStateObjetivos] = useState("False");
  const history = useHistory();

  const irAEstadisticas = () => {
    history.push('/estadisticas');
  };

  return (
    <IonPage className='tab-4 ion-page'>
      <div className='eee-1'>
        <h1 className='eef-2'>AJUSTES</h1>
      </div>
      <IonContent className='ion-padding'>
        <IonList className='list-not'>
          <IonItem className='list-1'>
            <IonLabel onClick={() => setShowModal(true)}>
              <div className='op-1 label-container'>
                <h2 className='op-11'>
                  NOTIFICACIONES
                </h2>
                <IonIcon icon={notificationsSharp} className='icon' />
              </div>
            </IonLabel>
          </IonItem>
          <IonItem className='list-1'>
            <IonLabel onClick={() => setShowObjetivosModal(true)}>
              <div className='op-3 label-container'>
                <h2 className='op-33'>
                  OBJETIVOS
                </h2>
                <IonIcon icon={locateSharp} className='icon' />
              </div>
            </IonLabel>
          </IonItem>
          <IonItem className='list-1'>
            <IonLabel onClick={irAEstadisticas}>
              <div className='op-1 label-container'>
                <h2 className='op-11'>
                  ESTADÍSTICAS DE USO
                </h2>
                <IonIcon icon={barChartSharp} className='icon' />
              </div>
            </IonLabel>
          </IonItem>
        </IonList>
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <NotificationModal showNotificationsCard={showModal} onClose={() => setShowModal(false)} />
        </IonModal>
        <IonModal isOpen={showObjetivosModal} onDidDismiss={() => setShowObjetivosModal(false)}>
          {stateObjetivos === "True" ? <ObjetivosOn /> : <ObjetivosOff />}
        </IonModal>
        <IonCard className='instruccion'>
          <IonIcon icon={notificationsSharp} className='iconnoti' />
          <h2>
            Intrucciones
          </h2>
          <p>
            Para ver alguna de las opciones, simplemente haga clic en el nombre correspondiente en la lista. y se abrirá una ventana emergente con la información correspondiente.
          </p>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab4;