export const fetchObjetivos = async (formData: { tipoObjetivo: string; metaObjetivo: string; }) => {
    try {
    const userId = JSON.parse(localStorage.getItem('registerResponse') || '{}').id_user;
    if (!userId) throw new Error('Usuario no autenticado')
     
    const body = new FormData();
    body.append('user_id', formData.tipoObjetivo);
    body.append('id_tipo_objetivo', formData.tipoObjetivo);
    body.append('meta_objetivo', formData.metaObjetivo);    
    
    const response = await fetch('http://127.0.0.1:8000/app/crear_objetivo/', {
        method: 'POST',
        body,
    });

    if (!response.ok) {
        throw new Error(`Error en la petición: ${response.status}`);
    }
    return await response.json();
    } catch (error) {
        console.error('Error creando objetivos:', error);
        throw error;
    }
};


export const fetchObjetivosOnceday = async () => {
    try {
    const objetivos = JSON.parse(localStorage.getItem('objetivos') || '[]');
    return objetivos.length ? objetivos : [{tipoObjetivos: '', metaObjetivo: ''}];
    } catch (error) {
        console.error('Error obteniendo objetivos:', error);
        return[];    
    }
};