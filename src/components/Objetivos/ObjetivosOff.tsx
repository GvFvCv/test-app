import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonLoading,
  IonButton,
  IonModal,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonToast,
  IonIcon,
} from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import './ObjetivosOff.css';
import { useHistory } from 'react-router-dom';
import ObjetivosOn from './ObjetivosOn';


const MAX_META = 365 * 130; // Definimos el máximo permitido

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
        setLoading(true);
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

    // Validar meta_objetivo
    if (name === 'meta_objetivo') {
      const numericValue = parseInt(value, 10);
      if (isNaN(numericValue) || numericValue < 1 || numericValue > MAX_META) {
        setToastMessage(`La meta debe ser un número entre 1 y ${MAX_META}.`);
        setShowToast(true);
        return;
      }
    }

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const user = localStorage.getItem('registerResponse');
    if (!user) {
      console.error('No se encontró el objeto de usuario en el localStorage');
      return;
    }

    const userObj = JSON.parse(user);

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
        user_id: userObj.id_user,
        id_tipo_objetivo: '',
        meta_objetivo: '',
      });

      setShowModal(false);
      history.push('/objetivos'); // Cambia '/nextRoute' según corresponda
      window.location.reload();
    } catch (error: any) {
      console.error('Error al crear el objetivo:', error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para manejar "volver atrás"
  const handleBack = () => {
    history.push('/Tab4'); // Cambia '/previousRoute' según corresponda
    window.location.reload();
  };

  return (
    <IonPage className="page-on">
      <IonLoading isOpen={loading} message="Cargando objetivos..." duration={1000} />
      <IonContent>
        <div className="dheader">
          <h1 className="dh2">OBJETIVOS</h1>
        </div>
        {!loading && (
          <>
            {objetivos ? (
              <IonCard className="card-objetivos">
                <IonCardHeader>No hay objetivos creados</IonCardHeader>
                <IonCardContent>Debes crear tu primer objetivo</IonCardContent>
              </IonCard>
            ) : (
              <ObjetivosOn />
            )}
            <IonButton 
            className='btnn'
            shape="round"
            color={objetivos ? 'success' : 'primary'} 
            onClick={() => setShowModal(true)}>
              Crear
            </IonButton>
            <IonButton 
              className='btnn'
              shape="round"
              color="danger"
              onClick= {() => { history.push('/Tab4'); window.location.reload(); }}
            >
              Cancelar
            </IonButton>
          </>
        )}
        <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
          <IonContent className="modal2">
            <div className="dheader">
              <h1 className="dh2">NUEVO OBJETIVO</h1>
            </div>
            <form className='form' onSubmit={handleSubmit}>
              <IonItem className='itemm'>
                <IonSelect
                  label="Tipo de Objetivo:"
                  placeholder="Selecciona"
                  style={{ textAlign: 'justify', width: '100%' }}
                  value={formData.id_tipo_objetivo}
                  onIonChange={(e) =>
                    handleInputChange({ target: { name: 'id_tipo_objetivo', value: e.detail.value } })
                  }
                >
                  <IonSelectOption value="1">Minutas completadas</IonSelectOption>
                  <IonSelectOption value="2">Lista de minutas completadas</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem className='itemm'>
              <IonInput
                type="number"
                value={formData.meta_objetivo}
                onIonChange={(e) =>
                  handleInputChange({
                    target: { name: 'meta_objetivo', value: parseFloat(e.detail.value ?? '') || '' },
                  })
                }
                label="Meta:"
                placeholder="Ingresa tu meta en número"
              />
              </IonItem>
              <IonButton className='btnn' shape="round" color="success" type="submit">
                Guardar
              </IonButton>
              <IonButton
                className='btnn'
                shape="round"
                color="danger"
                onClick={() => setShowModal(false)}
              >
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
