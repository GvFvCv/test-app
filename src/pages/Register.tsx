import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton, IonSelect, IonText, IonSelectOption } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Register.css';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const history = useHistory();

  const handleRegister = () => {
    console.log("Registro exitoso", { email, password });
    history.push('/Login');
  };

  return (
    <IonPage className="page-register">
      <IonContent className="centered-content">
        <div className="register-header">Crear una cuenta</div>
        <IonItem className="register-input">
          <IonInput label='Nombre' value={email} onIonChange={e => setEmail(e.detail.value!)} />
        </IonItem>
        <IonItem className="register-input">
          <IonInput label='Apellido' type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
        </IonItem><IonItem className="register-input">
          <IonInput label='Fecha de Nacimiento' value={email} onIonChange={e => setEmail(e.detail.value!)} />
        </IonItem>
        <IonItem>
          <IonSelect placeholder=''>
            <div slot='label'>
             Ocupación <IonText color="danger">(Requerido)</IonText>
            </div>
            <IonSelectOption value="trabajador">trabajador</IonSelectOption>
            <IonSelectOption value="estudiante">estudiante</IonSelectOption>
            <IonSelectOption value="dueño de casa">dueño de casa</IonSelectOption>
          </IonSelect>
        </IonItem>
        
        <IonButton className="register-button" shape='round' 
          onClick={handleRegister}>Registrar       
        </IonButton>


        <div className="register-login-link">
          <a href="/Login">¿Ya tienes una cuenta? Inicia sesión</a>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
