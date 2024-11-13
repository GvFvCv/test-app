export const fetchNotifications = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/app/notificaciones1_minuta/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Received non-JSON response: ${text}`);
    }
    const data = await response.json();
    if (!data.notifications || !Array.isArray(data.notifications)) {
      throw new Error('Invalid notifications format');
    }
    return data.notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

export const fetchNotificationstwo = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/app/notificaciones2_despensa/');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Received non-JSON response: ${text}`);
    }
    const data = await response.json();
    if (!data.notifications || !Array.isArray(data.notifications)) {
      throw new Error('Invalid notifications format');
    }
    return data.notifications;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }
};

// Función para guardar en localStorage
export const saveToLocalStorage = (key: string, data: any) => {
  const existingData = JSON.parse(localStorage.getItem(key) || '[]');
  existingData.push(data);
  localStorage.setItem(key, JSON.stringify(existingData));
};

// Función principal de obtención de notificaciones y almacenamiento
export const fetchNotificationsOnceADay = async () => {
  const [notifications1, notifications2] = await Promise.all([fetchNotifications(), fetchNotificationstwo()]);
  const notifications = [...notifications1, ...notifications2];
  const dateEntry = { date: new Date(), notifications };
  saveToLocalStorage('notificationsHistory', dateEntry); // Guardar notificaciones en localStorage
  return notifications;
};
