import React, { useState, useEffect } from 'react';
import { IonButton, IonModal, IonContent, IonList, IonItem, IonLabel, IonInput, IonItemDivider, IonHeader, IonAlert, IonTitle, IonCol, IonToolbar, IonLoading, IonIcon, IonPage, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonGrid, IonRow } from '@ionic/react';
import { arrowBack } from 'ionicons/icons';
import './ObjetivosOn.css';
import tailwindcss from 'tailwindcss';

interface Objetivo {
  id_objetivo: number;
  meta_total: number;
  completado: boolean;
  state_objetivo: string;
  fecha_creacion: string;
  id_tipo_objetivo: number;
}

interface ApiResponse {
  objetivo: Objetivo;
}

interface Progreso {
  id: number;
  fecha: string;
  progreso_diario: number;
  progreso_acumulado: number;
  objetivo: number;
}

interface ProgresoResponse {
  progreso: Progreso;
}

export const ObjetivosOn: React.FC = () => {
  const [objetivo, setObjetivo] = useState<Objetivo | null>(null);
  const [progreso, setProgreso] = useState<Progreso | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [animateCards, setAnimateCards] = useState(false);
  const [isFlipped1, setIsFlipped1] = useState(false);
  const [isFlipped2, setIsFlipped2] = useState(false);

    const irAtras = () => {
        window.location.href = '/tab4';
    };
  useEffect(() => {
    const fetchObjetivo = async () => {
      setLoading(true);
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

        const objetivoUrl = `http://127.0.0.1:8000/app/consultar_objetivo/?user_id=${userId}`;
        const progresoUrl = `http://127.0.0.1:8000/app/consultar_progreso_objetivo/?user_id=${userId}`;

        const [objetivoResponse, progresoResponse] = await Promise.all([
          fetch(objetivoUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }),
          fetch(progresoUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }),
        ]);

        if (!objetivoResponse.ok) {
          throw new Error('Error al obtener los objetivos');
        }
        if (!progresoResponse.ok) {
          throw new Error('Error al obtener el progreso del objetivo');
        }

        const objetivoData: ApiResponse = await objetivoResponse.json();
        const progresoData: ProgresoResponse = await progresoResponse.json();

        setObjetivo(objetivoData.objetivo);
        setProgreso(progresoData.progreso);
      } catch (error: any) {
        console.error('Error al obtener los datos:', error);
        setObjetivo(null);
        setProgreso(null);
      } finally {
        setLoading(false);
      }
    };

    fetchObjetivo();
  }, []);

    //Animación de tarjeta
    useEffect(() => {
        const timeout = setTimeout(() => setAnimateCards(true), 200);
        return () => clearTimeout(timeout); 
    }, 
    []);


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


    const getObjetivoNombre= (id_tipo_objetivo: number) => {
    switch (id_tipo_objetivo) {
      case 1:
        return 'Minutas completadas';
      case 2:
        return 'Lista de minutas completadas';
      default:
        return 'Tipo de objetivo desconocido';
    }
    };

  return (
    <IonPage className='page-on'>
       <IonHeader>
        <div className="bba">
          <h1 className="bbb">OBJETIVOS</h1>
          <IonButton fill="clear" onClick={irAtras} className='back-button'>
            <IonIcon icon={arrowBack} slot="icon-only" className='boton_retroceso'/>
          </IonButton>
        </div>
      </IonHeader>
      <IonContent className='ion-padding'>
        {error && <p>{error}</p>}
        {objetivo ? (
            <IonGrid>
            <IonRow>
              <IonCol className={`card_1 ${animateCards ? "slide-in" : ""}`}
               onClick={() => setIsFlipped1(!isFlipped1)}>

                <div className="card-inner">
                  <div className="card-content_1 card-front">
                    <div className="card-top_2">
                        <h3 className="texto-fecha">N° Objetivo</h3>
                        <h3 className="highlighted-text-fecha">{progreso?.objetivo}</h3>
                    </div>
                    <div className="card-top_1">
                      <h3 className='tipo'>Tipo</h3>
                      <h3 className="highlighted-text">{getObjetivoNombre(objetivo.id_tipo_objetivo)}</h3>
                    </div>
                  </div>
                </div>                
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className={`card_2 ${animateCards ? "slide-in" : ""}`}
               onClick={() => setIsFlipped1(!isFlipped1)}>

                <div className="card-inner-2">
                  <div className="card-content_2 card-front-2">
                    <div className="card-top_1">
                      <h3 className="texto-1">Meta</h3>
                      <h3 className="highlighted-meta">{objetivo.meta_total}</h3>
                    </div>
                    <div className="card-top_2">
                      <h3 className='texto-2' >Progreso Acumulado</h3>
                      <h3 className="highlighted-text-2">{progreso?.progreso_acumulado}</h3>
                    </div>
                  </div>
                </div>                
              </IonCol>
            </IonRow>
          </IonGrid>
  
        ) : (   
            <IonCard className="card-objetivos">
                <IonCardHeader>No hay objetivos creados</IonCardHeader>
                <IonCardContent>Debes crear tu primer objetivo</IonCardContent>
            </IonCard>

        )}
        </IonContent>
    </IonPage>
    );
};  


export default ObjetivosOn;