import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonText,
  IonTitle,
  IonToolbar,
  IonModal,
  IonButton,
} from '@ionic/react';
import { chevronForward, notificationsOutline, chatbubbleEllipsesOutline, bulbOutline, arrowBack } from 'ionicons/icons';
import './NotificationModal.css';

const NotificationModal: React.FC<{ showNotificationsCard: boolean, onClose: () => void }> = ({ showNotificationsCard, onClose }) => {
  const [notifications, setNotifications] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [activeList, setActiveList] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/app/notificaciones2/user_id');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text(); // Leer la respuesta como texto
        throw new Error(`Received non-JSON response: ${text}`);
      }
      const data = await response.json();
      if (!data.notifications || !Array.isArray(data.notifications)) {
        throw new Error('Invalid notifications format');
      }
      setNotifications(data.notifications.map((item: { notification: string }) => item.notification));
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };
  

  const fetchSuggestions = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/app/notificaciones3/user_id');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Received non-JSON response');
      }
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/app/notificaciones4/user_id');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setRecommendations(data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(new Date());
    };

    const fetchNotificationsInterval = setInterval(fetchNotifications, 10000); // Cada 10 segundos
    const fetchSuggestionsInterval = setInterval(fetchSuggestions, 15000); // Cada 15 segundos
    const fetchRecommendationsInterval = setInterval(fetchRecommendations, 20000); // Cada 20 segundos
    const updateDateInterval = setInterval(updateDate, 1000); // Cada segundo

    // Ejecutar inmediatamente al montar el componente
    fetchNotifications();
    fetchSuggestions();
    fetchRecommendations();
    updateDate();

    return () => {
      clearInterval(fetchNotificationsInterval);
      clearInterval(fetchSuggestionsInterval);
      clearInterval(fetchRecommendationsInterval);
      clearInterval(updateDateInterval);
    };
  }, []);

  const renderList = () => {
    switch (activeList) {
      case 'notifications':
        return notifications.map((notification, index) => (
          <IonItem key={index} button={true} detail={false}>
            <div className="unread-indicator-wrapper" slot="start">
              <div className="unread-indicator"></div>
            </div>
            <IonLabel>
              <IonText>{notification}</IonText>
              <br />
              <IonNote color="medium" className="ion-text-wrap">
                {notification}
              </IonNote>
            </IonLabel>
            <div className="metadata-end-wrapper" slot="end">
              <IonNote color="medium">06:11</IonNote>
              <IonIcon color="medium" icon={chevronForward}></IonIcon>
            </div>
          </IonItem>
        ));
      case 'suggestions':
        return suggestions.map((suggestion, index) => (
          <IonItem key={index} button={true} detail={false}>
            <IonLabel>
              <IonText>{suggestion}</IonText>
            </IonLabel>
          </IonItem>
        ));
      case 'recommendations':
        return recommendations.map((recommendation, index) => (
          <IonItem key={index} button={true} detail={false}>
            <IonLabel>
              <IonText>{recommendation}</IonText>
            </IonLabel>
          </IonItem>
        ));
      default:
        return null;
    }
  };

  return (
    <IonModal isOpen={showNotificationsCard} onDidDismiss={onClose}>
      <IonHeader>
        <IonToolbar>
          <IonButton onClick={onClose} fill="clear" className='back-button'>
            <IonIcon icon={arrowBack} slot="icon-only" style={{ fontSize: '24px', color: '#000' }} />
          </IonButton>
          <div className='fff-1'>
            <h2 className='fff-2'>Notificaciones</h2>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList inset={true}>
          <IonItem button={true} onClick={() => setActiveList('notifications')}>
            <IonIcon color="primary" slot="start" icon={notificationsOutline} size="large"></IonIcon>
            <IonLabel>Notificaciones</IonLabel>
            <IonNote slot="end">{notifications.length}</IonNote>
          </IonItem>
          <IonItem button={true} onClick={() => setActiveList('suggestions')}>
            <IonIcon color="secondary" slot="start" icon={chatbubbleEllipsesOutline} size="large"></IonIcon>
            <IonLabel>Sugerencias</IonLabel>
            <IonNote slot="end">{notifications.length}</IonNote>
          </IonItem>
          <IonItem button={true} onClick={() => setActiveList('recommendations')}>
            <IonIcon color="tertiary" slot="start" icon={bulbOutline} size="large"></IonIcon>
            <IonLabel>Recomendación MinutIA</IonLabel>
            <IonNote slot="end">{recommendations.length}</IonNote>
          </IonItem>
        </IonList>
        <IonList inset={true}>
          {renderList()}
        </IonList>
        <div className='time-now'>{currentDate.toLocaleTimeString()}</div>
      </IonContent>
    </IonModal>
  );
};

export default NotificationModal;
