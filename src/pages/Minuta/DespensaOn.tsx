import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonIcon, IonList, IonGrid, IonAlert, IonRow, IonCol, IonItem, IonLabel, IonSpinner, IonItemSliding, IonItemOptions, IonItemOption, IonModal, IonButton, IonInput, IonSelect, IonSelectOption, IonItemDivider } from '@ionic/react';
import './DespensaOn.css';
import { pencil, trash, checkmarkCircleOutline, add } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

// Interfaz para los alimentos en la dispensa
interface Alimento {
  id_alimento: number;
  name_alimento: string;
  unit_measurement: string;
  load_alimento: string;
  uso_alimento: string;
  status_in_minuta?: boolean;
}

const Despensa: React.FC = () => {
  const [alimentos, setAlimentos] = useState<Alimento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<Alimento>({ id_alimento: 0, name_alimento: '', unit_measurement: '', load_alimento: '', uso_alimento: '' });
  const [selectedAlimento, setSelectedAlimento] = useState<Alimento | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const history = useHistory();

  const handleEdit = (alimento: Alimento) => {
    setSelectedAlimento(alimento);
    setFormData(alimento); // Cargar los datos del alimento en el formulario
    setShowEditModal(true); // Mostrar el modal para editar
  };

  const handleDelete = async (alimentoId: number) => {
    try {
      const user = localStorage.getItem('registerResponse');
      if (!user) {
        throw new Error('No se encontró el objeto de usuario en el localStorage');
      }

      const userObj = JSON.parse(user);
      const userId = userObj.id_user;
      const dispensa = userObj.dispensa; // Asegúrate de que dispensa_id esté en el objeto

      if (!userId || !dispensa) {
        throw new Error('No se encontró el ID de usuario o el ID de la dispensa en el objeto de usuario');
      }

      // Construir la URL con los parámetros requeridos
      const url = `http://127.0.0.1:8000/app/delete_alimento/?user_id=${userId}&dispensa_id=${dispensa}&alimento_id=${alimentoId}`;

      // Hacer la solicitud DELETE
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el alimento');
      }

      console.log('Alimento eliminado');
      // Después de eliminar, redirigir a otra página si es necesario
      history.push('/tab2');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDeleteAllAlimentos = async () => {
    try {
      // Recuperar user_id y dispensa_id del localStorage
      const user = localStorage.getItem('registerResponse');
      if (!user) {
        throw new Error('No se encontró el objeto de usuario en el localStorage');
      }

      const userObj = JSON.parse(user);
      const userId = userObj.id_user;
      const dispensa = userObj.dispensa; // Asegúrate de que dispensa_id esté en el objeto

      if (!userId || !dispensa) {
        throw new Error('No se encontró el ID de usuario o el ID de la dispensa en el objeto de usuario');
      }

      // Construir la URL con user_id y dispensa_id como parámetros
      const url = `http://127.0.0.1:8000/app/delete_all_alimentos/?user_id=${userId}&dispensa_id=${dispensa}`;

      // Hacer la solicitud DELETE
      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Error al eliminar el alimento');
      }

      console.log('Alimento eliminado');
      // Después de eliminar, redirigir a otra página si es necesario

      history.push('/tab2');
      window.location.reload();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Función para verificar si hay alimentos con status_in_minuta = true
  const checkAlimentosConMinuta = () => {
    const alimentosConMinuta = alimentos.filter(alimento => alimento.status_in_minuta === true);

    if (alimentosConMinuta.length > 0) {
      setShowAlert(true); // Mostrar alerta si hay alimentos asociados a una minuta
    } else {
      handleDeleteAllAlimentos(); // Eliminar directamente si no hay alimentos en minuta
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (e: any) => {
    const { value } = e.detail;
    setFormData((prevData) => ({ ...prevData, unit_measurement: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Obtener user_id y dispensa_id de localStorage
      const user = localStorage.getItem('registerResponse');
      console.log("Contenido de localStorage:", user);
      if (!user) {
        console.error('No se encontró el objeto de usuario en el localStorage');
        return;
      }

      const userObj = JSON.parse(user);
      const userId = userObj.id_user;
      const dispensaId = userObj.dispensa; // Asegúrate de que este campo exista en tu objeto

      if (!userId || !dispensaId) {
        console.error('Faltan datos necesarios: userId o dispensaId');
        return;
      }

      // Excluir el campo 'status_in_minuta' de formData
      const { status_in_minuta, ...formDataWithoutStatusInMinuta } = formData;

      // Combinar formData sin 'status_in_minuta' con userId, dispensaId y añadir uso_alimento
      const dataToSubmit = {
        ...formDataWithoutStatusInMinuta,
        id_user: userId,
        dispensa: dispensaId,
        uso_alimento: formData.uso_alimento // Agregar 'uso_alimento'
      };

      console.log('Datos a enviar:', dataToSubmit);
      console.log(JSON.stringify(dataToSubmit, null, 2)); // Muestra el JSON formateado para facilitar la lectura

      const response = await fetch(`http://127.0.0.1:8000/app/edit_alimento/${dataToSubmit.id_alimento}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', // Especificar que se envía JSON
        },
        body: JSON.stringify(dataToSubmit), // Convertir los datos a JSON
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el alimento');
      }

      const updatedAlimento = await response.json();

      // Actualizar la lista de alimentos localmente
      setAlimentos((prevAlimentos) =>
        prevAlimentos.map((alimento) =>
          alimento.id_alimento === updatedAlimento.id_alimento ? updatedAlimento : alimento
        )
      );

      setShowEditModal(false); // Cerrar el modal después de editar
    } catch (error) {
      console.error('Error:', error);
    }
  };


  useEffect(() => {
    const fetchAlimentos = async () => {
      try {
        // Recuperar user_id y dispensa_id del localStorage
        const user = localStorage.getItem('registerResponse');
        if (!user) {
          throw new Error('No se encontró el objeto de usuario en el localStorage');
        }

        const userObj = JSON.parse(user);
        const userId = userObj.id_user;
        const dispensa = userObj.dispensa; // Asegúrate de que dispensa_id esté en el objeto

        if (!userId || !dispensa) {
          throw new Error('No se encontró el ID de usuario o el ID de la dispensa en el objeto de usuario');
        }

        // Construir la URL con user_id y dispensa_id como parámetros
        const url = `http://127.0.0.1:8000/app/dispensa_detail/?user_id=${userId}&dispensa_id=${dispensa}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener los alimentos');
        }
        const data = await response.json();

        // Extraer la lista de alimentos del JSON
        const alimentosExtraidos = data.alimentos.map((item: any) => item.alimento);
        setAlimentos(alimentosExtraidos);
      } catch (error: any) {
        setError(error.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchAlimentos();
  }, []);

  if (loading) {
    return (
      <IonContent>
        <IonSpinner />
      </IonContent>
    );
  }

  if (error) {
    return (
      <IonContent>
        <p>Error: {error}</p>
      </IonContent>
    );
  }

  return (
    <IonPage className='tab-2'>
      <div className='ccc'>
        <h1 className='cca'>DESPENSA</h1>
      </div>

      <div>
        <IonCol>
          <IonButton className='btn_despensaon_1' color="success" shape="round" routerLink="/Tab3">
            <h3><IonIcon icon={add} /></h3>
          </IonButton>
        </IonCol>
        <IonCol>
          <IonButton className="btn_despensaon_2" color="danger" shape="round" onClick={() => checkAlimentosConMinuta()}>
            <h3><IonIcon icon={trash} /></h3>
          </IonButton>
        </IonCol>
      </div>

      {/* Alerta de confirmación */}
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        header={'Confirmar eliminación'}
        message={'Si eliminas todos los alimentos de la despensa y hay alimentos asociados a una minuta activa, tendrás que rehacer la minuta. ¿Deseas continuar?'}
        buttons={[
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => {
              setShowAlert(false);
            }
          },
          {
            text: 'Eliminar',
            handler: () => {
              handleDeleteAllAlimentos();
              setShowAlert(false);
            }
          }
        ]}
      />


      <IonContent>
        <IonList>
          {alimentos.map((alimento) => (
            <IonItemSliding key={alimento.id_alimento}>
              <IonItem>
                <IonLabel>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h2 style={{ marginRight: '8px' }}>{alimento.name_alimento}</h2>
                    {/* Mostrar la imagen solo si status_in_minuta es true, al lado del nombre */}
                    {alimento.status_in_minuta && (
                      <img
                        src="resources\cutting.png"
                        alt="Status"
                        style={{ width: '20px', height: '20px' }} // Ajusta el tamaño aquí
                      />
                    )}
                  </div>
                </IonLabel>

                <IonLabel slot='end'>
                  <p>Cantidad: {alimento.load_alimento} {alimento.unit_measurement}</p>
                </IonLabel>
              </IonItem>
              
              {/* Opciones de deslizar a la izquierda */}
              <IonItemOptions side="start">
                <IonItemOption color="success" onClick={() => handleEdit(alimento)}>
                  <IonIcon slot="start" icon={pencil} />
                  Editar
                </IonItemOption>
              </IonItemOptions>

              {/* Opciones de deslizar a la derecha */}
              <IonItemOptions side="end">
                <IonItemOption color="danger" onClick={() => handleDelete(alimento.id_alimento)}>
                  <IonIcon slot="start" icon={trash} />
                  Eliminar
                </IonItemOption>
              </IonItemOptions>
            </IonItemSliding>
          ))}
        </IonList>
        <br /><br /><br /><br /><br /><br />
      </IonContent>

      {/* Modal para editar alimento */}
      <IonModal isOpen={showEditModal}>
        <div className='form-title'>
          <h1>EDITAR ALIMENTO</h1>
        </div>
        <IonContent className='food-entry-page'>
          <form onSubmit={handleSubmit} className='form-content'>
            {/* Nombre del alimento */}
            <IonItem className='form-item'>
              <IonInput
                label='Nombre del Alimento'
                labelPlacement='floating'
                type="text"
                name="name_alimento"
                value={formData.name_alimento}
                onIonChange={handleInputChange}
                required
              />
            </IonItem>

            {/* Unidad de medida */}
            <IonItem className='form-item'>
              <IonSelect
                name="unit_measurement"
                label='Unidad de Medida'
                labelPlacement='floating'
                value={formData.unit_measurement}
                placeholder="Seleccione una unidad de medida"
                onIonChange={handleSelectChange}
              >
                <IonSelectOption value="kg">kg</IonSelectOption>
                <IonSelectOption value="gr">gr</IonSelectOption>
                <IonSelectOption value="lt">lt</IonSelectOption>
                <IonSelectOption value="ml">ml</IonSelectOption>
              </IonSelect>
            </IonItem>

            {/* Cantidad */}
            <IonItem className='form-item'>
              <IonInput
                label='Cantidad'
                labelPlacement='floating'
                type="number"
                name="load_alimento"
                placeholder='0'
                value={formData.load_alimento}
                onIonChange={handleInputChange}
                required
              />
            </IonItem>

            {/* Botón de envío */}
            <div className='form-button'>
              <IonButton expand="block" shape="round" color="success" type="submit">Guardar Cambios</IonButton>
              <IonButton expand="block" shape="round" color="danger" onClick={() => setShowEditModal(false)}>Cancelar</IonButton>
            </div>
          </form>
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default Despensa;
