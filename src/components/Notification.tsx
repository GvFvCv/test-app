// src/components/Notification.tsx
import React, { useState, useEffect } from 'react';
import './Notification.css'; // Archivo CSS para estilos

// Definimos las propiedades que el componente Notification recibirá
interface NotificationProps {
    message: string; // Mensaje de la notificación
    type: 'success' | 'error' | 'info'; // Tipo de notificación
    duration?: number; // Duración en milisegundos (opcional)
}

// Solicita permiso para mostrar notificaciones en segundo plano
const requestNotificationPermission = () => {
    console.log('Solicitando permiso para notificaciones...');
    if (Notification.permission !== 'granted') {
        Notification.requestPermission().then(permission => {
            console.log('Permiso de notificación:', permission);
        });
    }
};

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
const NotificationComponent: React.FC<NotificationProps> = ({ message, type, duration = 3000 }) => {
    const [visible, setVisible] = useState(true); // Estado para manejar la visibilidad de la notificación

    // useEffect para ocultar la notificación después de un tiempo
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false); // Oculta la notificación después de 'duration' milisegundos
        }, duration);

        return () => clearTimeout(timer); // Limpia el temporizador cuando el componente se desmonta
    }, [duration]);

    // useEffect para solicitar permiso y mostrar notificación en segundo plano
    useEffect(() => {
        requestNotificationPermission();
        showBackgroundNotification(message, type);
    }, [message, type]);

    if (!visible) return null; // Si no es visible, no renderiza nada

    return (
        <div className={`notification ${type}`}> {/* Aplica clases CSS basadas en el tipo de notificación */}
            {message} {/* Muestra el mensaje de la notificación */}
        </div>
    );
};

export default NotificationComponent; // Exporta el componente para su uso en otros archivos