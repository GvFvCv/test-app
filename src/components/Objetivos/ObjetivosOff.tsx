import React, { useState, useEffect } from 'react';
import { IonPage, IonContent, IonLoading, IonButton, IonModal, IonItem, IonLabel, IonSelect, IonSelectOption, IonInput, IonCard, IonCardHeader, IonCardContent, IonToast } from '@ionic/react';
import './ObjetivosOff.css';
import { useHistory } from 'react-router-dom';
import ObjetivosOn from './ObjetivosOn';

const ObjetivosOff: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [objetivos, setObjetivos] = useState<string[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    user_id: '',
    id_tipo_objetivo: '',
    meta_objetivo: '',
  });

  const history = useHistory();

  useEffect(() => {
    const fetchObjetivos = async () => {
      try {
        const user = localStorage.getItem('registerResponse');
        if (!user) throw new Error('No se encontró el objeto de usuario en el localStorage');

        const userObj = JSON.parse(user);
        const userId = userObj.id_user;

        if (!userId) throw new Error('No se encontró el ID de usuario');

        const url = `http://127.0.0.1:8000/app/consultar_objetivo/?user_id=${userId}`;
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) throw new Error('Error al obtener los objetivos');
        const data = await response.json();
        setObjetivos(data.objetivos);
      } catch (error) {
        console.error('Error al obtener los objetivos:', error);
        setObjetivos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchObjetivos();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.user_id) {
      console.error('Falta el ID del usuario');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/app/crear_objetivo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setToastMessage(errorData.error || errorData.detail || 'Error al crear el objetivo.');
        setShowToast(true);
        return;
      }

      const data = await response.json();
      console.log('Objetivo creado con éxito:', data);

      setFormData({
        user_id: data.user_id,
        id_tipo_objetivo: '',
        meta_objetivo: '',
      });

      setShowModal(false);
      history.push('/objetivos');
      window.location.reload();
    } catch (error: any) {
      console.error('Error al crear el objetivo:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage className='page-on'>
      <IonLoading isOpen={loading} message="Cargando objetivos..." duration={1000} />
      <IonContent>
        <div className='header-container'>
          <h1 className='header-title'>Objetivos</h1>
        </div>
         {!loading && (
          <>
            {objetivos? (
              <IonCard className="card-objetivos">
                <IonCardHeader>No hay objetivos creados</IonCardHeader>
                <IonCardContent>Debes crear tu primer objetivo</IonCardContent>
              </IonCard>
            ) : (
              <ObjetivosOn />
            )}
            <IonButton className="crear" onClick={() => setShowModal(true)}>
              Crear Objetivo
            </IonButton>
          </>
        )}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonContent className="ion-padding">
            <h1>Crear Nuevo Objetivo</h1>
            <form onSubmit={handleSubmit}>
              <IonItem>
                <h3> Tipo de Objetivo</h3>
                <IonSelect name="id_tipo_objetivo" value={formData.id_tipo_objetivo} onIonChange={handleInputChange}>
                  <IonSelectOption value="1">Minutas completadas</IonSelectOption>
                  <IonSelectOption value="2">Lista de minutas completadas</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem>
                <h3>  Meta del Objetivo</h3>
                <span>Ingresa una cantidad segun el objetivo seleccionado</span>
                <IonInput type="text" name="meta_objetivo" value={formData.meta_objetivo} onIonChange={handleInputChange} />
              </IonItem>
              <IonButton expand="block" shape="round" color="success" type="submit">
                Guardar
              </IonButton>
              <IonButton expand="block" shape="round" color="danger" onClick={() => setShowModal(false)}>
                Cancelar
              </IonButton>
            </form>
          </IonContent>
        </IonModal>

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={3000}
          color="danger"
        />
      </IonContent>
    </IonPage>
  );
};

export default ObjetivosOff;
