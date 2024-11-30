import { IonContent, IonHeader, IonPage, IonLabel, IonCard, IonCardContent, IonButton, IonIcon, IonGrid, IonRow, IonCol } from '@ionic/react';
import React, { useState, useEffect } from 'react';
import './Estadisticas.css';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

// Interfaz para los alimentos en la dispensa
interface estadistica {
  total_alimentos_ingresados: number;
  total_desperdicio_alimentos: number;
  total_minutas_creadas: number;
  total_planes_creados: number;
  total_minutas_realizadas: number;
  total_minutas_no_realizadas: number;
  total_planes_realizados: number;
  total_planes_no_realizados: number;
  porcentaje_alimentos_aprovechados: number;
  desperdicio_actual: number | null;
  reduccion_desperdicio: number;
  promedio_duracion_alimentos: number;
  proporcion_planes_completados: number;
}

const Estadisticas: React.FC = () => {
  const [isFlipped1, setIsFlipped1] = useState(false);
  const [isFlipped2, setIsFlipped2] = useState(false);
  const [isFlipped3, setIsFlipped3] = useState(false);
  const [isFlipped4, setIsFlipped4] = useState(false);
  const [isFlipped5, setIsFlipped5] = useState(false);
  const [isFlipped6, setIsFlipped6] = useState(false);
  const [isFlipped7, setIsFlipped7] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [estadisticas, setEstadisticas] = useState<estadistica | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const history = useHistory();

  const irAEstadisticas = () => {
    history.push('/Tab4');
  };

  useEffect(() => {
    const fetchAlimentos = async () => {
      try {
        const user = localStorage.getItem('registerResponse');
        if (!user) {
          throw new Error('No se encontró el objeto de usuario en el localStorage');
        }

        const userObj = JSON.parse(user);
        const userId = userObj.id_user;

        if (!userId) {
          throw new Error('No se encontró el ID de usuario en el objeto de usuario');
        }

        const url = `http://127.0.0.1:8000/app/estadisticas/?user_id=${userId}`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Error al obtener las estadísticas');
        }

        const data = await response.json();
        setEstadisticas(data.estadisticas);

      } catch (error: any) {
        setError(error.message || 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchAlimentos();
  }, []);


  // ANIMACION DE LAS TARJETAS

  useEffect(() => {
    // Retrasa la animación para asegurarse de que el DOM esté listo
    const timeout = setTimeout(() => setAnimateCards(true), 200);
    return () => clearTimeout(timeout);
  }, []);


  // Función para determinar el color de fondo de las tarjetas
  const getCardColor = (value: number | null, type: 'percentage' | 'desperdicio' | 'default'): string => {
    if (value === null) return 'gray'; // Si el valor es null, no mostrar color
    let color = '';

    switch (type) {
      case 'percentage':
        color = value >= 75 ? 'green' : value >= 50 ? 'yellow' : 'red';
        break;
      case 'desperdicio':
        color = value <= 10 ? 'green' : value <= 25 ? 'yellow' : 'red';
        break;
      case 'default':
      default:
        color = value >= 50 ? 'green' : value >= 20 ? 'yellow' : 'red';
        break;
    }

    return color;
  };




  // FUNCION PARA OBTENER EL TEXTO DE LA TARJETA DE ATRAS

  // TARJETA 1

  const getCardBackText1 = (totalPlanes: number, realizados: number, noRealizados: number) => {
    if (totalPlanes === 0) {
      return "Aún no has creado ningún plan. ¡Empieza ahora y organiza tus objetivos!";
    } else if (realizados === totalPlanes) {
      return `¡Impresionante! Has completado todos tus planes (${realizados} de ${totalPlanes}). ¡Sigue así!`;
    } else if (realizados > noRealizados) {
      return `Buen trabajo. Has completado más de la mitad de tus planes (${realizados} de ${totalPlanes}). ¡Sigue esforzándote!`;
    } else if (realizados === 0) {
      return `Todavía no has completado ningún plan de los ${totalPlanes} que has creado. ¡Es momento de empezar!`;
    } else {
      return `Has creado ${totalPlanes} planes, pero aún queda trabajo por hacer. Completados: ${realizados}, no realizados: ${noRealizados}.`;
    }
  };


  // TARJETA 2

  const getCardBackText2 = (proporcion: number) => {
    if (proporcion >= 80) {
      return "¡Excelente trabajo! Tu porcentaje indica un gran compromiso con tus planes. ¡Sigue así!";
    } else if (proporcion >= 50) {
      return "Vas por buen camino. Has completado más de la mitad de tus planes. ¡No te detengas!";
    } else if (proporcion > 0) {
      return "Puedes mejorar. Comienza a completar más planes para aumentar este porcentaje.";
    } else {
      return "Aún no has completado planes. ¡Es momento de empezar!";
    }
  };


  // TARJETA 3

  const getCardBackText3 = (totalAlimentos: number, porcentajeAprovechado: number) => {
    if (totalAlimentos === 0) {
      return "¡Ups! Aún no has ingresado alimentos. Comienza a registrar tus alimentos para llevar un mejor control.";
    } else if (porcentajeAprovechado >= 80) {
      return `¡Increíble! Has ingresado ${totalAlimentos} alimentos y aprovechado un impresionante ${porcentajeAprovechado.toFixed(2)}% de ellos. ¡Estás ahorrando y reduciendo desperdicios!`;
    } else if (porcentajeAprovechado >= 50) {
      return `¡Buen trabajo! Has ingresado ${totalAlimentos} alimentos y aprovechado ${porcentajeAprovechado.toFixed(2)}%. Sigue mejorando para reducir aún más el desperdicio.`;
    } else {
      return `Has ingresado ${totalAlimentos} alimentos, pero solo has aprovechado el ${porcentajeAprovechado.toFixed(2)}%. Considera organizar mejor tus compras para maximizar el uso de tus recursos.`;
    }
  };


  // TARJETA 4

  const getCardBackText4 = (reduccion: number) => {
    if (reduccion >= 80) {
      return "¡Impresionante! Has logrado reducir el desperdicio en un 80% o más. Esto no solo ayuda a tu bolsillo, sino también al planeta. ¡Continúa así!";
    } else if (reduccion >= 50) {
      return "¡Buen progreso! Has reducido el desperdicio en más del 50%. Mantén el esfuerzo para lograr una mayor eficiencia.";
    } else if (reduccion > 0) {
      return "Estás comenzando a reducir el desperdicio. Cada pequeño paso cuenta para un impacto más grande. ¡Sigue adelante!";
    } else {
      return "Aún no has logrado reducir el desperdicio. ¡Es momento de revisar tus hábitos y hacer un cambio positivo!";
    }
  };


  // TARJETA 5

  const getCardBackText5 = (total: number, realizadas: number, noRealizadas: number) => {
    const porcentajeRealizadas = total > 0 ? (realizadas / total) * 100 : 0;

    if (porcentajeRealizadas >= 80) {
      return `¡Excelente! Has realizado ${realizadas} de las ${total} minutas que creaste, lo que equivale a un ${porcentajeRealizadas.toFixed(1)}%. ¡Sigue manteniendo este ritmo!`;
    } else if (porcentajeRealizadas >= 50) {
      return `Buen trabajo. Has completado ${realizadas} de las ${total} minutas (${porcentajeRealizadas.toFixed(1)}%). Puedes mejorar un poco más para aprovechar al máximo tus planes.`;
    } else if (porcentajeRealizadas > 0) {
      return `Has realizado ${realizadas} de las ${total} minutas (${porcentajeRealizadas.toFixed(1)}%). Intenta enfocarte en cumplir más de tus minutas para aprovechar mejor tu tiempo y recursos.`;
    } else {
      return `Aún no has completado ninguna de tus minutas creadas (${total}). ¡Es un buen momento para comenzar!`;
    }
  };


  // TARJETA 6

  const getCardBackText6 = (totalDesperdicio: number) => {
    if (totalDesperdicio === 0) {
      return "¡Perfecto! No tienes desperdicios registrados.";
    } else if (totalDesperdicio < 5) {
      return `Muy bien, solo ${totalDesperdicio} desperdicio(s) hasta ahora.`;
    } else {
      return `Lleva cuidado: ${totalDesperdicio} desperdicio(s) acumulados.`;
    }
  };


  // TARJETA 7

  const getCardBackText7 = (desperdicioActual: number) => {
    if (desperdicioActual === 0) {
      return "¡Genial! Sin desperdicio reciente.";
    } else if (desperdicioActual < 2) {
      return `Solo ${desperdicioActual} desperdicio(s) actual.`;
    } else {
      return `Atención: ${desperdicioActual} desperdicio(s) reciente(s).`;
    }
  };



  return (
    <IonPage className="tab-4 ion-page" >
      <IonHeader>
        <div className="bba">
          <h1 className="bbb">ESTADISTICAS</h1>
          <IonButton fill="clear" onClick={irAEstadisticas} className='back-button'>
            <IonIcon icon={arrowBack} slot="icon-only" className='boton_retroceso'/>
          </IonButton>
        </div>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading && <p>Cargando...</p>}
        {error && <p>{error}</p>}
        {estadisticas ? (
          <IonGrid>
            {/* Primera Seccion */}
            {/* Tarjeta 1 */}
            <IonRow>
              <IonCol className={`card_1 ${animateCards ? "slide-in" : ""} ${isFlipped1 ? "flipped" : ""}`} onClick={() => setIsFlipped1(!isFlipped1)}>
                <div className="card-inner">
                  {/* Frente de la tarjeta */}
                  <div className="card-content_1 card-front">
                    <div className="card-top_1">
                      <IonLabel className="labelEstadisticas_1_1">Planes Creados </IonLabel>
                      <IonLabel className="labelEstadisticas_1_2">{estadisticas.total_planes_creados || 0}</IonLabel>
                    </div>
                    <div className="card-bottom_1">
                      <IonLabel className="labelEstadisticas_1_3">Realizados: <span className='Good'>{estadisticas.total_planes_realizados || 0}</span></IonLabel>
                      <IonLabel className="labelEstadisticas_1_3">No Realizados: <span className='Bad'>{estadisticas.total_planes_no_realizados || 0}</span></IonLabel>
                    </div>
                  </div>
                  {/* Reverso de la tarjeta */}
                  <div className="card-content_1 card-back">
                    <p className="card-back-info_1">Sobre los planes:</p>
                    <p className="card-back-info_2">{getCardBackText1(estadisticas.total_planes_creados || 0, estadisticas.total_planes_realizados || 0, estadisticas.total_planes_no_realizados || 0)}</p>
                  </div>
                </div>
              </IonCol>
            </IonRow>

            {/* Segunda Seccion */}
            {/* Tarjeta 2 */}
            <IonRow>
              <IonCol className={`card_1 ${animateCards ? "slide-in" : ""} ${isFlipped2 ? "flipped" : ""}`} onClick={() => setIsFlipped2(!isFlipped2)}>
                <div className="card-inner">
                  {/* Frente de la tarjeta */}
                  <div className="card-content_1 card-front">
                    <div className="card-top_1">
                      <IonLabel className="labelEstadisticas_2_1">Porcentaje de planes completados:</IonLabel>
                    </div>
                    <div className="card-bottom_1">
                      <p className="labelEstadisticas_2_2">{(estadisticas.proporcion_planes_completados || 0).toFixed(1)} %</p>
                    </div>
                  </div>
                  {/* Reverso de la tarjeta */}
                  <div className="card-content_1 card-back">
                    <p className="card-back-info_1">Sobre el porcentaje:</p>
                    <p className="card-back-info_2">{getCardBackText2(estadisticas.proporcion_planes_completados || 0)}</p>
                  </div>
                </div>
              </IonCol>
            </IonRow>

            {/* Tercera Seccion */}
            {/* Tarjeta 3 */}
            <IonRow>
              <IonCol className={`card_1 ${animateCards ? "slide-in" : ""} ${isFlipped3 ? "flipped" : ""}`} onClick={() => setIsFlipped3(!isFlipped3)}>
                <div className="card-inner">
                  {/* Frente de la tarjeta */}
                  <div className="card-content_1 card-front">
                    <div className="card-top_1">
                      <IonLabel className="labelEstadisticas_3_2">{estadisticas?.total_alimentos_ingresados}</IonLabel>
                      <IonLabel className="labelEstadisticas_3_1">Alimentos Ingresados</IonLabel>
                    </div>
                    <div className="card-bottom_1">
                      <IonLabel className="labelEstadisticas_3_3">% Aprovechado:{" "}<span className="Good">{estadisticas?.porcentaje_alimentos_aprovechados?.toFixed(2) || 0}</span> %</IonLabel>
                      <IonLabel className="labelEstadisticas_3_3">Promedio Duración:{" "}<span className="Good">{estadisticas?.promedio_duracion_alimentos?.toFixed(1) || 0}</span> días</IonLabel>
                    </div>
                  </div>
                  {/* Reverso de la tarjeta */}
                  <div className="card-content_1 card-back">
                    <p className="card-back-info_1">Sobre los Alimentos:</p>
                    <p className="card-back-info_2">{getCardBackText3(estadisticas?.total_alimentos_ingresados || 0, estadisticas?.porcentaje_alimentos_aprovechados || 0)}</p>
                  </div>
                </div>
              </IonCol>
            </IonRow>

            <IonRow>
              {/* Tarjeta 4 */}
              <IonCol className={`card_1 ${animateCards ? "slide-in" : ""} ${isFlipped6 ? "flipped" : ""}`} onClick={() => setIsFlipped6(!isFlipped6)}>
                <div className="card-inner">
                  {/* Frente de la tarjeta */}
                  <div className="card-content_1 card-front">
                    <div className="card-top_1">
                      <IonLabel className="labelEstadisticas_6_1">Alimentos desperdiciados:</IonLabel>
                    </div>
                    <div className="card-bottom_1">
                      <p className="labelEstadisticas_6_2">{estadisticas.total_desperdicio_alimentos || 0}</p>
                    </div>
                  </div>
                  {/* Reverso de la tarjeta */}
                  <div className="card-content_1 card-back">
                    <p className="card-back-info_1">{getCardBackText6(estadisticas?.total_desperdicio_alimentos || 0)}</p>
                  </div>
                </div>
              </IonCol>

              {/* Tarjeta 5 */}
              <IonCol className={`card_1 ${animateCards ? "slide-in" : ""} ${isFlipped7 ? "flipped" : ""}`} onClick={() => setIsFlipped7(!isFlipped7)}>
                <div className="card-inner" >
                  {/* Frente de la tarjeta */}
                  <div className="card-content_1 card-front">
                    <div className="card-top_1">
                      <IonLabel className="labelEstadisticas_6_1">Deperdicio actual:</IonLabel>
                    </div>
                    <div className="card-bottom_1">
                      <p className="labelEstadisticas_6_2">{(estadisticas.desperdicio_actual || 0).toFixed(0)}%</p>
                    </div>
                  </div>
                  {/* Reverso de la tarjeta */}
                  <div className="card-content_1 card-back">
                    <p className="card-back-info_1">{getCardBackText7(estadisticas?.desperdicio_actual || 0)}</p>
                  </div>
                </div>
              </IonCol>
            </IonRow>

            {/* Tarjeta 6 */}
            <IonRow>
              <IonCol className={`card_1 ${animateCards ? "slide-in" : ""} ${isFlipped4 ? "flipped" : ""}`} onClick={() => setIsFlipped4(!isFlipped4)}>
                <div className="card-inner">
                  {/* Frente de la tarjeta */}
                  <div className="card-content_1 card-front">
                    <div className="card-top_1">
                      <IonLabel className="labelEstadisticas_4_1">Reducción Desperdicios:</IonLabel>
                    </div>
                    <div className="card-bottom_1">
                      <p className="labelEstadisticas_4_2">{(estadisticas.reduccion_desperdicio || 0).toFixed(2)} %</p>
                    </div>
                  </div>
                  {/* Reverso de la tarjeta */}
                  <div className="card-content_1 card-back">
                    <p className="card-back-info_1">Sobre reducción de desperdicios:</p>
                    <p className="card-back-info_2">{getCardBackText4(estadisticas?.reduccion_desperdicio || 0)}</p>
                  </div>
                </div>
              </IonCol>
            </IonRow>

            {/* Cuarta Seccion */}
            {/* Tarjeta 7 */}
            <IonRow>
              <IonCol className={`card_1 ${animateCards ? "slide-in" : ""} ${isFlipped5 ? "flipped" : ""}`} onClick={() => setIsFlipped5(!isFlipped5)}>
                <div className="card-inner">
                  {/* Frente de la tarjeta */}
                  <div className="card-content_1 card-front">
                    <div className="card-top_1">
                      <IonLabel className="labelEstadisticas_5_1">Minutas Creadas <span className='Good_2'>{estadisticas.total_minutas_creadas || 0}</span></IonLabel>
                    </div>
                    <div className="card-bottom_1">
                      <IonLabel className="labelEstadisticas_5_2">Realizadas: <span className='Good'>{estadisticas.total_minutas_realizadas || 0}</span></IonLabel>
                      <IonLabel className="labelEstadisticas_5_2">No Realizadas: <span className='Bad'>{estadisticas.total_minutas_no_realizadas || 0}</span></IonLabel>
                    </div>
                  </div>
                  {/* Reverso de la tarjeta */}
                  <div className="card-content_1 card-back">
                    <p className="card-back-info_1">Sobre reducción de desperdicios:</p>
                    <p className="card-back-info_2">{getCardBackText5(estadisticas?.total_minutas_creadas || 0, estadisticas?.total_minutas_realizadas || 0, estadisticas?.total_minutas_no_realizadas || 0)}</p>
                  </div>
                </div>
              </IonCol>
            </IonRow>

          </IonGrid>
        ) : null}
        <br /><br />
      </IonContent>
    </IonPage>
  );
};

export default Estadisticas;
