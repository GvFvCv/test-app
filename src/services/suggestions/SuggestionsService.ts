export const fetchSuggestions = async () => {
  try {
    const registerResponse = localStorage.getItem('registerResponse');
    if (!registerResponse) {
      console.warn('registerResponse no encontrado en localStorage');
      return [];
    }

    const parsedResponse = JSON.parse(registerResponse);
    const userId = parsedResponse.id_user;
    if (!userId) {
      console.warn('ID de usuario no encontrado en registerResponse');
      return [];
    }

    const currentDate = new Date().toISOString().split('T')[0];

    const response = await fetch(
      `http://127.0.0.1:8000/app/sugerencia_de_uso/?user_id=${userId}&date=${currentDate}`,
      { method: 'GET' }
    );

    if (!response.ok) {
      console.error(`Error HTTP! Estado: ${response.status}`);
      return [];
    }

    const data = await response.json();
    console.log('Respuesta de la API:', data);

    // Validar que la respuesta contiene la propiedad "suggestion"
    if (!data || typeof data.suggestion !== 'string') {
      console.warn('Formato inválido para la sugerencia recibida:', data);
      return [];
    }

    // Retornar la sugerencia en el formato esperado
    const suggestions = [{ sugerencia: data.suggestion }];
    console.log('Sugerencias obtenidas:', suggestions);

    return suggestions;
  } catch (error) {
    console.error('Error al obtener sugerencias:', error);
    return [];
  }
};


