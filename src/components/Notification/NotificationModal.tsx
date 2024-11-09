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
  const [suggestions, setSuggestions] = useState<{
    titulo_recomendacion?: string, sugerencia?: string 
}[]>([]);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [activeList, setActiveList] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchNotifications = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/app/notificaciones1/user_id');
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
      const formData = new FormData();
      const registerResponse = localStorage.getItem('registerResponse'); // Obtener el objeto guardado en localStorage
      if (registerResponse) {
        const parsedResponse = JSON.parse(registerResponse); // Parsear el objeto JSON
        const userId = parsedResponse.id_user; // Obtener el ID del usuario
        if (userId) {
          formData.append('user_id', userId); // Agrega los valores necesarios
        } else {
          throw new Error('User ID not found in registerResponse');
        }
      } else {
        throw new Error('registerResponse not found in localStorage');
      }
      
      formData.append('type_recommendation', '1');
      /* for (let i = 0; i < 3; i++) {
        const randomType = Math.floor(Math.random() * 3) + 1;
        formData.append('type_recommendation', randomType.toString());
      } */
  
      const response = await fetch('http://127.0.0.1:8000/app/recomendacion_compra/', {
        method: 'POST',
        body: formData
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text(); // Leer la respuesta como texto
        throw new Error(`Received non-JSON response: ${text}`);
      }

      const data = await response.json();
      if (!data.recommendation || !Array.isArray(data.recommendation) || data.recommendation.length === 0) {
        throw new Error('Invalid suggestions format');
      }

      const suggestions = data.recommendation.map((item: any, index: number) => {
        if (index === 0 && item.titulo_recomendacion) {
          return { titulo_recomendacion: item.titulo_recomendacion };
        } else if (item.recomendacion) {
          return { sugerencia: item.recomendacion };
        }
        return null;
      }).filter(Boolean); // Filtrar elementos nulos

      setSuggestions(suggestions);
      console.log(suggestions);
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
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text(); // Leer la respuesta como texto
        throw new Error(`Received non-JSON response: ${text}`);
      }
      const data = await response.json();
      if (!data.recommendations || !Array.isArray(data.recommendations)) {
        throw new Error('Invalid recommendations format');
      }
      setRecommendations(data.recommendations.map((item: { recommendation: string }) => item.recommendation));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  useEffect(() => {
    const updateDate = () => {
      setCurrentDate(new Date());
    };

    const fetchNotificationsInterval = setInterval(fetchNotifications, 60000); // 
    const fetchSuggestionsInterval = setInterval(fetchSuggestions, 65000); //
    const fetchRecommendationsInterval = setInterval(fetchRecommendations, 60000); 
    const updateDateInterval = setInterval(updateDate, 100); 

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
              <div className="unread-indicator-wrapper" slot="start">
                <div className="unread-indicator"></div>
              </div>
              <IonLabel>
                {/* Muestra el título de recomendación si existe */}
                {suggestion.titulo_recomendacion && (
                  <IonText>{suggestion.titulo_recomendacion}</IonText>
                )}
                <br />
                {/* Muestra la recomendación si existe */}
                {suggestion.sugerencia && (
                  <IonNote color="medium" className="ion-text-wrap">
                    {suggestion.sugerencia}
                  </IonNote>
                )}
              </IonLabel>
              <div className="metadata-end-wrapper" slot="end">
                <IonNote color="medium">06:11</IonNote>
                <IonIcon color="medium" icon={chevronForward}></IonIcon>
              </div>
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
