export const fetchRecommendations = async () => {
  try {
    const formData = new FormData();
    const registerResponse = localStorage.getItem('registerResponse');
    if (registerResponse) {
      const parsedResponse = JSON.parse(registerResponse);
      const userId = parsedResponse.id_user;
      const type_recommendation = 2;
      if (userId && type_recommendation) {
        formData.append('user_id', userId.toString());
        formData.append('type_recommendation', type_recommendation.toString());
      } else {
        throw new Error('User ID not found in registerResponse');
      }
    } else {
      throw new Error('registerResponse not found in localStorage');
    }

    /* const randomLimit = Math.ceil(Math.random() * 3);
    for (let i = 0; i < randomLimit; i++) {
      const randomType = Math.ceil(Math.random() * 3);
      formData.append('type_recommendation', randomType.toString());
    } */

    const response = await fetch('http://127.0.0.1:8000/app/recomendacion_compra/', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Validar que el tipo de contenido es JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      throw new Error(`Received non-JSON response: ${text}`);
    }

    const data = await response.json();

    // Validar que `data` contiene `recommendation` y que es un array o un mensaje válido
    if (!data.recommendation) {
      return [{ recommendation: "aun no hay recomendaciones para ti" }];
    }

    // Si `recommendation` no es un array, devuélvelo envuelto en un array
    return Array.isArray(data.recommendation) ? data.recommendation : [{ recommendation: data.recommendation }];
    
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [{ recommendation: "aun no hay recomendaciones para ti" }];
  }
};

export const saveToLocalStorage = (key: string, data: any) => {
  let existingData = JSON.parse(localStorage.getItem(key) || '[]');
  if (Array.isArray(existingData)) {
    existingData.push(data);
  } else {
    existingData = [data];
  }
  localStorage.setItem(key, JSON.stringify(existingData));
};

export const fetchRecommendationsOnceADay = async () => {
  try {
    const recommendations = await fetchRecommendations();
    const mappedRecommendations = recommendations.map((rec: any) => ({
      titulo_recomendacion: rec.titulo_recomendacion || rec.recomendacion || "Aun no hay recomendaciones para ti",
    }));
    const dateEntry = { date: new Date(), recommendations: mappedRecommendations || [] };
    saveToLocalStorage('recommendationsHistory', dateEntry);
    return mappedRecommendations || [];
  } catch (error) {
    console.error('Error fetching recommendations once a day:', error);
    return [];
  }
};