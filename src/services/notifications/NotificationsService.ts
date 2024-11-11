// NotificationsService.ts
export const fetchNotifications = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/app/notificaciones1/user_id');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text(); // Leer la respuesta como texto
      throw new Error(`Received non-JSON response: ${text}`);
    }
    const data = await response.json();
    if (!data.notifications || !Array.isArray(data.notifications)) {
      throw new Error('Invalid notifications format');
    }
    return data.notifications.map((item: { notification: string }) => {
      const title = 'No tienes nueva notificacion';
      const message = '¡No tienes notificacion de Minutas!';
      return {
        title: title,
        message: message
      };
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const fetchNotificationstwo = async () => {
  try {
    const registerResponse = JSON.parse(localStorage.getItem('registerResponse') || '{}');
    const response = await fetch('http://127.0.0.1:8000/app/notificaciones2/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text(); // Leer la respuesta como texto
      throw new Error(`Received non-JSON response: ${text}`);
    }
    const data = await response.json();
    if (!data.notifications || !Array.isArray(data.notifications)) {
      throw new Error('Invalid notifications format');
    }
    return data.notifications.map((item: { notification: string }) => {
      const title = '¡Tu despensa está vacia!';
      const message = '¡Agrega alimentos para poder planifcar tus comidas!';
      return {
        title: title,
        message: message
      };
    });
  } catch (error) {
    console.error('Error fetching additional notifications:', error);
    return [];
  }
};

export const saveToLocalStorage = (key: string, data: any) => {
  const existingData = JSON.parse(localStorage.getItem(key) || '[]');
  existingData.push(data);
  localStorage.setItem(key, JSON.stringify(existingData));
};

export const fetchNotificationsOnceADay = async () => {
  const [notifications1, notifications2] = await Promise.all([fetchNotifications(), fetchNotificationstwo()]);
  const notifications = [...notifications1, ...notifications2];
  saveToLocalStorage('notificationsHistory', { date: new Date(), notifications });
  return notifications;
};