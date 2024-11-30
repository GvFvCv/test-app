import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonLoading } from '@ionic/react';
import DespensaOn from './Minuta/DespensaOn';
import DespensaOff from './Minuta/DespensaOff';
import './Tab2.css';
import Notification from '../components/Notification';

const PantallaPrincipal: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stateMinuta, setStateMinuta] = useState<string | null>(null);
  const [duration] = useState<number>(1000); // Duración en ms (ajustable)
  const [showNotification, setShowNotification] = useState<boolean>(false);

  useEffect(() => {
    const fetchMinuta = async () => {
      try {
        const user = localStorage.getItem('registerResponse');
        if (!user) throw new Error('No se encontró el objeto de usuario en el localStorage');
        
        const userObj = JSON.parse(user);
        const userId = userObj.id_user;
        const dispensaId = userObj.dispensa;
        
        if (!userId) throw new Error('No se encontró el ID de usuario');
  
        const url = `http://127.0.0.1:8000/app/status_despensa/?user_id=${userId}&dispensa_id=${dispensaId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
  
        if (!response.ok) throw new Error('Error al obtener el estado de la minuta');
        const data = await response.json();
  
        // Asegurarse de que el valor del campo 'status' es tratado como una cadena
        setStateMinuta(data.status); // Accede al campo 'status' en lugar de 'state_minuta'
      } catch (error) {
        console.error('Error al obtener la minuta:', error);
        setStateMinuta(null);
      } finally {
        setTimeout(() => setLoading(false), 4000);
      }
    };
  
    fetchMinuta();
  
    const loginSuccess = localStorage.getItem('loginSuccess');
    if (loginSuccess === 'true') {
      setTimeout(() => {
        setShowNotification(true);
        localStorage.removeItem('loginSuccess');
      }, 4000);
    }
  }, [duration]);
  
  return (
    <IonPage>
      {loading && (
        <div className="loader">
          <span className="loader-text">Cargando Alimentos...</span>
          <span className="load"></span>
        </div>
      )}
      <IonContent className='tab-1'>
        {!loading && (
          
          stateMinuta === "true" ? <DespensaOn /> : <DespensaOff />
        )}
        {showNotification && (
          <Notification message="¡Ingreso exitoso!" type="success" />
        )}
      </IonContent>
    </IonPage>
  );  
};

export default PantallaPrincipal;
