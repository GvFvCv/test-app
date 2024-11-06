import React, { useState, useEffect } from 'react';
import { IonButton, IonModal, IonContent, IonHeader, IonTitle, IonToolbar, IonPage } from '@ionic/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './MinutaOn.css';

interface Minuta {
  id_minuta: number;
  type_food: string;
  name_food: string;
  fecha: string;
}

interface Ingrediente {
  nombre: string;
  cantidad: string;
}

interface Receta {
  ingredientes: Ingrediente[];
  paso_a_paso: string[];
}

interface ApiResponse {
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

const MinutaOn: React.FC = () => {
  const [minutas, setMinutas] = useState<Minuta[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [recipesForDay, setRecipesForDay] = useState<Minuta[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Minuta | null>(null);
  const [idListaMinuta, setIdListaMinuta] = useState<number | null>(null);
  const [receta, setReceta] = useState<Receta | null>(null);

  useEffect(() => {
    const fetchMinutas = async () => {
      try {
        // Recuperar user_id 
        const user = localStorage.getItem('registerResponse');
        if (!user) {
          throw new Error('No se encontró el objeto de usuario en el localStorage');
        }

        const userObj = JSON.parse(user);
        const userId = userObj.id_user;

        if (!userId) {
          throw new Error('No se encontró el ID de usuario');
        }

        // Construir la URL con user_id como parámetro
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
        setIdListaMinuta(apiResponse.lista_minuta.id_lista_minuta); // Guardar id_lista_minuta
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

  const onDayClick = (value: Date) => {
    const selectedDate = value.toISOString().split('T')[0];
    setSelectedDay(selectedDate);
    const dayRecipes = minutas.filter(item => item.fecha === selectedDate);
    setRecipesForDay(dayRecipes);
  };

  const handleShowInstructions = async (recipe: Minuta) => {
    setSelectedRecipe(recipe);
    setShowModal(true);

    // Recuperar user_id del localStorage
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

    // Construir la URL para la solicitud POST
    const url = `http://127.0.0.1:8000/app/get_receta/`;

    // Enviar la solicitud POST
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

      // Actualizar el estado con la receta recibida
      setReceta(data.receta);
    } catch (error: any) {
      console.error('Error al enviar la solicitud POST:', error);
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

  return (
    <IonPage className='tab-1'>
      <IonContent>
        <div className="minuta-page">
          <div className='bba'>
            <h1 className='bbb'>MINUTA</h1>
          </div>

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
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay recetas para este día.</p>
            )}
          </div>

          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>{selectedRecipe?.name_food}</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              {selectedRecipe && receta && (
                <div className="instructions-modal">
                  <h2>Instrucciones</h2>
                  <h3>Ingredientes:</h3>
                  <ul>
                    {receta.ingredientes.map((ingrediente, index) => (
                      <li key={index}>{ingrediente.nombre}: {ingrediente.cantidad}</li>
                    ))}
                  </ul>
                  <h3>Paso a Paso:</h3>
                  <ol>
                    {receta.paso_a_paso.map((paso, index) => (
                      <li key={index}>{paso}</li>
                    ))}
                  </ol>
                  <IonButton onClick={() => setShowModal(false)}>Cerrar</IonButton>
                </div>
              )}
            </IonContent>
          </IonModal>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default MinutaOn;
