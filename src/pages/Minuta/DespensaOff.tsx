import React, { useState, useEffect } from 'react';
import { IonAlert, IonPage, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonList, IonButton, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonIcon, IonToast, IonCheckbox } from '@ionic/react';
import './DespensaOff.css';
import { pencil } from 'ionicons/icons';

const DespensaOff: React.FC = () => {

  return (
    <IonPage className='page-on'>
      <IonContent>
        <div className='ddd'>
          <h1 className='dda'>DESPENSA</h1>
        </div>
        <IonCard className='card-minuta'>
          <IonCardHeader className='no-minuta-1'>
            No hay alimentos en tu despensa
          </IonCardHeader>
          <IonCardContent className='no-minuta-2'>
            Debes agregar alimentos a tu despensa para poder crear una minuta.
          </IonCardContent>
        </IonCard>
        <IonButton className='boton_despensaoff' color="success" expand="block" shape="round" routerLink="/Tab3">
          Ingresar alimentos
          <IonIcon icon={pencil} slot="start" />
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default DespensaOff;
