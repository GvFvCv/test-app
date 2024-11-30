import React, { useState, useEffect } from 'react';
import { IonAlert, IonPage, IonModal, IonImg, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonList, IonButton, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonIcon, IonToast, IonCheckbox } from '@ionic/react';
import './DespensaOff.css';
import { pencil } from 'ionicons/icons';

const DespensaOff: React.FC = () => {

  return (
    <IonPage className='page-on'>
      <IonContent>
        <div className='ddd'>
          <h1 className='dda'>DESPENSA</h1>
        </div>

        <div className="container_DespensaOff">
          <div className="card_DespensaOff">
            <IonImg src='resources\NoDespensa.png'></IonImg>
            <div className="content_DespensaOff">
              <br />
              <a>
                <span className="title_DespensaOff">
                  NO TIENES ALIMENTOS.
                </span>
              </a>

              <p className="desc_DespensaOff">
                Debes agregar alimentos a tu despensa para poder crear una minuta.
              </p>
              <br />
              <IonButton className='boton_despensaoff' color="success" expand="block" shape="round" routerLink="/Tab3">
                Ingresar alimentos
                <IonIcon icon={pencil} slot="start" />
              </IonButton>
            </div>
          </div>
        </div>

      </IonContent>
    </IonPage>
  );
};

export default DespensaOff;
