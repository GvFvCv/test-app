import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonButton, IonTabBar, IonFooter } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Login.css';

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
    }
  }, []);

  const handleLogin = () => {
    history.replace('/tab1'); // Redirigimos a la primera pestaña después de iniciar sesión
  };

  const handleRegisterRedirect = () => {
    history.push('/Register'); // Redirigimos a la página de registro
  };

  return (
    <IonPage className="page-login">
      <IonContent className="centered-content">
        <div className="login-header">MINUT-IA</div>
        <div className='saludo'>Bienvenido  {isRegistered ? userName : 'Visitante'}</div>
        
        {isRegistered ? (
         <IonButton
         className="login-button styled-button"
         shape="round"
         onClick={handleLogin}
       >
         Ingresar
       </IonButton>
     ) : (
       <IonButton
         className="register-button styled-button"
         shape="round"
         onClick={handleRegisterRedirect}
       >
         Registrarse
       </IonButton>
        )}
      </IonContent>
      <IonFooter className='footer-bar'/>
    </IonPage>
  );
};  

export default Login;
