import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonFooter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Importamos el contexto de autenticación
import './Login.css';

const Login: React.FC = () => {
  const { login } = useAuth(); // Usamos la función de login del contexto
  const history = useHistory();

  const handleLogin = () => {
    login(); // Iniciamos sesión utilizando el contexto
    history.replace('/tab1'); // Redirigimos a la primera pestaña después de iniciar sesión
  };

  return (
    <IonPage className="page-login">
      <IonContent className="centered-content">
        <div  className="login-header">Minuta IA</div>
        <div className='saludo'>Hola (usuario)</div>
        
        
        <IonButton className="login-button" shape='round' 
         onClick={handleLogin}>  Ingresar
        </IonButton>
        <div className="login-register-link">
          <a href="/Register">¿No tienes una cuenta? Regístrate</a>
        </div>
      </IonContent>
      <IonFooter className='login-footer'>
        <IonToolbar>
          <IonTitle>DUOC UC</IonTitle>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default Login;
