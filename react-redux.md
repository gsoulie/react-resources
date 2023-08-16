[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Redux

* [Présentation](#presentation)
* [React context ou Redux ?](#react-context-ou-redux-)
* [Utilisation basique de redux](#utilisation-basique-de-redux)     
* [Utilisation avec React](#utilisation-avec-react)       
* [Bonnes pratiques](#bonnes-pratiques)
* [Redux toolkit](#redux-toolkit)
* [Projet complet redux toolkit basique](https://github.com/gsoulie/react-resources/blob/main/react-redux-toolkit/)
* [Redux toolkit Avancé : traitements asynchrones](#redux-toolkit-avancé--traitements-asynchrones)
* [Redux toolkit avancé projet complet](https://github.com/gsoulie/react-resources/tree/main/projects/advanced-react)     

## Présentation

Dans une application, il existe 3 niveaux de states :

* **local state** : au niveau d'un seul composant => useState, useReducer
* **cross-component state** : affecte plusieurs composants ou par exemple state open/close d'une modale. Induit du prop chains / props drilling
* **app-wide state** : affecte l'ensemble, ou la majorité des composants d'une application. Par exemple le statut d'authentification, navbar etc...Induit du prop chains / props drilling

Les states **cross-component** et **app-wide** peuvent être gérés soit par un context React *useContext* ou par *Redux*

**Redux** est un gestionnaire de state adapté à un environnement cross-component ou app-wide.

[Back to top](#redux)     
## React context ou Redux ?

Mais pourquoi utiliser Redux si nous avons accès nativement au React Context ? 

**React Context présente certains inconvénients**
* mise en place pouvant être complexe dans une grosse application devant gérer plusieurs contextes (authentification, theming, gestion des inputs...)
* peu performant si les données du contexte changent souvent. Mais très bien dans le cas de contextes ne changeant pas souvent (theming, authentification...)

> **Quand utiliser React Context ?** Dans le contexte d'une **petite / moyenne applications**, ne nécessitant pas une modification très fréquente des states.

**Qu'apporte Redux alors ?**

L'avantage principal de Redux est qu'il possède **un seul Data store** (*state*) central. Les composants, s'abonnent (*subscribe*) à ce state global, qui en cas de modification, enverra une notification aux composants abonnés en leur passant une copie du state (slice).

L'autre point **important** est que, **les composants ne manipulent jamais le state directement !** Les modifications se font par le biais de **fonctions reducer** qui sont en charge de la *mutation* des données.
Les composants déclenchent donc des **actions** par l'intermédiaire d'un mécanisme **dispatch**, qui vont être transmises aux *reducer functions*, qui vont à leur tour mettre à jour les données. 

Enfin, le state notifiera les composants de la modification.

Les *reducer functions* prennent en paramètres, l'ancien state, ainsi que l'action dispatchée et retournent l'objet du nouveau state

> **A noter** : Il est tout à fait possible d'utiliser ensemble React Context et Redux

[Back to top](#redux)     

## Utilisation basique de redux
*Installation*
````
npm i redux
````

*index.js*
````typescript
const redux = require('redux');

const initialState = { counter: 0 }

const counterReducer = (state = initialState, action) => {	// Remarque : la valeur initiale est importante, sinon lèvera une erreur lors de la première exécution
	
	if (action.type === 'increment') {
		return {
			counter: state.counter + 1
		}
	}
	if (action.type === 'decrement') {
		return {
			counter: state.counter - 1
		}
	}
	if (action.type === 'custom-increment') {
		return {
			counter: state.counter + action.value
		}
	}
	
	return initialState;
}

const store = redux.createStore(counterReducer);   // Création du store

const counterSubscriber = () => {
	const latestState = store.getState();	// récupère le dernier snapshot du state
	console.log(latestState);
}

store.subscribe(counterSubscriber)	// spécifier la fonction qui sera jouée / notifiée (subscriber) à chaque mise à jour du state

store.dispatch({type: 'increment');
store.dispatch({type: 'custom-increment', value: 5);
````
[Back to top](#redux)     

## Utilisation avec React

*Installation*
````
npm i redux react-redux
````

**1 - Créer le store**

*store/index.tsx*

````typescript
import /*redux,*/ { createStore } from 'redux';

export type StateType = {
  counter: number
}
export enum stateActions {
  increment = 'increment',
  decrement = 'decrement'
}

const initialState: StateType = { counter: 0 };

const counterReducer = (state: StateType = initialState, action: { type: string, value: any }) => {
  if (action.type === stateActions.increment) {
    return {
      counter: state.counter + (action.value || 1)
    }
  }
  if (action.type === stateActions.decrement) {
    return {
      counter: state.counter - 1
    }
  }
  return initialState;
}

export const store = createStore(counterReducer);
````

**2 - Connecter le store à react**

au plus au niveau de l'application, dans le *main.tsx* (ou index.js pour les applications les plus anciennes)

*main.tsx*
````typescript
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from "react-redux";
import { store } from './store/index.ts';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    <App />
  </Provider>
  ,
)
````

**3 - Utilisation et souscription au store avec useSelector**

En fonction des besoins des composants, on peut ensuite demander à redux d'extraire une partie du state avec laquelle on souhaite travailler. Cette opération se fait via ````useSelector````. En faisant cela, redux va créér automatiquement une souscription au store pour ce composant

*Counter.tsx*
````typescript
import { StateType, stateActions } from "../../store";
import { useSelector, useDispatch } from "react-redux";

export const Counter = () => {
  const counter: number = useSelector((state: StateType) => state.counter);	// Sélection de la portion de state qui nous intéresse pour ce composant (créé automatiquement la souscription)
  
  const dispatch = useDispatch();

  const incrementHandler = () => {
    dispatch({ type: stateActions.increment });
  };
  
  const incrementByFiveHandler = () => {
    dispatch({ type: stateActions.increment, value: 5 });
  };

  const decrementHandler = () => {
    dispatch({ type: stateActions.decrement });
  };

  return (
    <main className="counter">
      <h1>Redux Counter</h1>
      <div className="value">{counter}</div>
      <div style={{ marginTop: "20px" }}>
        <button onClick={incrementHandler}>Increment</button>&nbsp;
        <button onClick={decrementHandler}>Decrement</button>
		<button onClick={incrementByFiveHandler}>Increment +5</button>
      </div>
    </main>
  );
};
````
[Back to top](#redux)     

## Bonnes pratiques

Il ne faut **JAMAIS** modifier un state manuellement !! La bonne pratique est de toujours travailler sur une **copie** du state principal est de laisser redux gérer la mutation. 

Le risque est d'introduire des comportements non maîtrisés (desynchronisation du state, effets de bords indésirables...) et de rendre plus compliqué le debuggage en cas de problème.

Le code exemple ci-dessous est à **bannir**

*A NE JAMAIS FAIRE*
````typescript
const counterReducer = (state = initialState, action) => {	
	
	if (action.type === 'increment') {
		state.counter++
		
		return state;
	}	
}
````

*BONNE PRATIQUE*
````typescript
const counterReducer = (state = initialState, action) => {	
	
	if (action.type === 'increment') {
		return {
			counter: state.counter + 1
		}
	}	
}
````

### En résumé

* Ne **JAMAIS** modifier un state manuellement
* créer un *enum* pour définir les mots clés des action dispatch
* créer un *type* ou une *interface* pour décrire la structure du state
* créer un objet pour définir le state initial
* utiliser le *spread operator* ````...state```` pour définir le state à retourner et ne surcharger que les propriétés concernés par la modification de la dispatch action. Cela évite l'oubli de propriétés dans le state de retour (voir ex ci-dessous)

````typescript
if (action.type === 'updateUserAge') {
    return {
        ...state,
        age: action.age
    }
}	
````

[Back to top](#redux)     

## Redux Toolkit

Afin de gérer plus facilement les bonnes pratiques évoquées précédemment, il existe un outil : **Redux Toolkit** permettant de nous faciliter la vie et de simplifier grandement la syntaxe des reducers.

*Installation*
````
npm i @reduxjs/toolkit
````

> <img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> : redux toolkit intègre déjà la librairie redux. Il faut donc penser à désinstaller le package redux du projet s'il était déjà présent

**Exemple de conversion du state avec Redux Toolkit**

(basé sur l'exemple précédent du compteur)

*store/index.tsx*
````typescript
import { createStore } from 'redux';
import { createSlice, configureStore } from '@reduxjs/toolkit'

export type StateType = {
  counter: number
}
const initialState: StateType = { counter: 0 };

const counterSlice = createSlice({
	name: 'counterSlice',
	initialState,
	reducers: {
		increment(state) {
			state.counter++;
		},
		decrement(state) {
			state.counter--;
		}
		incrementByValue(state, action) {
			state.counter = state.counter + action.payload
		}
	}
});

export const counterActions = counterSlice.actions;	// permet d'exposer les actions à l'extérieur

export const store = configureStore({
	reducer: counterSlice.reducer
});
````

> **Remarque** : avec Redux Toolkit, on peut modifier "manuellement" la valeur de l'objet state car en arrière plan, Redux Toolkit créé un clone du state initial sur lequel on travaille réellement

**Utilisation du dispatch**

*Counter.tsx*
````typescript
import { counterActions } from '../../store';

export const Counter = () => {
  const counter: number = useSelector((state: StateType) => state.counter);	// Sélection de la portion de state qui nous intéresse pour ce composant (créé automatiquement la souscription)
  
  const dispatch = useDispatch();

  const incrementHandler = () => {
    dispatch(counterActions.increment());
  };
  
  const incrementByFiveHandler = () => {
    dispatch(counterActions.incrementByValue({value: 5}));
	// Ou
	dispatch(counterActions.incrementByValue(5));
  };

  const decrementHandler = () => {
    dispatch(counterActions.decrement());
  };

  // ...
};
````
[Back to top](#redux)     

### Slices multiples

Dans le cas ou l'on utiliserait plusieurs reducer (1 slice par domaine fonctionnel par exemple) il suffit de procéder comme suit : 

*store/index.ts*
````typescript
const counterSlice = createSlice({
	name: 'counterSlice',
	initialState,
	reducers: {
		increment(state) {
			state.counter++;
		},
		decrement(state) {
			state.counter--;
		}
		incrementByValue(state, action) {
			state.counter = state.counter + action.payload
		}
	}
});

const initialAuthState = { isAuthenticated: false };

const authSlice = createSlice({
	name: 'authentication',
	initialState: initialAuthState,
	reducers: {
		login(state) {
			state.isAuthenticated = true;
		},
		logout(state) {
			state.isAuthenticated = false;
		}
	}
});

// Exporter les actions des différens slices
export const counterActions = counterSlice.actions;
export const authActions = authSlice.actions;

// Configurer le store avec slices multiples
export const store = configureStore({
	reducer: {	// ===> ICI, redux toolkit var merger les différents reducer en un seul reducer unique !!
		counterReducer: counterSlice.reducer,
		authReducer: authSlice.reducer
	}
});
````

L'appel depuis les composants conserve la même logique à la différence qu'il faut maintenant **ne pas oublier de spécifier le reducer à utiliser** 

*Counter.tsx*
````typescript
export const Counter = () => {

  // NE PAS OUBLIER : Modifier ensuite le useSelector en pointant sur le bon reducer !
  const counter = useSelector(state => state.counterReducer.counter);
  const isAuthenticated = useSelector(state => state.authReducer.isAuthenticated);
  
  // ...
};
````
[Back to top](#redux)  

### Slices multiples (bonus)

Pour plus de clareté et dans un soucis de respect du principe de **separation of concern**, on peut découper notre *store* de la manière suivante **sans oublier** de mettre à jours les nouveaux chemins d'import dans les composants :

*store/index.ts*
````typescript
import { configureStore } from '@reduxjs/toolkit'
import counterReducer from './counter-slice';
import authReducer from './auth-slice';

export const store = configureStore({
  reducer: {
    counterReducer: counterReducer,
    authReducer: authReducer
  }
});


````

*store/auth-slice.ts*
````typescript
import { createSlice } from "@reduxjs/toolkit";

const initialState = { isAuthenticated: false };

const authSlice = createSlice({
  name: "authentication",
  initialState,
  reducers: {
    login(state) {
      state.isAuthenticated = true;
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});

export const authActions = authSlice.actions;

export default authSlice.reducer;

````

*store/counter-slice.ts*
````typescript
import { createSlice } from "@reduxjs/toolkit";

export type StateType = {
  counter: number;
  toggle: boolean;
};

const initialState: StateType = { counter: 0, toggle: true };

const counterSlice = createSlice({
  name: "counterSlice",
  initialState,
  reducers: {
    increment(state) {
      state.counter++;
    },
    decrement(state) {
      state.counter--;
    },
    incrementByValue(state, action) {
      state.counter = state.counter + action.payload;
    },
    toggle(state) {
      state.toggle = !state.toggle;
    },
  },
});

export const counterActions = counterSlice.actions;

export default counterSlice.reducer;

````
[Back to top](#redux)  

### Redux toolkit Avancé : traitements asynchrones

Parce que les reducer sont **pure** et **synchrones**, on ne peut pas faire d'appels http à l'intérieur pour mettre à jour ou fetch les data. Il est **INTERDIT** de mettre du code asynchrone à l'intérieur d'un reducer.

Dans le cas de traitement asynchrone, il ne faut PAS utiliser les Reducers, mais préférer la gestion dans le composant (Action Creator)

La **bonne pratique** consiste à créer un *Action Creator* dans le répertoire store par exemple, dont l'objectif est de traiter les effets de bord (fetch, mise à jour de data vers le backend...).
Ce *Action Creator* va réaliser les ````dispatch```` des actions du reducer concerné. 

Les *Action Creator* sont ensuite exécuté depuis le composant, via des ````useEffect````

*Extrait App.tsx*
````
function App() {
  const cartIsVisible = useSelector((state) => state.uiReducer.cartVisible);
  const notification = useSelector((state) => state.uiReducer.notification);
  const cart = useSelector((state) => state.cartReducer);

  const dispatch = useDispatch<AppDispatch>(); // typage nécessaire pour éviter une erreur typescript

  // Effect pour charger les data
  useEffect(() => {
    dispatch(fetchCartData());
  }, [dispatch]);

  // Effect pour mettre à jour les data à chaque modification du store
  useEffect(() => {
    // Empêcher l'appel à firebase lors du premier rendu
    if (initialRender) {
      initialRender = false;
      return;
    }

    // test pour éviter une boucle infinie entre les 2 UseEffect
    if (cart.changed) {
      // Dispatch Action creator
      dispatch(sendCartData(cart));
    }
  }, [cart, dispatch]);

...
}
````

[**> Projet complet Redux toolkit avec traitements asynchrones (backend Firebase)**](https://github.com/gsoulie/react-resources/tree/main/projects/advanced-react)      


