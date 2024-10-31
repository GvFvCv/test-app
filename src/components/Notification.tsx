// src/components/Notification.tsx
import React, { useState, useEffect } from 'react';
import './Notification.css'; // Archivo CSS para estilos

// Definimos las propiedades que el componente Notification recibirá
interface NotificationProps {
    message: string; // Mensaje de la notificación
    type: 'success' | 'error' | 'info'; // Tipo de notificación
    duration?: number; // Duración en milisegundos (opcional)
}

// Componente funcional de React para mostrar notificaciones
const Notification: React.FC<NotificationProps> = ({ message, type, duration = 3000 }) => {
    const [visible, setVisible] = useState(true); // Estado para manejar la visibilidad de la notificación

    // useEffect para ocultar la notificación después de un tiempo
    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false); // Oculta la notificación después de 'duration' milisegundos
        }, duration);

        return () => clearTimeout(timer); // Limpia el temporizador cuando el componente se desmonta
    }, [duration]);

    if (!visible) return null; // Si no es visible, no renderiza nada

    return (
        <div className={`notification ${type}`}> {/* Aplica clases CSS basadas en el tipo de notificación */}
            {message} {/* Muestra el mensaje de la notificación */}
        </div>
    );
};

export default Notification; // Exporta el componente para su uso en otros archivos