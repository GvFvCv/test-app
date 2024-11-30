import React, { useState, useEffect } from 'react';
import { IonButton, IonModal, IonContent, IonList, IonItem, IonLabel, IonInput, IonItemDivider, IonHeader, IonAlert, IonTitle, IonCol, IonToolbar, IonLoading, IonIcon, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardTitle } from '@ionic/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MinutaOn.css';
import { Clock } from 'lucide-react';
import { arrowBack, pencil, add, trash } from 'ionicons/icons';

interface Minuta {  // Definir la interfaz Minuta
  id_minuta: number;
  type_food: string;
  name_food: string;
  fecha: string;
}

interface Ingrediente { //  Definir la interfaz Ingrediente
  nombre: string;
  cantidad: string;
}

interface Receta { // Definir la interfaz Receta
  ingredientes: Ingrediente[];
  paso_a_paso: string[];
}

interface ApiResponse {  // Definir la interfaz ApiResponse
  lista_minuta: {
    id_lista_minuta: number;
    nombre_lista_minuta: string;
    fecha_creacion: string;
    fecha_inicio: string;
    fecha_termino: string;
    state_minuta: string;
  };
  info_minuta: {
    tipo_dieta: string;
    cantidad_personas: number;
  };
  minutas: Minuta[];
}

