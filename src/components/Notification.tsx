import React, { useEffect, useState } from 'react';
import './Notification.css';

interface NotificationProps {
    message: string;
    type: 'success' | 'error' | 'info';
    duration?: number;
    delay?: number; // Nuevo prop para el delay
}

// Muestra una notificación en segundo plano
export const showBackgroundNotification = (message: string, type: 'success' | 'error' | 'info') => {
    console.log('Mostrando notificación en segundo plano...');
    if (Notification.permission === 'granted') {
        new Notification(message, {
            icon: `/path/to/${type}-icon.png`, // Puedes cambiar el icono según el tipo
            body: message,
        });
    } else {
        console.log('Permiso de notificación no concedido.');
    }
};

// Componente funcional de React para mostrar notificaciones
const NotificationComponent: React.FC<NotificationProps> = ({ message, type, duration = 4000, delay = 1000 }) => {
    const [visible, setVisible] = useState(false); // Estado para manejar la visibilidad de la notificación

    // useEffect para manejar el delay y la visibilidad de la notificación
    useEffect(() => {
        const showTimer = setTimeout(() => {
            setVisible(true); // Muestra la notificación después del delay
            const hideTimer = setTimeout(() => {
                setVisible(false); // Oculta la notificación después de 'duration' milisegundos
            }, duration);

            return () => clearTimeout(hideTimer); // Limpia el temporizador cuando el componente se desmonta
        }, delay);

        return () => clearTimeout(showTimer); // Limpia el temporizador cuando el componente se desmonta
    }, [duration, delay]);

    // useEffect para solicitar permiso y mostrar notificación en segundo plano
    useEffect(() => {
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }, []);

    return (
        <div className={`notification ${type} ${visible ? 'show' : 'hide'}`}>
            <span className='text'>{message}</span>
        </div>
    );
};

export default NotificationComponent;

