import React, { useState, useEffect } from 'react';
import { IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLoading, IonImg, IonIcon, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonModal, IonCheckbox, IonLabel, IonItem, IonInput, IonList, IonSelect, IonSelectOption, IonFooter, IonAlert } from '@ionic/react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { camera, checkmark, close, arrowBack, pencil, information, addCircleOutline, image, umbrella } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';
import { enviarDatos } from '../services/ingresoboleta';
import { registerFood } from '../services/ingresomanual'; // RREMPLAZAR POR SERVICIO REAAL
import './Tab3.css'

const Tab3: React.FC = () => {
  const [photo, setPhoto] = useState<string | undefined>();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);
  const [isFirstCapture, setIsFirstCapture] = useState<boolean>(true);
  const [showManualInputModal, setShowManualInputModal] = useState<boolean>(false); // Para el modal de ingreso manual
  const [foodItems, setFoodItems] = useState<string[]>([]); // Estado para almacenar alimentos ingresados
  const [food, setFood] = useState<string>(""); // Estado para manejar el input de alimentos
  const [loading, setLoading] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const history = useHistory();
  let imageboleta = "";

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");

  const [formData, setFormData] = useState({
    user_id: '',
    name_aliment: '',
    unit_measurement: '',
    load_alimento: '',
    uso_alimento: ''
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    console.log(`Input Change - Name: ${name}, Value: ${value}`);

    // Convertir el valor a mayúsculas
    const upperCaseValue = value.toUpperCase();

    // Actualizar el estado con el valor convertido a mayúsculas
    setFormData({
      ...formData,
      [name]: upperCaseValue
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

  // Maneja el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
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

      const dataToSubmit = { ...formData, user_id: userId };
      const response = await registerFood(dataToSubmit);
      console.log('Registro de alimento exitoso:', response);

      // Resetear el formulario
      setFormData({
        user_id: '',
        name_aliment: '',
        unit_measurement: '',
        load_alimento: '',
        uso_alimento: ''
      });

      // Extraer el mensaje del servidor utilizando map
      const messageArray = [response].map(res => res.message);
      const message = messageArray[0] || "Ingreso de alimento exitoso"; // Mensaje por defecto si no se encuentra el mensaje

      ShowAlert(`${message}`); // Mostrar la respuesta en la alerta
      // Redirigir después de enviar

    } catch (error) {
      console.error('Error en el registro del alimento:', error);
      ShowAlert(`Error al intentar registrar: ${(error as Error).message}`);
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
      quality: 100, // Calidad de la imagen
      allowEditing: false,
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
    });
    setPhoto(image.webPath);
  };

  const retakePhoto = () => {
    setPhoto(undefined);
  };

  const ShowAlert = (message: string) => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  };

  const EnviarBoletaEP = async () => {
    setLoading(true);
    try {
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
      const response = await enviarDatos(userId, photo); // Enviar la foto al servidor
      console.log('Respuesta del servidor:', response); // Mostrar la respuesta en la consola
      localStorage.setItem('serverResponse', JSON.stringify(response)); // Almacenar la respuesta en el localStorage

      // Extraer el mensaje del servidor utilizando map
      const messageArray = [response].map(res => res.message);
      const message = messageArray[0] || "Ingreso de alimentos exitoso"; // Mensaje por defecto si no se encuentra el mensaje

      setShowModal(false);

      ShowAlert(`${message}`); // Mostrar la respuesta en la alerta
      history.push('/tab2'); // Redirigir después de enviar
    }
    catch (error) {
      console.error('Error al enviar la foto:', error);
      ShowAlert(`Error al enviar la foto: ${(error as Error).message}`);
    } finally {
      setLoading(false);  // Finaliza el loading
    }
  };

  const getStoredResponse = () => {
    const storedResponse = localStorage.getItem('serverResponse');
    if (storedResponse) {
      return JSON.parse(storedResponse);
    }
    return null;
  };

  const storedResponse = getStoredResponse();


  // Efecto para cargar la preferencia desde localStorage al cargar la página
  useEffect(() => {
    const savedPreference = localStorage.getItem('showInstructions');
    if (savedPreference !== null) {
      setShowInstructions(savedPreference === 'true');
    }
  }, []);

  // Función para guardar la preferencia en localStorage
  const toggleInstructions = (visible: boolean) => {
    setShowInstructions(visible);
    localStorage.setItem('showInstructions', visible.toString());
  };


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

        <IonButton color="success" expand="block" shape="round" onClick={() => setShowModal(true)} /**/>
          Capturar Boleta
          <IonIcon icon={camera} slot="start" />
        </IonButton>

        {/* Modal captura boleta */}
        <IonModal isOpen={showModal}>
          <IonContent className="ion-padding">
            <div className='bba'>
              <h1 className='bbb'>CAPTURAR</h1>
            </div>

            <IonButton fill="clear" onClick={() => setShowModal(false)}>
              <IonIcon icon={arrowBack} slot="start" color='success' />
            </IonButton>
            <br /><br />

            {showInstructions ? (

              <IonCard>
                <IonCardHeader>
                  <IonTitle>Instrucciones</IonTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>Sigue estas indicaciones para capturar una buena imagen de tu boleta.</p>
                  <br />
                  <ul>
                    <li>Asegúrate que la parte de los productos de la boleta esté completamente visible.</li>
                    <br />
                    <li>Procura que la imagen esté bien iluminada.</li>
                    <br />
                    <li>No te preocupes por los que no son alimentos, estos no seran ingresados.</li>
                    <br />
                    <li>Si la imagen no te convence, puedes volver a intentarlo.</li>
                    <br />
                  </ul>

                  <IonButton expand="block" shape="round" onClick={() => toggleInstructions(false)}>
                    Ocultar Instrucciones
                    <IonIcon icon={information} slot="start" />
                  </IonButton>

                </IonCardContent>
              </IonCard>

            ) : (

              <IonButton expand="block" shape="round" onClick={() => toggleInstructions(true)}>
                Mostrar Instrucciones
                <IonIcon icon={information} slot="start" />
              </IonButton>

            )}

            <br />

            {!photo ? (

              <IonButton color="success" expand="block" shape="round" onClick={takePhoto}>Capturar Alimentos</IonButton>

            ) : (
              <>
                <IonImg src={photo} alt="Foto capturada" />

                <IonButton className='btn_despensaon_1' color="success" expand="block" shape="round" onClick={EnviarBoletaEP}>
                  <h3><IonIcon icon={checkmark} slot="start" /></h3>
                </IonButton>

                <IonButton className="btn_despensaon_2" onClick={retakePhoto} expand="block" shape="round" color="danger">
                  <h3><IonIcon icon={close} slot="start" /></h3>
                </IonButton>

                {/* Componente de carga */}
                <IonLoading
                  isOpen={loading}
                  message={'Ingresando alimentos...'}
                />

              </>
            )}
          </IonContent>
        </IonModal>

        {/* Ingreso de alimentos manual */}

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
                  <IonSelectOption value="gr">gr</IonSelectOption>
                  <IonSelectOption value="lt">lt</IonSelectOption>
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

              {/* Unidad de medida */}
              <IonItem className='form-item'>
                <IonSelect
                  name="uso_alimento"
                  label='Uso del Alimento'
                  labelPlacement='floating'
                  value={formData.uso_alimento}
                  placeholder="Seleccione una opción"
                  onIonChange={handleSelectChange}
                >
                  <IonSelectOption value="desayuno">Desayuno</IonSelectOption>
                  <IonSelectOption value="almuerzo">Almuerzo</IonSelectOption>
                  <IonSelectOption value="cena">Cena</IonSelectOption>
                </IonSelect>
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

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header={'Alerta'}
          message={alertMessage}
          buttons={['ACEPTAR']}
          cssClass='custom-alert'
        />
      </IonContent>
    </IonPage>
  );
};

export default Tab3;