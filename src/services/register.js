export const registerapp = async (formData) => {
    const response = await fetch('http://127.0.0.1:8000/app/register/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',  // Necesario si envías JSON
      },
      body: JSON.stringify(formData),
    });
  
    if (!response.ok) {
      throw new Error('Error en el registro');
    }
  
    return response.json();
  };
  