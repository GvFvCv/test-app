export const registerFood = async (FormData) => {
  try {
    const response = await fetch('http://127.0.0.1:8000/app/join_aliment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(FormData),
    });

    if (!response.ok) {
      console.error('Detalles del error:', responseData);
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al registrar alimento:', error);
    throw error; // Re-lanza el error para que pueda ser manejado en otro lugar si es necesario
  }
};

//registerFood(foodData)
//  .then(result => console.log('Alimento registrado:', result))
//  .catch(err => console.error('Error en el registro:', err));