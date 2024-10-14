import { IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Tab2.css';

const Tab2: React.FC = () => {
  return (
    <IonPage>
      <IonContent className='tab-2' fullscreen>
        <div className='ccc'>
          <h1 className='cca'>DISPENSA</h1>
        </div>
        <IonList className='listas' inset={true}>
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
