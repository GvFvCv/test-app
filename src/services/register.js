export const registerapp = async (formData) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/app/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Error en el registro');
    }

    const data = await response.json();

    // Almacenar la respuesta en localStorage
    localStorage.setItem('registerResponse', JSON.stringify(data));

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};
