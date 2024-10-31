import React, { useState, useEffect } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonImg, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonModal, IonCheckbox, IonLabel, IonItem, IonInput, IonList, IonSelect, IonSelectOption, IonFooter } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { camera, checkmark, close, arrowBack, pencil, information, addCircleOutline, image } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { enviarDatos } from '../services/ingresoboleta';
//import { registerFood } from '../services/foodService'; // RREMPLAZAR POR SERVICIO REAAL
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

  const [formData, setFormData] = useState({
    user_id: '',
    name_aliment: '',
    unit_measurement: '',
    load_alimento: ''
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    console.log(`Input Change - Name: ${name}, Value: ${value}`);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (e: CustomEvent) => {
    const { value } = e.detail;
    const name = (e.target as HTMLSelectElement).name;
    console.log(`Select Change - Name: ${name}, Value: ${value}`);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const dataToSubmit = { ...formData, user_id }; // Incluir user_id en el envío
      const response = await registerFood(dataToSubmit); // Implementa esta función en tu servicio
      console.log('Registro de alimento exitoso:', response);
      setFormData({
        user_id: '',
        name_aliment: '',
        unit_measurement: '',
        load_alimento: ''
      });
      history.push('/tab3'); // Redirige a otra página después del registro
    } catch (error) {
      console.error('Error en el registro del alimento:', error);
    }
  };

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

  const getStoredResponse = () => {
    const storedResponse = localStorage.getItem('serverResponse');
    if (storedResponse) {
      return JSON.parse(storedResponse);
    }
    return null;
  };

  const EnviarBoletaEP = async () => {
    // Recuperar el objeto de usuario del localStorage
    const user = localStorage.getItem('registerResponse');
    if (!user) {
      console.error('No se encontró el objeto de usuario en el localStorage');
      return;
    }

    const userObj = JSON.parse(user);
    const userId = userObj.id_user;
    if (!userId) {
      console.error('No se encontró el ID de usuario en el objeto de usuario');
      return;
    }

    // Enviar la boleta al endpoint
    try {
      const response = await enviarDatos(userId, photo);
      console.log('Respuesta del servidor:', response);

      // Guardar la respuesta en el localStorage
      localStorage.setItem('serverResponse', JSON.stringify(response));

      /* setAlertMessage(`Respuesta del servidor: ${JSON.stringify(response)}`); */
      /* setShowAlert(true); */
    } catch (error) {
      console.error('Error al enviar la foto:', error);
      /* setAlertMessage(`Error al enviar la foto: ${error.message}`);
      setShowAlert(true); */
    }
  };

  const storedResponse = getStoredResponse();

  return (
    <IonPage color={'light'}>
      <div className='bba'>
        <h1 className='bbb'>CAPTURAR</h1>
      </div>
      <IonContent className="ion-padding">
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
          <div className='form-title'>
            <h1>REGISTRO DE ALIMENTOS</h1>
          </div>
          <IonContent className='food-entry-page'>
            <form onSubmit={handleSubmit} className='form-content'>
              {/* Nombre del alimento */}
              <IonItem className='form-item'>
                <IonInput
                  label='Nombre del Alimento'
                  labelPlacement='floating'
                  type="text"
                  name="name_aliment"
                  value={formData.name_aliment}
                  onIonChange={handleInputChange}
                  required
                />
              </IonItem>

              {/* Unidad de medida */}
              <IonItem className='form-item'>
                <IonSelect
                  name="unit_measurement"
                  label='Unidad de Medida'
                  labelPlacement='floating'
                  value={formData.unit_measurement}
                  placeholder="Seleccione una unidad de medida"
                  onIonChange={handleSelectChange}
                >
                  <IonSelectOption value="kg">kg</IonSelectOption>
                  <IonSelectOption value="g">g</IonSelectOption>
                  <IonSelectOption value="mg">mg</IonSelectOption>
                  <IonSelectOption value="L">L</IonSelectOption>
                  <IonSelectOption value="ml">ml</IonSelectOption>
                </IonSelect>
              </IonItem>

              {/* Cantidad */}
              <IonItem className='form-item'>
                <IonInput
                  label='Cantidad'
                  labelPlacement='floating'
                  type="number"
                  name="load_alimento"
                  placeholder='0'
                  value={formData.load_alimento}
                  onIonChange={handleInputChange}
                  required
                />
              </IonItem>

              {/* Botón de envío */}
              <div className='form-button'>
                <IonButton expand="block" shape="round" color="success" type="submit">
                  Registrar Alimento
                </IonButton>
                <IonButton expand="block" shape="round" color="danger" onClick={() => setShowManualInputModal(false)}>
                  Cancelar
                </IonButton>

              </div>
            </form>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default Tab3;