import { save } from "ionicons/icons";

export const fetchObjetivos = async (formData: { tipoObjetivo: string; metaObjetivo: string; }) => {
    try {
    const formData = new FormData();
    const registerResponse = localStorage.getItem('registerResponse');
    if (registerResponse) {
        const parsedResponse = JSON.parse(registerResponse);
        const userId = parsedResponse.id_user;
        const id_tipo_objetivo: number = 0;
        const meta_objetivo: number = 0;
        if (userId && id_tipo_objetivo && meta_objetivo) {
            formData.append('user_id', userId.toString());
            formData.append('id_tipo_objetivo', id_tipo_objetivo.toString());
            formData.append('meta_objetivo', meta_objetivo.toString());
        } else {
            throw new Error('User ID not found in registerResponse');
        }
    } else {
        throw new Error('registerResponse not found in localStorage');
    } 
    
    const response = await fetch('http://127.0.0.1:8000/app/crear_objetivo/', {
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

    // Validar que  `data` contiene `objetivo` y que es un array o un mensaje válido
    if (!data.objetivo) {
        return [{ objetivo: "aun no hay objetivos para ti" }];
    }

    // Si `objetivo` no es un array, devuélvelo envuelto en un array
    return Array.isArray(data.objetivo) ? data.objetivo : [{ objetivo: data.objetivo }];
    
    } catch (error) {
        console.error('Error fetching objetivos:', error);
        return [{ objetivo: "aun no hay objetivos para ti" }];
    }

}

export const saveToLocalStorage = (key: string, data: any) => {
    let existingData = JSON.parse(localStorage.getItem(key) || '[]');
    if (Array.isArray(existingData)) {
        existingData.push(data);
    }
    localStorage.setItem(key, JSON.stringify(existingData));    
};

export const fetchObjetivosOnceday = async () => {
    try {
        const formData = { tipoObjetivo: '', metaObjetivo: '' }; // Provide appropriate values
        const objetivo = await fetchObjetivos(formData);
        const mappedObjetivos = objetivo.map((objetivo: { objetivo: any; }) => objetivo.objetivo); // Define mappedObjetivos here
        const dataEnty = { date: new Date().toISOString(), objetivo: mappedObjetivos };
        saveToLocalStorage('objetivos', dataEnty);
        return objetivo; // Return objetivos here
    } catch (error) {
        console.error('Error fetching objetivos once a day:', error);
        return [];
    }
};
