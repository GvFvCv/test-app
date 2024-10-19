import React, { useState } from 'react';
import { IonPage, IonModal, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonList, IonCheckbox, IonButton, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonIcon } from '@ionic/react';
import './MinutaOff.css';
import { restaurant, cafe, moon } from 'ionicons/icons';

const MinutaOff: React.FC = () => {
  // Simulación de datos: lista de minutas
  const [minutas, setMinutas] = useState<string[]>([]);

  // Estado para controlar el modal
  const [showModal, setShowModal] = useState(false);

  // Consolidar todos los campos en un solo estado
  const [formData, setFormData] = useState({
    people_number: undefined,
    dietary_preference: '',
    desayuno: false,
    almuerzo: false,
    cena: false,
    hasRestrictions: false,
    restrictions: ''
  });

  // Función para manejar cambios en los inputs
  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para manejar cambios en los checkboxes y selects
  const handleSelectChange = (e: CustomEvent) => {
    const { value } = e.detail;
    const name = (e.target as HTMLSelectElement).name;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Función para manejar cambios en los checkboxes de comida
  const handleMealChange = (meal: 'desayuno' | 'almuerzo' | 'cena') => {
    setFormData(prev => ({
      ...prev,
      [meal]: !prev[meal]
    }));
  };

  // Función para manejar el envío de preferencias
  const handleSubmit = () => {
    console.log("Preferencias guardadas:", formData);
    // Aquí puedes manejar la lógica para pasar estos valores a la generación de la minuta
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
              <IonCardHeader>
                <IonCardTitle> Preferencias </IonCardTitle>
                <IonCardSubtitle> Seleccione las preferencias para la creación de su minuta. </IonCardSubtitle>
              </IonCardHeader>

              {/* Combobox para la cantidad de usuarios */}
              <IonItem>
                <IonLabel>Cantidad de personas</IonLabel>
                <IonSelect name="people_number" value={formData.people_number} placeholder="Selecciona" onIonChange={handleSelectChange}>
                  <IonSelectOption value={1}>1 Persona</IonSelectOption>
                  <IonSelectOption value={2}>2 Personas</IonSelectOption>
                  <IonSelectOption value={3}>3 Personas</IonSelectOption>
                  <IonSelectOption value={4}>4 Personas</IonSelectOption>
                  <IonSelectOption value={5}>5 Personas</IonSelectOption>
                </IonSelect>
              </IonItem>

              {/* Combobox para el tipo de dieta/preferencia */}
              <IonItem>
                <IonLabel>Tipo de Dieta</IonLabel>
                <IonSelect name="dietary_preference" value={formData.dietary_preference} placeholder="Selecciona" onIonChange={handleSelectChange}>
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
                </IonSelect>
              </IonItem>

              {/* Checklist para seleccionar desayuno, almuerzo o cena */}
              <IonList>
                <IonItem className="checkbox-item">
                  <IonIcon slot="start" icon={cafe}></IonIcon>
                  <IonLabel>Desayuno</IonLabel>
                  <IonCheckbox checked={formData.desayuno} onIonChange={() => handleMealChange('desayuno')} />
                </IonItem>
                <IonItem className="checkbox-item">
                  <IonIcon slot="start" icon={restaurant}></IonIcon>
                  <IonLabel>Almuerzo</IonLabel>
                  <IonCheckbox checked={formData.almuerzo} onIonChange={() => handleMealChange('almuerzo')} />
                </IonItem>
                <IonItem className="checkbox-item">
                  <IonIcon slot="start" icon={moon}></IonIcon>
                  <IonLabel>Cena</IonLabel>
                  <IonCheckbox checked={formData.cena} onIonChange={() => handleMealChange('cena')} />
                </IonItem>
              </IonList>

              {/* Botón para guardar las preferencias */}
              <IonButton expand="block" shape="round" color="success" onClick={handleSubmit}>
                Crear minuta
              </IonButton>
              <IonButton expand="block" shape="round" color="danger" onClick={() => setShowModal(false)}>
                Cancelar
              </IonButton>

            </IonCard>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default MinutaOff;
