import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonSelect, IonSelectOption, IonList, IonCheckbox, IonButton, IonInput, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonCardSubtitle, IonIcon } from '@ionic/react';
import { restaurant, cafe, moon} from 'ionicons/icons';
import './Tab2.css'

const Tab2: React.FC = () => {
  const [userCount, setUserCount] = useState<number>();
  const [dietType, setDietType] = useState<string>();
  const [selectedMeals, setSelectedMeals] = useState<{ desayuno: boolean; almuerzo: boolean; cena: boolean }>({
    desayuno: false,
    almuerzo: false,
    cena: false,
  });
  const [hasRestrictions, setHasRestrictions] = useState<boolean>(false);
  const [restrictions, setRestrictions] = useState<string>('');

  // Función para manejar los cambios en las comidas
  const handleMealChange = (meal: 'desayuno' | 'almuerzo' | 'cena') => {
    setSelectedMeals(prev => ({ ...prev, [meal]: !prev[meal] }));
  };

  // Función para manejar el envío de preferencias
  const handleSubmit = () => {
    const preferences = {
      userCount,
      dietType,
      selectedMeals,
      hasRestrictions,
      restrictions,
    };
    console.log("Preferencias guardadas:", preferences);
    // Aquí puedes manejar la lógica para pasar estos valores a la generación de la minuta
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Preferencias de la Minuta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding" color="light">
        <IonCard color="success">
          <IonCardHeader>
            <IonCardTitle> Preferencias </IonCardTitle>
            <IonCardSubtitle> Seleccione las preferencias para la creación de su minuta. </IonCardSubtitle>
          </IonCardHeader>
          {/* Combobox para la cantidad de usuarios */}
          <IonItem>
            <IonLabel>Cantidad de personas</IonLabel>
            <IonSelect value={userCount} placeholder="Selecciona" onIonChange={e => setUserCount(e.detail.value)}>
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
            <IonSelect value={dietType} placeholder="Selecciona" onIonChange={e => setDietType(e.detail.value)}>
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
            <IonItem>
              <IonIcon slot="start" icon={cafe}></IonIcon>
              <IonLabel>Desayuno</IonLabel>
              <IonCheckbox justify="end" checked={selectedMeals.desayuno} onIonChange={() => handleMealChange('desayuno')} />
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={restaurant}></IonIcon>
              <IonLabel>   Almuerzo</IonLabel>
              <IonCheckbox justify="end" checked={selectedMeals.almuerzo} onIonChange={() => handleMealChange('almuerzo')} />
            </IonItem>
            <IonItem>
              <IonIcon slot="start" icon={moon}></IonIcon>
              <IonLabel>Cena</IonLabel>
              <IonCheckbox justify="end" checked={selectedMeals.cena} onIonChange={() => handleMealChange('cena')} />
            </IonItem>
          </IonList>

          {/* Opción para restricciones alimentarias */}
          <IonItem>
            <IonLabel>¿Tienes alguna restricción especial?</IonLabel>
            <IonCheckbox justify="end" checked={hasRestrictions} onIonChange={e => setHasRestrictions(e.detail.checked)} />
          </IonItem>

          {/* Input para describir las restricciones alimentarias si el usuario selecciona "Sí" */}
          {hasRestrictions && (
            <IonItem>
              <IonLabel position="stacked">Describe tus restricciones</IonLabel>
              <IonInput value={restrictions} placeholder="Alergias, restricciones, etc." onIonChange={e => setRestrictions(e.detail.value!)} />
            </IonItem>
          )}

          {/* Botón para guardar las preferencias */}
          <IonButton color="dark" fill="clear" expand="block" onClick={handleSubmit}>Guardar Preferencias</IonButton>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
