// src/services/notificationService.js
class NotificationService {
    constructor() {
        this.notifications = []; // Array para almacenar las notificaciones
        this.listeners = []; // Array para almacenar los listeners
    }

    // Método para agregar una nueva notificación
    addNotification(message, type = 'info') {
        const id = new Date().getTime(); // Genera un ID único basado en el tiempo actual
        const notification = { id, message, type }; // Crea un objeto de notificación
        this.notifications.push(notification); // Agrega la notificación al array
        this.notifyListeners(notification); // Notifica a todos los listeners
    }

    // Método para notificar a todos los listeners
    notifyListeners(notification) {
        this.listeners.forEach(listener => listener(notification)); // Llama a cada listener con la nueva notificación
    }

    // Método para suscribir un nuevo listener
    subscribe(listener) {
        this.listeners.push(listener); // Agrega el listener al array
    }

    // Método para cancelar la suscripción de un listener
    unsubscribe(listener) {
        this.listeners = this.listeners.filter(l => l !== listener); // Elimina el listener del array
    }
}

export default new NotificationService(); // Exporta una instancia del servicio de notificaciones