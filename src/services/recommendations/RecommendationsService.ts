// RecommendationsService.ts

// Función para generar un número aleatorio entre 1 y 3
const getRandomTypeRecommendation = (): number => {
  return Math.floor(Math.random() * 3) + 1;
};

export const fetchRecommendations = async () => {
  try {
    const user_id = 1; // Valor manual para user_id
    const type_recommendation = 1; // Valor manual para type_recommendation

    const response = await fetch('http://127.0.0.1:8000/app/recomendacion_compra/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        user_id: 1,
        type_recommendation: getRandomTypeRecommendation()
      })
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
    if (!data.recommendation || !Array.isArray(data.recommendation)) {
      throw new Error('Invalid recommendations format');
    }
    return data.recommendation.map((item: { recomendacion: string }) => item.recomendacion);
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return [];
  }
};

export const saveToLocalStorage = (key: string, data: any) => {
  const existingData = JSON.parse(localStorage.getItem(key) || '[]');
  existingData.push(data);
  localStorage.setItem(key, JSON.stringify(existingData));
};

export const fetchRecommendationsOnceADay = async () => {
  const recommendations = await fetchRecommendations();
  saveToLocalStorage('recommendationsHistory', { date: new Date(), recommendations });
  return recommendations;
};