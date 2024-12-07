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
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import ObjetivosOn from './ObjetivosOn';
import './ObjetivosOff.css';
import { fetchObjetivos } from '../../services/objetivos/ObjetivosService';

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
    const fetchUserObjetivos = async () => {
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

    fetchUserObjetivos();
  }, []);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;

    // Solo validamos meta_objetivo, el resto se guarda sin problema
    if (name === 'meta_objetivo') {
      const numericValue = parseInt(value, 10);
      if (!isNaN(numericValue) && numericValue >= 1 && numericValue <= MAX_META) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value,
        }));
      } else {
        // Si el valor es inválido, mostramos el toast pero no actualizamos el valor
        setToastMessage(`La meta debe ser un número entre 1 y ${MAX_META}.`);
        setShowToast(true);
      }
    } else {
      // Para otros campos como id_tipo_objetivo
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validamos si los campos necesarios están completos
    if (!formData.meta_objetivo || !formData.id_tipo_objetivo) {
      setToastMessage('Todos los cambios son obligatorios.');
      setShowToast(true);
      return;
    }

    setLoading(true);
    setToastMessage('Obteniendo datos de objetivos');
    setShowToast(true);

    const user = localStorage.getItem('registerResponse');
    if (!user) {
      setToastMessage('Error: Usuario no encontrado en el LocalStorage.');
      setShowToast(true);
      setLoading(false);
      return;
    }

    const userObj = JSON.parse(user);
    const userId = userObj.id_user;

    const payload = {
      ...formData,
      user_id: userId,
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/app/crear_objetivo/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setToastMessage(errorData.error || errorData.detail || 'Error al crear el objetivo.');
        setShowToast(true);
        return;
      }

      // Limpiar los datos del formulario
      setFormData({
        user_id: '',
        id_tipo_objetivo: '',
        meta_objetivo: '',
      });

      setShowModal(false); // Cerrar el modal

      // Esperar unos segundos antes de refrescar los objetivos
      setTimeout(async () => {
        await fetchObjetivos(userId); // Refrescar objetivos
        // Actualizar los objetivos en el estado después de refrescar
        setObjetivos(await fetchObjetivos(userId));
      }, 3000); // Espera 3 segundos

    } catch (error: any) {
      console.error('Error al crear el objetivo:', error.message);
      setToastMessage('Error al enviar el objetivo.');
      setShowToast(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchObjetivos = async (userId: string) => {
    try {
      setLoading(true);
      const url = `http://127.0.0.1:8000/app/consultar_objetivo/?user_id=${userId}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Error al obtener los objetivos');
      const data = await response.json();

      console.log('Objetivos recibidos:', data); // Log para verificar los datos recibidos

      if (data.objetivos && data.objetivos.length > 0) {
        setObjetivos(data.objetivos);
      } else {
        setObjetivos([]);
      }
    } catch (error) {
      console.error('Error al obtener los objetivos:', error);
      setObjetivos([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage className="page-on">
      <IonLoading isOpen={loading} message="Cargando objetivos..." />
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
              className="btnn"
              shape="round"
              color={'success'}
              onClick={() => setShowModal(true)}
            >
              Crear
            </IonButton>
            <IonButton
              className="btnn"
              shape="round"
              color="danger"
              onClick={() => {
                history.push('/Tab4');
                window.location.reload();
              }}
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
            <form className="form" onSubmit={handleSubmit}>
              <IonItem className="itemm">
                <IonSelect
                  label="Tipo de Objetivo:"
                  placeholder="Selecciona"
                  value={formData.id_tipo_objetivo}
                  onIonChange={(e) =>
                    handleInputChange({ target: { name: 'id_tipo_objetivo', value: e.detail.value } })
                  }
                >
                  <IonSelectOption value="1">Minutas completadas</IonSelectOption>
                  <IonSelectOption value="2">Lista de minutas completadas</IonSelectOption>
                </IonSelect>
              </IonItem>
              <IonItem className="itemm">
                <IonInput
                  label="Meta del objetivo:"
                  type="number"
                  value={formData.meta_objetivo}
                  onIonChange={(e) =>
                    handleInputChange({ target: { name: 'meta_objetivo', value: e.detail.value } })
                  }
                />
              </IonItem>
              <IonButton className="btnn" shape="round" color="success" type="submit">
                Guardar
              </IonButton>
              <IonButton
                className="btnn"
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
          message={toastMessage}
          duration={3000}
          onDidDismiss={() => setShowToast(false)}
        />

      </IonContent>
    </IonPage>


  );
};


export default ObjetivosOff;
