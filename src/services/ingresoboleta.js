// src/services/ingresoboleta.js
const API_URL = 'http://127.0.0.1:8000/app/getinto_ticket/';

export const enviarDatos = async (user_id, fileUri) => {
  try {
    const formData = new FormData();

    // Agregar id_usuario y archivo al FormData
    formData.append('user_id', user_id);
    const response = await fetch(fileUri);
    const blob = await response.blob();
    formData.append('file', blob, 'photo.jpg');

    const result = await fetch(API_URL, {
      method: 'POST',
      body: formData, // Enviar el FormData directamente
    });

    if (!result.ok) {
      const errorText = await result.text();
      throw new Error(`Error en la solicitud: ${errorText}`);
    }

    const resultado = await result.json();
    return resultado; // Devolver la respuesta del servidor
  } catch (error) {
    console.error('Error en la solicitud:', error);
    throw error;
  }
};