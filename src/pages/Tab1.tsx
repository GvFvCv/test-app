import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonLoading } from '@ionic/react';
import MinutaOn from './Minuta/MinutaOn';
import MinutaOff from './Minuta/MinutaOff';
import './Tab1.css';

const PantallaPrincipal: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [stateMinuta, setStateMinuta] = useState<string | null>(null);
  const [duration] = useState<number>(1000); // Duración en ms (ajustable)

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
        setTimeout(() => setLoading(false), 3000); // Espera el tiempo de animación antes de ocultar
      }
    };

    fetchMinuta();
  }, [duration]);

  return (
    <IonPage>
      <IonLoading
        isOpen={loading}
        onDidDismiss={() => setLoading(false)}
        message="Cargando..." // Mensaje de carga
        spinner="lines" // Tipo de animación de carga
        duration={1500} // Duración de la carga en milisegundos
        cssClass= "custom-loading-tech" // Clase CSS personalizada
      />
      <IonContent>
        {/* Condicional para mostrar la minuta */}
        {!loading && (
          stateMinuta === "True" ? <MinutaOn /> : <MinutaOff />
        )}
      </IonContent>
    </IonPage>
  );
};

export default PantallaPrincipal;
