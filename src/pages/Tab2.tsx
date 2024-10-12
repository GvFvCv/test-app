import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonContent color={'light'}>
        <h1>ESTAS EN DISPENSA</h1>
        <IonList inset={true}>
          <IonItem>
            <IonList>
              <IonLabel>id_alimento</IonLabel>
              <IonLabel>name_alimento</IonLabel>
              <IonLabel>unit_measurement</IonLabel>
              <IonLabel>load_alimento</IonLabel>
            </IonList>
          </IonItem>
          <IonItem>
          <IonLabel>PRODUCTO 2</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>PRODUCTO 3</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>PRODUCTO 4</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>PRODUCTO 5</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
