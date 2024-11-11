// RecommendationsService.ts
export const fetchRecommendations = async () => {
  try {
    const response = await fetch('http://127.0.0.1:8000/app/notificaciones4/user_id');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text(); // Leer la respuesta como texto
      throw new Error(`Received non-JSON response: ${text}`);
    }
    const data = await response.json();
    if (!data.recommendations || !Array.isArray(data.recommendations)) {
      throw new Error('Invalid recommendations format');
    }
    return data.recommendations.map((item: { recommendation: string }) => item.recommendation);
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