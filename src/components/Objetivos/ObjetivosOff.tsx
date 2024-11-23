import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonCard, IonItem, IonLabel, IonInput, IonButton, IonToast, IonLoading } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { fetchObjetivos, fetchObjetivosOnceday } from '../../services/objetivos/ObjetivosService';
import './ObjetivosOff.css';

const ObjetivosOff: React.FC = () => {
  const [formData, setFormData] = useState({ tipoObjetivo: '', metaObjetivo: '' });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const getfetchObjetivosOnceday = async () => {
      try {
        const data = await fetchObjetivos(formData);
        setFormData({
          tipoObjetivo: data.tipoObjetivo || '',
          metaObjetivo: data.metaObjetivo || ''
        });
      } catch (error) {
        console.error('Error fetching register response:', error);
      }
    };

    getfetchObjetivosOnceday();
  }, []);

  const handleInputChange = (e: CustomEvent) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleCancel = () => {
    history.push('/tab4');
    window.location.reload();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetchObjetivos(formData);
      setLoading(false);
      setToastMessage('Objetivo creado con éxito');
      setShowToast(true);
    } catch (error) {
      setLoading(false);
      setToastMessage('Error al crear objetivo');
      setShowToast(true);
    }
  };

  return (
    <IonPage className='obj-off'>
      <div className='obj1'> 
        <h1 className='obj2'>CREAR OBJETIVOS</h1>
      </div>
      <IonContent className='obj-content'>
        <IonCard className='obj-card'>
          <form onSubmit={handleSubmit}>
            <IonItem className="obj-item">
              <IonLabel position="stacked" className="obj-label">Tipo de Objetivo</IonLabel>
              <IonInput
                name="tipoObjetivo"
                value={formData.tipoObjetivo}
                onIonChange={handleInputChange}
                required
                className="obj-input"
              />
            </IonItem>
            <IonItem className="obj-item">
              <IonLabel position="stacked" className="obj-label">Meta de Objetivo</IonLabel>
              <IonInput
                name="metaObjetivo"
                value={formData.metaObjetivo}
                onIonChange={handleInputChange}
                required
                className="obj-input"
              />
            </IonItem>
            <IonButton expand="block" shape="round" color="success" type="submit" className="obj-button">
              Crear Objetivo
            </IonButton>
            <IonButton expand="block" shape="round" color="danger" onClick={handleCancel} className="obj-button">
              Cancelar
            </IonButton>
          </form>
        </IonCard>
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          position="middle"
          className="obj-toast"
        />
        <IonLoading
          isOpen={loading}
          message={'Creando objetivo...'}
          className="obj-loading"
        />
      </IonContent>
    </IonPage>
  );
};

export default ObjetivosOff;
