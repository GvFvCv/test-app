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
        // Cambiar la ruta a tu archivo local data.json
        const response = await fetch('public/data.json');
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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dispensa</IonTitle>
        </IonToolbar>
      </IonHeader>
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
