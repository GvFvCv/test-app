import React, { useState, useEffect } from 'react';
import { IonAlert, IonPage, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonList, IonButton, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonIcon, IonToast, IonCheckbox } from '@ionic/react';
import './MinutaOff.css';
import { useHistory } from 'react-router-dom';
import { restaurant, cafe, moon, colorFill } from 'ionicons/icons';

const MinutaOff: React.FC = () => {
  // Simulación de datos: lista de minutas
  const [minutas, setMinutas] = useState<string[]>([]);

  // Estado para controlar el modal
  const [showModal, setShowModal] = useState(false);

  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  // Consolidar todos los campos en un solo estado
  const [formData, setFormData] = useState({
    user_id: '',
    dispensa_id: '',
    /* name_minuta: '', */
    start_date: '',
    people_number: '',
    dietary_preference: '',
    type_food: ''
  });

  // Estado para mostrar alertas
  const [showAlert, setShowAlert] = useState<boolean>(false);

  // Estado para mostrar alertas
  const [alertMessage, setAlertMessage] = useState<string>('');

  const history = useHistory();

  // Cargar user_id y dispensa_id desde el localStorage cuando el componente se monta
  useEffect(() => {
    const user = localStorage.getItem('registerResponse');
    if (user) {
      const userObj = JSON.parse(user);
      const userId = userObj.id_user;
      const dispensaId = userObj.dispensa;

      if (userId && dispensaId) {
        setFormData(prevFormData => ({
          ...prevFormData,
          user_id: userId,
          dispensa_id: dispensaId
        }));
      }
    }
  }, []);

  // Función para manejar cambios en los inputs
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    console.log(`Input Change - Name: ${name}, Value: ${value}`);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para manejar cambios en los selects
  const handleSelectChange = (e: CustomEvent) => {
    const { value } = e.detail;
    const name = (e.target as HTMLSelectElement).name;
    console.log(`Select Change - Name: ${name}, Value: ${value}`);
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para manejar el envío de preferencias
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form Submitted', formData);

    // Verificar que user_id y dispensa_id estén presentes
    if (!formData.user_id || !formData.dispensa_id) {
      console.error('user_id o dispensa_id no están presentes en formData');
      return;
    }

    // Convertir valores enteros a números
    const formDataToSend = {
      ...formData,
    };

    console.log('Form Data to Send:', formDataToSend);

    try {
      const response = await fetch('http://127.0.0.1:8000/app/create_minuta/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al crear la minuta:', errorData);
        
       // Establecer el mensaje de toast con el campo correcto
      setToastMessage(errorData.error || errorData.detail || 'Ocurrió un error al crear la minuta.');
      setShowToast(true);

      // Opcional: Retornar para detener la ejecución
      return;
      }

      const data = await response.json();
      console.log('Registro exitoso:', data);

      setFormData({
        user_id: '',
        dispensa_id: '',
       /*  name_minuta: '', */
        start_date: '',
        people_number: '',
        dietary_preference: '',
        type_food: ''
      });

      setShowModal(false);
      //history.push('/tab2');
    } catch (error: any) {
      console.error('Error en el registro:', error.message);
    }
  };

  // Función para manejar los cambios de selección
