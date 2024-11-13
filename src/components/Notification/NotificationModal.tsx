import { useEffect, useState } from 'react';
import { fetchNotificationsOnceADay } from '../../services/notifications/NotificationsService';
import { fetchRecommendationsOnceADay } from '../../services/recommendations/RecommendationsService';
import { fetchSuggestionsOnceADay } from '../../services/suggestions/SuggestionsService';
import { IonModal, IonHeader, IonToolbar, IonButton, IonIcon, IonContent, IonList, IonItem, IonLabel, IonText, IonNote } from '@ionic/react';
import { arrowBack, notificationsOutline, chatbubbleEllipsesOutline, bulbOutline, chevronForward } from 'ionicons/icons';
import './NotificationModal.css';

interface NotificationModalProps {
  showNotificationsCard: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ showNotificationsCard, onClose }) => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [activeList, setActiveList] = useState('notifications');
  const [currentDate, setCurrentDate] = useState(new Date());

  const updateDate = () => {
    setCurrentDate(new Date());
  };

  useEffect(() => {
    const fetchNotificationsInterval = setInterval(fetchNotificationsOnceADay, 86400000); // Cada 24 horas
    const fetchSuggestionsInterval = setInterval(fetchSuggestionsOnceADay, 86400000); // Cada 24 horas
    const fetchRecommendationsInterval = setInterval(fetchRecommendationsOnceADay, 86400000); // Cada 24 horas
    const updateDateInterval = setInterval(updateDate, 120000);  // Cada 2 minutos

    // Ejecutar inmediatamente al montar el componente
    fetchNotificationsOnceADay().then(setNotifications);
    fetchSuggestionsOnceADay().then(setSuggestions);
    fetchRecommendationsOnceADay().then(setRecommendations);
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
        return notifications.map((notifications, index) => (
          <IonItem key={index} button={true} detail={false}>
            <IonLabel>
              <IonText>{notifications}</IonText>
            </IonLabel>
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
            <IonNote slot="end">{suggestions.length}</IonNote>
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