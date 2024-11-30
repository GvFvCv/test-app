import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonLoading } from '@ionic/react';
import MinutaOn from './Minuta/MinutaOn';
import MinutaOff from './Minuta/MinutaOff';
import './Tab1.css';
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
        if (!userId) throw new Error('No se encontró el ID de usuario');

        const url = `http://127.0.0.1:8000/app/statusminute/?user_id=${userId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Error al obtener el estado de la minuta');
        const data = await response.json();
        setStateMinuta(data.state_minuta);
      } catch (error) {
        console.error('Error al obtener la minuta:', error);
        setStateMinuta(null);
      } finally {
        setTimeout(() => setLoading(false), 4000); // Espera el tiempo de animación antes de ocultar
      }
    };

    fetchMinuta();
     // Verificar si el ingreso fue exitoso y mostrar la notificación con un delay
     const loginSuccess = localStorage.getItem('loginSuccess');
     if (loginSuccess === 'true') {
       setTimeout(() => {
         setShowNotification(true);
         localStorage.removeItem('loginSuccess'); // Limpiar el estado de ingreso exitoso
       }, 5000); // Delay de 2 segundos
     }

  }, [duration]);

  return (
    <IonPage>
      {loading && (
        <div className="loader">
          <span className="loader-text">Comprobando Minuta...</span>
          <span className="load"></span>
        </div>
      )}
      <IonContent className='tab-1'>
        {/* Condicional para mostrar la minuta */}
        {!loading && (
          stateMinuta === "True" ? <MinutaOn /> : <MinutaOff />
        )}
        {showNotification && (
          <Notification  message="¡Ingreso exitoso!" type="success" />
        )}
      </IonContent>
    </IonPage>
  );
}
export default PantallaPrincipal;
