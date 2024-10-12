import React, { useState } from 'react';

function ImageToPDFConverter() {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const convertImageToPDF = async () => {
        const url = 'https://api.example.com/convert-image-to-pdf';

        // Crear un objeto FormData para enviar la imagen
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const blob = await response.blob();
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = 'converted.pdf';
                document.body.appendChild(a);
                a.click();
                a.remove();
            } else {
                console.error('Error en la conversión:', response.statusText);
            }
        } catch (error) {
            console.error('Error en la petición:', error);
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={convertImageToPDF} disabled={!file}>
                Convertir a PDF
            </button>
        </div>
    );
}

export default ImageToPDFConverter;
