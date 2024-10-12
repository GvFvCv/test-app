import { IonCard, IonCardContent, IonCardHeader, IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonFooter } from '@ionic/react';
import './Tab1.css';

const Tab1: React.FC = () => {
  return (
    <IonPage>
      <IonContent  className='tab-1'>
        <h1>ESTAS EN TU MINUTA</h1>
        <IonCard>
          <IonCardHeader>No existe  minuta creada</IonCardHeader>
          <IonCardContent>Debes crear tu Minuta</IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
