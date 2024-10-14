import { IonButton, IonCard, IonCardContent, IonCardHeader, IonContent, IonPage } from '@ionic/react';
import './Tab1.css';
import { useState } from 'react';

const Tab1: React.FC = () => {
  // Simulación de datos: lista de minutas
  const [minutas, setMinutas] = useState<string[]>([]);

  return (
    <IonPage>
      <IonContent className='tab-1'>
        <div className='ddd'>
          <h1 className='dda'>MINUTA</h1>
        </div>

        {minutas.length === 0 ? (
          <IonCard className='no-minuta'>
            <IonCardHeader className='no-minuta-1'>
            NO EXISTE MINUTA
            </IonCardHeader>
            <IonCardContent className='no-minuta-2'>
              DEBES CREAR TU MINUTA
            </IonCardContent>
          </IonCard>
        ) : (
          <div className='lista-minutas'>
            {minutas.map((minuta, index) => (
              <IonCard key={index} className='minuta-item'>
                <IonCardHeader>{minuta}</IonCardHeader>
              </IonCard>
            ))}
          </div>
        )}
        <IonButton className="crear" shape='round'>
            Crear
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
