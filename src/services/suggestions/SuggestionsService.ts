// SuggestionsService.ts
export const fetchSuggestions = async () => {
  try {
    const registerResponse = localStorage.getItem('registerResponse'); // Obtener el objeto guardado en localStorage
    if (!registerResponse) {
      throw new Error('registerResponse not found in localStorage');
    }

    const parsedResponse = JSON.parse(registerResponse); // Parsear el objeto JSON
    const userId = parsedResponse.id_user; // Obtener el ID del usuario
    if (!userId) {
      throw new Error('User ID not found in registerResponse');
    }

    const response = await fetch(`http://127.0.0.1:8000/app/notificaciones4_aviso_sugerencia/`, {
      method: 'GET'
    });

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
      throw new Error('Invalid suggestions format');
    }

    const suggestions = data.notifications.map((item: { notification: string }) => ({ sugerencia: item.notification }));

    return suggestions;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

export const saveToLocalStorage = (key: string, data: any) => {
  const existingData = JSON.parse(localStorage.getItem(key) || '[]');
  localStorage.setItem(key, JSON.stringify([...existingData, data]));
};

export const fetchSuggestionsOnceADay = async () => {
  const suggestions = await fetchSuggestions();
  saveToLocalStorage('suggestionsHistory', { date: new Date(), suggestions });
  return suggestions;
};