const MinutaOn: React.FC = () => {  // Definir el componente MinutaOn
  const [minutas, setMinutas] = useState<Minuta[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [recipesForDay, setRecipesForDay] = useState<Minuta[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Minuta | null>(null);
  const [idListaMinuta, setIdListaMinuta] = useState<number | null>(null);
  const [ingredientes, setIngredientes] = useState<Array<{ id_ingrediente: number, nombre: string, tipo_medida: number, cantidad: number }>>([]);
  const [receta, setReceta] = useState<Receta | null>(null);
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [horaActual, setHoraActual] = useState(new Date().getHours());
  const [diaActual, setDiaActual] = useState(new Date().getDate());
  const [visible, setVisible] = useState(true);
  const [loading, setLoading] = useState(false);

  const [mostrarSegundaAlerta, setMostrarSegundaAlerta] = useState(false);
  const [mostrarModal, setMostrarModal] = useState(false);

  const [ingredienteSeleccionado, setIngredienteSeleccionado] = useState(null);
  const [cantidadEditada, setCantidadEditada] = useState('');

  const ShowAlert = (message: string) => {
    alert(message);
  };

  const handleResponse = () => {
    setVisible(false);
  };

  useEffect(() => {
    const fetchMinutas = async () => {
      try {
        const user = localStorage.getItem('registerResponse');
        if (!user) {
          throw new Error('No se encontró el objeto de usuario en el localStorage');
        }

        const userObj = JSON.parse(user);
        const userId = userObj.id_user;

        if (!userId) {
          throw new Error('No se encontró el ID de usuario');
        }

        const url = `http://127.0.0.1:8000/app/minuta_detail/?user_id=${userId}`;

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
        console.log(data);

        const apiResponse: ApiResponse = data;

        setMinutas(apiResponse.minutas);
        setIdListaMinuta(apiResponse.lista_minuta.id_lista_minuta);
        const today = new Date().toISOString().split('T')[0];
        setSelectedDay(today);
        const todayRecipes = apiResponse.minutas.filter(item => item.fecha === today);
        setRecipesForDay(todayRecipes);
      } catch (error: any) {
        console.error('Error al obtener la minuta:', error);
        setMinutas([]);
      }
    };

    fetchMinutas();
  }, []);


  useEffect(() => {
    const intervalId = setInterval(() => {
      const fechaActual = new Date();
      const hora = fechaActual.getHours();
      const dia = fechaActual.getDate();
      setHoraActual(hora);
      setDiaActual(dia);
      if (dia === diaActual && hora >= 0 && hora < 24) {
        setMostrarAlerta(true);
      } else {
        setMostrarAlerta(false);
      }
    }, 1000);
    return () => clearInterval(intervalId);
  }, [diaActual]);

  const onDayClick = (value: Date) => {
    const selectedDate = value.toISOString().split('T')[0];
    setSelectedDay(selectedDate);
    const dayRecipes = minutas.filter(item => item.fecha === selectedDate);
    setRecipesForDay(dayRecipes);
  };

  const handleShowInstructions = async (recipe: Minuta) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
    setLoading(true);

    const user = localStorage.getItem('registerResponse');
    if (!user) {
      console.error('No se encontró el objeto de usuario en el localStorage');
      return;
    }

    const userObj = JSON.parse(user);
    const userId = userObj.id_user;

    if (!userId || !idListaMinuta || !recipe.id_minuta) {
      console.error('Faltan datos para enviar la solicitud POST');
      return;
    }

    const url = `http://127.0.0.1:8000/app/get_receta/`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          id_lista_minuta: idListaMinuta,
          id_alimento: recipe.id_minuta,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al enviar la solicitud POST');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      setReceta(data.receta);
    } catch (error: any) {
      console.error('Error al enviar la solicitud POST:', error);
    } finally {
      setLoading(false);  // Finaliza el loading
    }
  };

  const tileContent = ({ date, view }: { date: Date; view: string }) => {
    if (view === 'month') {
      const formattedDate = date.toISOString().split('T')[0];
      const dayHasRecipes = minutas.some(item => item.fecha === formattedDate);
      if (dayHasRecipes) {
        return <div className="tile-start-of-month">✨</div>;
      }
    }
    return null;
  };

  const handleAlertaResponse = async (realizado: boolean) => {
    try {
        const user = localStorage.getItem('registerResponse');
        if (!user) {
            throw new Error('No se encontró el objeto de usuario en el localStorage');
        }

        const userObj = JSON.parse(user);
        const userId = userObj.id_user;

        const url = 'http://127.0.0.1:8000/app/contol_minuta/';

        const requestData = {
            user_id: userId,
            date: new Date().toISOString().split('T')[0],
            realizado: realizado ? 'true' : 'false',
        };

        console.log('Enviando respuesta de control de minuta:', requestData);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error('Error al enviar la respuesta de control de minuta');
        }

        console.log('Control de minuta enviado correctamente');
        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);

        // Extraer el mensaje y los descuentos del servidor
        const message = responseData.message || "Ingreso de alimentos exitoso"; // Mensaje por defecto si no se encuentra el mensaje
        const descuentos = responseData.descuento || [];

        // Construir el mensaje de alerta con los descuentos
        let alertaMensaje = `${message}\n\nDescuentos:\n`;
        descuentos.forEach(descuento => {
            alertaMensaje += `- ${descuento.name_alimento}: ${descuento.cantidad_descontada} ${descuento.unidad_medida}\n`;
        });

        // Mostrar alerta con el mensaje recibido del backend
        setMostrarAlerta(true);
        setMostrarSegundaAlerta(false); // Cerrar la segunda alerta si está abierta

        // Mostrar la segunda alerta con el mensaje y descuentos
        ShowAlert(alertaMensaje);
        setMostrarSegundaAlerta(true);
    } catch (error) {
        console.error('Error al enviar la respuesta de control de minuta:', error);
    }
};

  const handleDeactivateMinuta = async () => {
    const user = localStorage.getItem('registerResponse');
    if (!user) {
      console.error('No se encontró el objeto de usuario en el localStorage');
      return;
    }

    const userObj = JSON.parse(user);
    const userId = userObj.id_user;

    if (!userId || !idListaMinuta) {
      console.error('Faltan datos para enviar la solicitud PUT');
      return;
    }

    let ListaMinuta_id = idListaMinuta;


    const url = 'http://127.0.0.1:8000/app/desactivate_minuta/';

    // Crear un objeto FormData y agregar los campos necesarios
    const formData = new FormData();
    formData.append('user_id', userId.toString());  // Asegúrate de convertir a string si es necesario
    formData.append('ListaMinuta_id', ListaMinuta_id.toString());

    console.log('Enviando solicitud PUT:', formData);

    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: formData,  // Pasar el FormData como cuerpo de la solicitud
      });

      if (!response.ok) {
        throw new Error('Error al enviar la solicitud PUT');
      }

      const data = await response.json();
      console.log('Respuesta del servidor:', data);

      setReceta(data.receta);

      window.location.reload();
    } catch (error: any) {
      console.error('Error al enviar la solicitud PUT:', error);
    } finally {
      setLoading(false);  // Finaliza el loading
    }
  };



  const fetchMinutas2 = async () => {
    setMostrarModal(true);
    try {
      const user = localStorage.getItem('registerResponse');
      if (!user) {
        throw new Error('No se encontró el objeto de usuario en el localStorage');
      }

      const userObj = JSON.parse(user);
      const userId = userObj.id_user;

      if (!userId) {
        throw new Error('No se encontró el ID de usuario');
      }

      const url = `http://127.0.0.1:8000/app/minuta_detail/?user_id=${userId}`;

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
      console.log(data);

      const apiResponse: ApiResponse = data;

      setMinutas(apiResponse.minutas);
      setIdListaMinuta(apiResponse.lista_minuta.id_lista_minuta);
      setIngredientes(apiResponse.minutas.map(minuta => (
        minuta.ingredientes.map(item => ({
          id_ingrediente: item.id_ingrediente,
          nombre: item.nombre,
          tipo_medida: item.tipo_medida,
          cantidad: item.cantidad
        }))
      )));

      const today = new Date().toISOString().split('T')[0];
      setSelectedDay(today);
      const todayRecipes = apiResponse.minutas.filter(item => item.fecha === today);
      setRecipesForDay(todayRecipes);
    } catch (error: any) {
      console.error('Error al obtener la minuta:', error);
      setMinutas([]);
    }
  };




  const handleEditClick = (idMinuta, ingrediente) => {
    setIngredienteSeleccionado(ingrediente);
    setCantidadEditada(ingrediente.cantidad);  // Cargar la cantidad actual del ingrediente
  };

  const handleCantidadChange = (event) => {
    // Actualizar la cantidadEditada con el valor del input
    setCantidadEditada(event.target.value);
  };

  const guardarCambios = async () => {
    const user = localStorage.getItem('registerResponse');
    if (!user) {
      console.error('No se encontró el objeto de usuario en el localStorage');
      return;
    }
  
    const userObj = JSON.parse(user);
    const userId = userObj.id_user;  // Suponemos que es un número entero
  
    // Verificar que ingredienteSeleccionado y cantidadEditada sean válidos
    if (!userId || !ingredienteSeleccionado || !cantidadEditada) {
      console.error('Faltan datos para enviar la solicitud PUT');
      return;
    }
  
    // Encontrar la minuta asociada al ingrediente seleccionado
    const seleccionadaMinuta = minutas.find(minuta =>
      minuta.ingredientes.some(ingrediente => ingrediente.id_ingrediente === ingredienteSeleccionado.id_ingrediente)
    );
  
    if (!seleccionadaMinuta) {
      console.error('No se encontró la minuta para el ingrediente seleccionado');
      return;
    }
  
    // Verificar que la fecha esté disponible en la minuta
    const fecha = seleccionadaMinuta.fecha;
    if (!fecha) {
      console.error('El campo fecha está ausente en la minuta');
      return;
    }
  
    // Mostrar la fecha y otros valores antes de enviar la solicitud
    console.log('date:', fecha);
  
    // Asegúrate de convertir los valores a los tipos correctos
    const cantidadConvertida = parseInt(cantidadEditada, 10);  // Convertir a Integer
    const userIdConvertido = parseInt(userId, 10);  // Convertir a Integer
    const idIngredienteConvertido = parseInt(ingredienteSeleccionado.id_ingrediente, 10);  // Convertir a Integer
  
    // Verificar si las conversiones fueron exitosas
    if (isNaN(cantidadConvertida) || isNaN(userIdConvertido) || isNaN(idIngredienteConvertido)) {
      console.error('Error: uno o más valores no son números válidos');
      return;
    }
  
    const url = 'http://127.0.0.1:8000/app/edit_productos_minuta_diaria/';
  
    const formData = new FormData();
    formData.append('user_id', userIdConvertido.toString());  // Convertir a String
    formData.append('date', fecha);  // Usar la fecha de la minuta (ya es un string)
    formData.append('id_ingrediente', idIngredienteConvertido.toString());  // Convertir a String
    formData.append('cantidad', cantidadConvertida.toString());  // Convertir a String
  
    // Mostrar el contenido de FormData antes de enviar
    console.log('Contenido de FormData antes de enviar:');
    formData.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });
  
    try {
      const response = await fetch(url, {
        method: 'PUT',
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar la solicitud PUT');
      }
  
      const data = await response.json();
      console.log('Respuesta del servidor:', data);
  
      alert('Cambios guardados con éxito');
      setIngredienteSeleccionado(null);  // Cerrar la tarjeta de edición
      window.location.reload();  // Actualizar la página
    } catch (error) {
      console.error('Error al enviar la solicitud PUT:', error);
      alert('Ocurrió un error al guardar los cambios');
    }
  };
  
  

  return (
    <IonPage className='tab-1'>
      <IonContent>
        <div className="minuta-page">
          <div className='bba'>
            <h1 className='bbb'>MINUTA</h1>
          </div>

          <div>
            <IonCol>
              <IonButton className="btn_despensaon_1" color="success" shape="round" onClick={() => fetchMinutas2()}>
                <h3><IonIcon icon={pencil} /></h3>
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton className="btn_despensaon_2" color="danger" shape="round" onClick={() => handleDeactivateMinuta()}>
                <h3><IonIcon icon={trash} /></h3>
              </IonButton>
            </IonCol>
          </div>
          


          <IonModal isOpen={mostrarModal} onDidDismiss={() => setMostrarModal(false)}>
            <div className="modal-content">
              <div className="bba">
                <h1 className="bbb">AJUSTES DE MEDIDAS</h1>
              </div>
              <br />
              <IonButton onClick={() => setMostrarModal(false)}>Cerrar</IonButton>
              <br /><br />
              <div className="modal-body">
                {minutas.map((minuta) => (
                  <div key={minuta.id_minuta} className="minuta-card">
                    <h2>{minuta.name_food}</h2>
                    <p>Tipo de comida: {minuta.type_food}</p>
                    <p>Fecha: {minuta.fecha}</p>
                    <h3>Ingredientes:</h3>
                    <ul>
                      {minuta.ingredientes.map((ingrediente) => (
                        <li key={ingrediente.id_ingrediente} className="ingrediente-item">
                          <span>
                            {ingrediente.nombre} - {ingrediente.cantidad} {ingrediente.tipo_medida}
                          </span>
                          <IonButton
                            size="small"
                            onClick={() => handleEditClick(minuta.id_minuta, ingrediente)}
                          >
                            Editar
                          </IonButton>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Tarjeta de edición fija */}
                {ingredienteSeleccionado && (
                  <div className="edit-card">
                    <h3>Editar ingrediente</h3>
                    <p>{ingredienteSeleccionado.nombre}</p>
                    <input
                      type="number"
                      value={cantidadEditada}
                      onChange={handleCantidadChange}  // Actualizar cantidadEditada al cambiar el input
                      placeholder="Cantidad"
                    />
                    <IonButton onClick={guardarCambios}>Guardar cambios</IonButton>
                    <IonButton color="light" onClick={() => setIngredienteSeleccionado(null)}>
                      Cancelar
                    </IonButton>
                  </div>
                )}
              </div>
            </div>
          </IonModal>




          <Calendar className="calendar-container"
            onClickDay={onDayClick}
            tileContent={tileContent}
            showNeighboringMonth={false}
            showDoubleView={false}
          />

          <div className="recipes-section-1">
            {selectedDay && <h2>Recetas para {selectedDay}:</h2>}
            {recipesForDay.length > 0 ? (
              <ul>
                {recipesForDay.map((recipe, index) => (
                  <li key={index}>
                    <h3>{recipe.name_food}</h3>
                    <p><strong>Tipo de comida:</strong> {recipe.type_food}</p>
                    <IonButton expand="block" shape="round" color="success" onClick={() => handleShowInstructions(recipe)}>Ver instrucciones</IonButton>
                    <br />
                    {/* Componente de carga */}
                    <IonLoading
                      isOpen={loading}
                      message={'Cargando receta...'}
                    />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay recetas para este día.</p>
            )}
            <div>
              {mostrarAlerta && (
                visible ?
                  <IonCard className="mt-4">
                    <IonCardHeader>
                      <IonCardTitle>Alerta</IonCardTitle>
                    </IonCardHeader>
                    <IonCardContent>
                      <div className="flex items-center">
                        <Clock className="text-gray-600 mr-2" />
                        <p>El día está llegando a su fin, <br />¿Has completado la minuta el día de hoy?</p>
                      </div>
                      <IonButton
                        className="mt-2"
                        color="success"
                        expand="block"
                        shape='round'
                        onClick={() => setMostrarSegundaAlerta(true)} // Al presionar "Sí", mostramos la segunda alerta
                      >
                        Sí
                      </IonButton>
                      <IonButton
                        className="mt-2"
                        color="danger"
                        expand="block"
                        shape='round'
                        onClick={() => { handleAlertaResponse(false); handleResponse(); }}
                      >
                        No
                      </IonButton>
                    </IonCardContent>
                  </IonCard>
                  : null
              )}

              <IonAlert
                isOpen={mostrarSegundaAlerta}
                onDidDismiss={() => setMostrarSegundaAlerta(false)}
                header={'Medidas de la receta'}
                message={'Al aceptar, se descontaran todos aquellos ingredientes de la despensa utilizados en función a la receta. Si utilizo medidas personalizadas, debera editarlas antes.'}
                buttons={[
                  {
                    text: 'Editar medidas',
                    handler: () => {
                      setMostrarModal(true); // Abrir el modal
                    },
                  },
                  {
                    text: 'Aceptar',
                    handler: () => {
                      handleAlertaResponse(true); // Continuar con el flujo normal
                    },
                  },
                ]}
              />
            </div>
          </div>


          <IonModal className='instructions-modal' isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <div className='bba'>
              <h1 className='bbb'>RECETA</h1>
            </div>
            <IonButton className='boton_retroceso_tab1' fill="clear" onClick={() => setShowModal(false)}>
              <IonIcon icon={arrowBack} slot="start" color='success' />
            </IonButton>
            <IonContent className='instrucciones_modal_content'>

              {receta ? (
                <>
                  <IonCard className='card_intrucciones_tab1'>
                    <h3 className='h3_card_intrucciones_tab1'>Ingredientes:</h3>
                    <ul>
                      {receta.ingredientes.map((ingrediente, index) => (
                        <li className='li_card_instrucciones_tab1' key={index}>{ingrediente.nombre}: {ingrediente.cantidad}</li>
                      ))}
                    </ul>
                  </IonCard>
                  <IonCard className='card_intrucciones_tab1'>
                    <h3 className='h3_card_intrucciones_tab1'>Paso a paso:</h3>
                    <ol>
                      {receta.paso_a_paso.map((paso, index) => (
                        <li className='li_card_instrucciones_tab1' key={index}>{paso}</li>
                      ))}
                    </ol>
                  </IonCard>
                </>
              ) : (
                <IonCard>
                  <p>Cargando receta...</p>
                </IonCard>
              )}
            </IonContent>
          </IonModal>
          <br /><br /><br /><br /><br />
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MinutaOn;
