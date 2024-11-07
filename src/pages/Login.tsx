import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonButton, IonFooter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Login.css';
import notificationService from '../services/notificationService'; // Importa el servicio de notificaciones
import { showBackgroundNotification } from '../components/Notification'; // Importa la función para mostrar notificaciones en segundo plano

const Login: React.FC = () => {
  const history = useHistory();
  const [isRegistered, setIsRegistered] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('registerResponse');
    if (user) {
      setIsRegistered(true);
      const userData = JSON.parse(user);
      setUserName(userData.name_user);
      showBackgroundNotification('¡Bienvenido a MINUT-IA!', 'success'); // Muestra una notificación de bienvenida
    }
  }, []);

  const handleLogin = () => {
    notificationService.addNotification('Ingreso exitoso', 'success'); // Agrega una notificación de éxito
    localStorage.setItem('isLoggedIn', 'true'); // Guarda el estado de inicio de sesión exitoso
    history.replace('/tab1'); // Redirigimos a la primera pestaña después de iniciar sesión
  };

  const handleRegisterRedirect = () => {
    history.push('/Register'); // Redirigimos a la página de registro
  };

  return (
    <IonPage  className="ion-page login-page"  >
      {/* <img src="\public\assets\apple.png" alt="apple" /> */}
      <IonContent>
        <div className="login-container">
          <div className="login-header">MINUT-IA</div>
          <div className='saludo'>BIENVENIDO {isRegistered ? userName.toUpperCase() : 'VISITANTE'}</div>
          
          {isRegistered ? (
            <IonButton
              className="login-button"
              onClick={handleLogin}
            >
              Ingresar
            </IonButton>
          ) : (
            <IonButton
              className="register-button styled-button"
              onClick={handleRegisterRedirect}
            >
              Registrate
            </IonButton>
          )}
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Login;
