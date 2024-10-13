import React, { useState, useEffect } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonImg, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonModal, IonCheckbox, IonLabel, IonItem, IonInput, IonList } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { camera, checkmark, close, arrowBack, pencil, information, addCircleOutline, image } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { enviarDatos } from '../services/ingresoboleta';
import './Tab3.css'

const Tab3: React.FC = () => {
  const [photo, setPhoto] = useState<string | undefined>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const [isFirstCapture, setIsFirstCapture] = useState<boolean>(true);
  const [showManualInputModal, setShowManualInputModal] = useState<boolean>(false); // Para el modal de ingreso manual
  const [foodItems, setFoodItems] = useState<string[]>([]); // Estado para almacenar alimentos ingresados
  const [food, setFood] = useState<string>(""); // Estado para manejar el input de alimentos
  const history = useHistory();
  let imageboleta = "";

  useEffect(() => {
    const hideInstructions = localStorage.getItem('hideInstructions');
    if (hideInstructions) {
      setDontShowAgain(true);
    }
  }, []);

  const takePhoto = async () => {
    if (!dontShowAgain) {
      setShowModal(true);
    } else {
      await captureImage();
    }
  };

  const captureImage = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
    setPhoto(image.webPath);
  };

  const retakePhoto = () => {
    setPhoto(undefined);
  };

  const handleDontShowAgain = async () => {
    if (dontShowAgain) {
      localStorage.setItem('hideInstructions', 'true');
    }

    setShowModal(false);

    if (isFirstCapture) {
      await captureImage();
    }

    setIsFirstCapture(false);
  };

  const showInstructionsAgain = () => {
    setIsFirstCapture(false);
    setShowModal(true);
  };

  const addFoodItem = () => {
    if (food.trim()) {
      setFoodItems([...foodItems, food]); // Agregar el alimento a la lista
      setFood(""); // Limpiar el input después de agregar
    }
  };

  const EnviarBoletaEP = () => {
    // Enviar la boleta al endpoint
    try {
      const response =  enviarDatos(2, photo);
      console.log('Respuesta del servidor:', response);
      /* setAlertMessage(`Respuesta del servidor: ${JSON.stringify(response)}`); */
      /* setShowAlert(true); */
    }
    catch (error) {
      console.error('Error al enviar la foto:', error);
      /* setAlertMessage(`Error al enviar la foto: ${error.message}`);
      setShowAlert(true); */
    }

};

  return (
    <IonPage color={'light'}>
      <div className='bba'>
        <h1 className='bbb'>CAPTURAR</h1>
      </div>
      <IonContent className="ion-padding">
        <IonButton onClick={() => history.goBack()} fill="clear">
          <IonIcon icon={arrowBack} slot="start" color='success' />
        </IonButton>
        <br />

        <IonCard color="medium">
          <IonCardHeader>
            <IonCardTitle>Extraer alimentos desde una boleta de compra</IonCardTitle>
            <IonCardSubtitle>Nuestra aplicación se encargará de capturar tus alimentos.</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>Procura capturar una imagen decente, si no te convence vuelve a capturar.</IonCardContent>
        </IonCard>

        {photo ? (
          <>
            <IonImg src={photo} alt="Foto capturada" />

            <IonButton onClick={retakePhoto} expand="block" shape="round" color="danger">
              Retomar Foto
              <IonIcon icon={close} slot="start" />
            </IonButton>

            <IonButton color="success" expand="block" shape="round" onClick={EnviarBoletaEP}>{/* se debe integrar onclick */}
              Aceptar
              <IonIcon icon={checkmark} slot="start" />
            </IonButton>

            {/*<IonButton color="primary" expand="block" shape="round" onClick={generatePDF}>
              Guardar como PDF
            </IonButton>*/}
          </>
        ) : (
          <>
            <IonButton color="success" expand="block" shape="round" onClick={takePhoto}>
              Capturar Boleta
              <IonIcon icon={camera} slot="start" />
            </IonButton>

            {dontShowAgain && (
              <IonButton color="light" expand="block" shape="round" onClick={showInstructionsAgain}>
                Instrucciones
                <IonIcon icon={information} slot="start" />
              </IonButton>
            )}
          </>
        )}

        {/* Modal de instrucciones */}
        <IonModal isOpen={showModal}>
          <IonContent className="ion-padding">
            <IonTitle>Instrucciones</IonTitle>
            <p>Sigue estas indicaciones para capturar una buena imagen de tu boleta.</p>
            <br />
            <ul>
              <li>Asegúrate de que la boleta esté completamente visible.</li>
              <br />
              <li>Procura que la imagen esté bien iluminada.</li>
              <br />
              <li>Si la imagen no te convence, puedes volver a intentarlo.</li>
              <br />
            </ul>

            <IonCheckbox checked={dontShowAgain} onIonChange={e => setDontShowAgain(e.detail.checked)} />
            <IonLabel>No volver a mostrar</IonLabel>
            <br /><br /><br />

            <IonButton color="success" expand="block" shape="round" onClick={handleDontShowAgain}>Continuar</IonButton>
          </IonContent>
        </IonModal>

        <IonCard className="card-alimento-manual" color="medium">
          <IonCardHeader>
            <IonCardTitle>Ingreso de alimentos manual</IonCardTitle>
            <IonCardSubtitle>¿No tienes una boleta de compra a mano? ¡No te preocupes!</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>Ingresa tus alimentos de manera manual.</IonCardContent>
        </IonCard>

        {/* Botón para abrir el modal de ingreso manual */}
        <IonButton color="success" expand="block" shape="round" onClick={() => setShowManualInputModal(true)}>
          Ingresar alimentos
          <IonIcon icon={pencil} slot="start" />
        </IonButton>

        {/* Modal de ingreso manual */}
        <IonModal isOpen={showManualInputModal}>
          <IonHeader>
            <IonToolbar color={'light'}>
              <IonTitle>Ingreso Manual de Alimentos</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonItem>
              <IonLabel position="floating">Ingresa un alimento</IonLabel>
              <IonInput value={food} onIonChange={e => setFood(e.detail.value!)} />
            </IonItem>

            <IonButton color="success" expand="block" shape="round" onClick={addFoodItem}>
              Agregar Alimento
              <IonIcon icon={addCircleOutline} slot="start" />
            </IonButton>

            {/* Mostrar la lista de alimentos ingresados */}
            <IonList>
              {foodItems.map((item, index) => (
                <IonItem key={index}>{item}</IonItem>
              ))}
            </IonList>

            <IonButton expand="block" shape="round" color="danger" onClick={() => setShowManualInputModal(false)}>
              Cerrar
              <IonIcon icon={close} slot="start" />
            </IonButton>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;