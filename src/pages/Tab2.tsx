import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonSpinner } from '@ionic/react';
import './Tab2.css';

// Interfaz para los alimentos en la dispensa
interface Alimento {
  id_alimento: number;
  name_alimento: string;
  unit_measurement: string;
  load_alimento: string;
}

const Dispensa: React.FC = () => {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlimentos = async () => {
      try {
        // Recuperar user_id y dispensa_id del localStorage
        const user = localStorage.getItem('registerResponse');
        if (!user) {
          throw new Error('No se encontró el objeto de usuario en el localStorage');
        }

        const userObj = JSON.parse(user);
        const userId = userObj.id_user;
        const dispensa = userObj.dispensa; // Asegúrate de que dispensa_id esté en el objeto

        if (!userId || !dispensa) {
          throw new Error('No se encontró el ID de usuario o el ID de la dispensa en el objeto de usuario');
        }

        // Construir la URL con user_id y dispensa_id como parámetros
        const url = `http://127.0.0.1:8000/app/dispensa_detail/?user_id=${userId}&dispensa_id=${dispensa}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los alimentos');
        }
        const data = await response.json();

        // Extraer la lista de alimentos del JSON
        const alimentosExtraidos = data.alimentos.map((item: any) => item.alimento);
        setAlimentos(alimentosExtraidos);
      } catch (error: any) {
        setError(error.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchAlimentos();
  }, []);

  if (loading) {
    return (
      <IonContent>
        <IonSpinner />
      </IonContent>
    );
  }

  if (error) {
    return (
      <IonContent>
        <p>Error: {error}</p>
      </IonContent>
    );
  }

  return (
    <IonPage  color='light'>
      <div className='ccc'>
        <h1 className='cca'>DISPENSA</h1>
      </div>
      <IonContent>
        <IonList>
          {alimentos.map((alimento) => (
            <IonItem key={alimento.id_alimento}>
              <IonLabel>
                <h2>{alimento.name_alimento}</h2>
                <p>Cantidad: {alimento.load_alimento} {alimento.unit_measurement}</p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Dispensa;
