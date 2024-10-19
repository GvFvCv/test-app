import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonLoading } from '@ionic/react';
import MinutaOff from './Minuta/MinutaOff';
import MinutaOn from './Minuta/MinutaOn';

const PantallaPrincipal: React.FC = () => {
  const [minuta, setMinuta] = useState<any | null>(null); // Estado para la minuta
  const [loading, setLoading] = useState<boolean>(true);  // Estado de carga

  useEffect(() => {
    // Simula la obtención de datos de una API
    const fetchMinuta = async () => {
      try {
        // Simulación de la llamada a la API
        const mockMinuta = [
          {
            day: '2024-10-12',
            recipes: [
              {
                name: 'Ensalada de pollo',
                ingredients: ['pollo', 'lechuga', 'tomate'],
                instructions: 'Cortar el pollo y mezclar con vegetales.',
              },
            ],
          },
          // Otras fechas y recetas...
        ];

        // Simular el retardo de una llamada a una API
        setTimeout(() => {
          setMinuta(mockMinuta.length > 0 ? mockMinuta : null); // Si hay datos, asigna la minuta, si no, null
          setLoading(false); // Detén la carga
        }, 1000); // Simula un retardo de 1 segundo
      } catch (error) {
        console.error('Error al obtener la minuta:', error);
        setMinuta(null); // Si hay un error, indica que no hay minuta
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
        {/* Si minuta tiene datos, muestra MinutaOn, si no, MinutaOff */}
        {minuta ? <MinutaOn /> : <MinutaOff />}
      </IonContent>
    </IonPage>
  );
};

export default PantallaPrincipal;
