import React, { useState, useEffect } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonImg, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonModal, IonCheckbox, IonLabel } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { camera, checkmark, close, arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { jsPDF } from 'jspdf'; // Importar jsPDF

const Tab3: React.FC = () => {
  const [photo, setPhoto] = useState<string | undefined>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const history = useHistory();

  // Al cargar el componente, verificamos si el usuario ha deshabilitado el modal de instrucciones
  useEffect(() => {
    const hideInstructions = localStorage.getItem('hideInstructions');
    if (hideInstructions) {
      setDontShowAgain(true); // Si el usuario eligió "no mostrar otra vez", guardamos esa preferencia
    }
  }, []);

  const takePhoto = async () => {
    if (!dontShowAgain) {
      setShowModal(true);  // Mostramos el modal solo si el usuario no ha elegido "no mostrar otra vez"
    } else {
      await captureImage(); // Si ya eligió no mostrar, directamente capturamos la foto
    }
  };

  const captureImage = async () => {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    setPhoto(image.dataUrl);
  };

  const retakePhoto = () => {
    setPhoto(undefined);
  };

  const generatePDF = () => {
    if (!photo) return;
    const doc = new jsPDF();
    doc.addImage(photo, 'JPEG', 10, 10, 180, 240);
    doc.save('captura_boleta.pdf');
  };

  const handleDontShowAgain = () => {
    if (dontShowAgain) {
      localStorage.setItem('hideInstructions', 'true');  // Guardamos la preferencia en localStorage
    }
    setShowModal(false);  // Cerramos el modal
    captureImage();        // Después de cerrar el modal, capturamos la imagen
  };

  const showInstructionsAgain = () => {
    setShowModal(true);
  };

  return (
    <IonPage color="light">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Capturar Boleta</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton onClick={() => history.goBack()} fill="clear">
          <IonIcon icon={arrowBack} slot="start" color='success'/>
        </IonButton>
        <br />

        {!photo && (
          <IonCard color="medium">
            <IonCardHeader>
              <IonCardTitle>Captura tu boleta</IonCardTitle>
              <IonCardSubtitle>Nuestra aplicación se encargará de capturar tus alimentos.</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>Procura capturar una imagen decente, si no te convence vuelve a capturar.</IonCardContent>
          </IonCard>
        )}

        {photo ? (
          <>
            <IonImg src={photo} alt="Foto capturada" />

            <IonButton onClick={retakePhoto} expand="block" shape="round" color="danger">
              Retomar Foto
              <IonIcon icon={close} slot="start" />
            </IonButton>

            <IonButton color="success" expand="block" shape="round">
              Aceptar
              <IonIcon icon={checkmark} slot="start" />
            </IonButton>

            <IonButton color="primary" expand="block" shape="round" onClick={generatePDF}>
              Guardar como PDF
            </IonButton>
          </>
        ) : (
          <>
            {/* Botón para capturar la foto */}
            <IonButton color="success" expand="block" shape="round" onClick={takePhoto}>
              Capturar Boleta
              <IonIcon icon={camera} slot="start" />
            </IonButton>

            {/* Botón para mostrar instrucciones nuevamente si el usuario desactivó el modal */}
            {dontShowAgain && (
              <IonButton color="light" expand="block" shape="round" onClick={showInstructionsAgain}>
                Instrucciones
              </IonButton>
            )}
          </>
        )}

        {/* Modal de instrucciones */}
        <IonModal isOpen={showModal}>
          <IonContent className="ion-padding">
            <IonTitle>Instrucciones</IonTitle>
            <p>Sigue estas indicaciones para capturar una buena imagen de tu boleta.</p>
            <ul>
              <li>Asegúrate de que la boleta esté completamente visible.</li>
              <li>Procura que la imagen esté bien iluminada.</li>
              <li>Si la imagen no te convence, puedes volver a intentarlo.</li>
            </ul>

            <IonCheckbox checked={dontShowAgain} onIonChange={e => setDontShowAgain(e.detail.checked)} />
            <IonLabel>No volver a mostrar</IonLabel>
            <br /><br />

            <IonButton onClick={handleDontShowAgain}>Continuar</IonButton>
          </IonContent>
        </IonModal>
        <IonCard color="medium">
          <IonCardHeader>
            <IonCardTitle>Captura tu boleta</IonCardTitle>
            <IonCardSubtitle>Nuestra aplicación se encargará de capturar tus alimentos.</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>Procura capturar una imagen decente, si no te convence vuelve a capturar.</IonCardContent>
        </IonCard>
      
      </IonContent>
      
    </IonPage>
  );
};

export default Tab3;