const handleCheckboxChange = (event: any) => {
  const { value, checked } = event.target;
  let updatedTypeFood = formData.type_food.split(',').map(item => item.trim());

  if (checked) {
    // Si está marcado, añadimos el valor al string
    updatedTypeFood.push(value);
  } else {
    // Si está desmarcado, lo removemos del string
    updatedTypeFood = updatedTypeFood.filter(item => item !== value);
  }

  // Actualizamos type_food como una cadena concatenada
  setFormData({ ...formData, type_food: updatedTypeFood.join(', ') });
};

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
        <IonButton className="crear" shape='round' onClick={() => setShowModal(true)}>
          Crear
        </IonButton>

        {/* Modal para mostrar las preferencias */}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonContent className="ion-padding" color="light">
            <div className='bba'>
              <h1 className='bbb'>CREAR MINUTA</h1>
            </div>
            <br /><br />
            <IonCard color="light">
              <form onSubmit={handleSubmit} className='form-content'>
                <IonCardHeader>
                  <IonCardTitle> Preferencias </IonCardTitle>
                  <IonCardSubtitle> Seleccione las preferencias para la creación de su minuta. </IonCardSubtitle>
                  <br />
                </IonCardHeader>

                {/* Input para el nombre de la minuta 
                <IonItem>
                  <IonLabel position="floating">Nombre de la minuta</IonLabel>
                  <IonInput type="text" name="name_minuta" value={formData.name_minuta} onIonChange={handleInputChange} required></IonInput>
                </IonItem>*/}

                {/* Input para la fecha de inicio */}
                <IonItem>
                  <IonLabel position="floating">Fecha de inicio</IonLabel>
                  <IonInput type="date" name="start_date" value={formData.start_date} onIonChange={handleInputChange} required></IonInput>
                </IonItem>

                {/* Combobox para la cantidad de usuarios */}
                <IonItem>
                  <IonLabel>Cantidad de personas</IonLabel>
                  <IonSelect slot='end' name="people_number" value={formData.people_number} placeholder="Selecciona" onIonChange={handleSelectChange}>
                    <IonSelectOption value="1">1 Persona</IonSelectOption>
                    <IonSelectOption value="2">2 Personas</IonSelectOption>
                    <IonSelectOption value="3">3 Personas</IonSelectOption>
                    <IonSelectOption value="4">4 Personas</IonSelectOption>
                    <IonSelectOption value="5">5 Personas</IonSelectOption>
                  </IonSelect>
                </IonItem>

                {/* Combobox para el tipo de dieta/preferencia */}
                <IonItem>
                  <IonLabel>Tipo de Dieta</IonLabel>
                  <IonSelect slot='end' name="dietary_preference" value={formData.dietary_preference} placeholder="Selecciona" onIonChange={handleSelectChange}>
                    <IonSelectOption value="normal">Normal (balanceada)</IonSelectOption>
                    <IonSelectOption value="vegetariana">Vegetariana</IonSelectOption>
                    <IonSelectOption value="vegana">Vegana</IonSelectOption>
                    <IonSelectOption value="cetogenica">Cetogénica (keto)</IonSelectOption>
                    <IonSelectOption value="mediterranea">Mediterránea</IonSelectOption>
                    <IonSelectOption value="hipocalorica">Hipocalórica</IonSelectOption>
                    <IonSelectOption value="detox">Detox</IonSelectOption>
                    <IonSelectOption value="hiperproteica">Hiperproteica</IonSelectOption>
                    <IonSelectOption value="gluten">Sin gluten</IonSelectOption>
                    <IonSelectOption value="flexitariana">Flexitariana</IonSelectOption>
                    <IonSelectOption value="economica">Económica</IonSelectOption>
                  </IonSelect>
                </IonItem>

                {/* Checkbox para seleccionar tipo de comida */}
                <IonList>
                  <IonItem>
                    <IonLabel>Tipo de Comida</IonLabel>
                  </IonItem>

                  <IonItem>
                    <IonLabel>Desayuno</IonLabel>
                    <IonCheckbox
                      slot="end"
                      value="desayuno"
                      checked={formData.type_food.includes("desayuno")}
                      onIonChange={handleCheckboxChange}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel>Almuerzo</IonLabel>
                    <IonCheckbox
                      slot="end"
                      value="almuerzo"
                      checked={formData.type_food.includes("almuerzo")}
                      onIonChange={handleCheckboxChange}
                    />
                  </IonItem>

                  <IonItem>
                    <IonLabel>Cena</IonLabel>
                    <IonCheckbox
                      slot="end"
                      value="cena"
                      checked={formData.type_food.includes("cena")}
                      onIonChange={handleCheckboxChange}
                    />
                  </IonItem>
                </IonList>
                <br /><br />
                {/* Botón para guardar las preferencias */}
                <IonButton expand="block" shape="round" color="success" type="submit">
                  Crear minuta
                </IonButton>
                <br />
                <IonButton expand="block" shape="round" color="danger" onClick={() => setShowModal(false)}>
                  Cancelar
                </IonButton>
              </form>
            </IonCard>
            {/* Componente de Alerta usando IonToast */}
      <IonToast
        isOpen={showToast}
        onDidDismiss={() => setShowToast(false)}
        message={toastMessage}
        duration={3000}
        color="danger"
        position="top"
      />
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
    
  );
};

export default MinutaOff;
