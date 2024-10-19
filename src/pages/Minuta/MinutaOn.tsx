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

  useEffect(() => {
    // Simulación de la llamada a la API
    const fetchMinutas = async () => {
      try {
        // Recuperar user_id 
        const user = localStorage.getItem('registerResponse');
        if (!user) {
          throw new Error('No se encontró el objeto de usuario en el localStorage');
        }

        const userObj = JSON.parse(user);
        const userId = userObj.id_user;
        

        if (!userId ) {
          throw new Error('No se encontró el ID de usuario');
        }

        // Construir la URL con user_id y dispensa_id como parámetros
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

  const handleShowInstructions = (recipe: Minuta) => {
    setSelectedRecipe(recipe);
    setShowModal(true);
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
    <IonPage>
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
              {selectedRecipe && (
                <div className="instructions-modal">
                  <h2>Instrucciones</h2>
                  <p>{selectedRecipe.name_food}</p>
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
