import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonLoading } from '@ionic/react';
import MinutaOff from './Minuta/MinutaOff';
import MinutaOn from './Minuta/MinutaOn';

const PantallaPrincipal: React.FC = () => {
  const [stateMinuta, setStateMinuta] = useState<string | null>(null); // Estado para el estado de la minuta
  const [loading, setLoading] = useState<boolean>(true);  // Estado de carga

  useEffect(() => {
    const fetchMinuta = async () => {
      try {
        // Recuperar user_id 
        const user = localStorage.getItem('registerResponse');
        if (!user) {
          throw new Error('No se encontró el objeto de usuario en el localStorage');
        }

        const userObj = JSON.parse(user);
        const userId = userObj.id_user;

        if (!userId) {
          throw new Error('No se encontró el ID de usuario');
        }

        // Construir la URL con user_id como parámetro
        const url = `http://127.0.0.1:8000/app/statusminute/?user_id=${userId}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener el estado de la minuta');
        }
        const data = await response.json();
        console.log(data);

        // Actualizar el estado de stateMinuta basado en la respuesta
        setStateMinuta(data.state_minuta);
      } catch (error) {
        console.error('Error al obtener la minuta:', error);
        setStateMinuta(null); // Si hay un error, indica que no hay minuta
      } finally {
        setLoading(false); // Detén la carga
      }
    };

    fetchMinuta(); // Llama a la función para obtener la minuta
  }, []);

  if (loading) {
    return <IonLoading isOpen={loading} message="Cargando..." />;
  }

  return (
    <IonPage>
      <IonContent>
        {/* Si stateMinuta es "True", muestra MinutaOn, si es "False", muestra MinutaOff */}
        {stateMinuta === "True" ? <MinutaOn /> : <MinutaOff />}
      </IonContent>
    </IonPage>
  );
};

export default PantallaPrincipal;
