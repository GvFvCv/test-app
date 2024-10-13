import React, { useState } from 'react';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSelect, IonSelectOption, IonLabel, IonItem, IonInput, IonButton } from '@ionic/react';
import './Register.css';
import { registerapp } from '../services/register';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name_user: '',
    last_name_user: '',
    year_user: '',
    user_type: ''
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
    console.log('Form Submitted', formData);
    try {
      const response = await registerapp(formData);
      console.log('Registro exitoso:', response);
      setFormData({
        name_user: '',
        last_name_user: '',
        year_user: '',
        user_type: ''
      });
    } catch (error) {
      console.error('Error en el registro:', error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <form onSubmit={handleSubmit}>
          <IonItem>
            <IonLabel position="floating">Nombre</IonLabel>
            <IonInput
              type="text"
              name="name_user"
              value={formData.name_user}
              onIonChange={handleInputChange}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Apellido</IonLabel>
            <IonInput
              type="text"
              name="last_name_user"
              value={formData.last_name_user}
              onIonChange={handleInputChange}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Edad</IonLabel>
            <IonInput
              type="number"
              name="year_user"
              value={formData.year_user}
              onIonChange={handleInputChange}
            />
          </IonItem>

          <IonItem>
            <IonLabel>Opciones</IonLabel>
            <IonSelect
              name="user_type"
              value={formData.user_type}
              placeholder="Seleccione una ocupación"
              onIonChange={handleSelectChange}
            >
              <IonSelectOption value="Estudiante">Estudiante</IonSelectOption>
              <IonSelectOption value="Trabajador">Trabajador</IonSelectOption>
              <IonSelectOption value="Dueño de casa">Dueño de casa</IonSelectOption>
            </IonSelect>
          </IonItem>

          <IonButton expand="full" type="submit">Enviar</IonButton>
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Register;