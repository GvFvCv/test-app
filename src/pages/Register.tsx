import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonItem, IonLabel, IonButton } from '@ionic/react';
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
      <IonHeader>
        <IonToolbar>
          <IonTitle>Registro</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="centered-content">
        <div className="register-header">Crear una cuenta</div>
        <IonItem className="register-input">
          <IonLabel position="floating">Email</IonLabel>
          <IonInput value={email} onIonChange={e => setEmail(e.detail.value!)} />
        </IonItem>
        <IonItem className="register-input">
          <IonLabel position="floating">Contraseña</IonLabel>
          <IonInput type="password" value={password} onIonChange={e => setPassword(e.detail.value!)} />
        </IonItem>
        <IonButton className="register-button" expand="full" onClick={handleRegister}>Registrar</IonButton>
        <div className="register-login-link">
          <a href="/Login">¿Ya tienes una cuenta? Inicia sesión</a>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Register;
