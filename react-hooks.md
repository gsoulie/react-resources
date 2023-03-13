[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Hooks

* [Librairie complète](#librairie-complète)      
* [Bonnes pratiques](#bonnes-pratiques-hook)     
* [key](#key)     
* [Custom hook](#custom-hook)     
* [useState](#usestate)     
* [useEffect](#useeffect)      
* [useLayoutEffect](#uselayouteffect)      
* [custom hook](#custom-hook)     
* [useRef](#useref)     
* [useContext](#usecontext)     
* [useReducer](#usereducer)     
* [useParams](#useparams)     
* [useLocation](#uselocation)    
* [useNavigate](#useNavigate)     
* [useMemo et useCallback](#usememo-et-usecallback)     
* [useLoaderData](https://github.com/gsoulie/react-resources/blob/main/react-routing.md#useloaderdata)    
* [useRouteError](https://github.com/gsoulie/react-resources/blob/main/react-routing.md#userouteerror)     
* [useQuery et zod](#useQuery)     

## Librairie complète

Librairie de snippet de hook (ex : copy to clipboard) https://www.youtube.com/watch?v=xDJZ99CPRMw&ab_channel=Melvynx     


## Bonnes pratiques hook

### Side effects

mettre à jour un localStorage en fonction d'un state :

*NON FONCTIONNEL*

````typescript
const [count, setCount] = useState(0);

const addToCount = (amount) => {
	setCount((curr) => curr + amount);
	
	localStorage.setItem('count', count);	// => Le localStorage ne sera pas à jour
}
````

*A REMPLACER PAR*

````typescript
const [count, setCount] = useState(0);

const addToCount = (amount) => {
	setCount((curr) => curr + amount);
}

// Synchronisation
useEffect(() => {
	localStorage.setItem('count', count);
}, [count])
````

Utiliser un stockage en local storage en réaction d'un state est un **side effect**, ce qui est précisément le but d'un *useEffect*

### useEffect

Généralement on ne doit pas setter des states dans un useEffect. Si on le fait, c'est qu'il y a un problème !

*MAUVAISE PRATIQUE*

````typescript
const [search, setSearch] = useState('');
const [username, setUsername] = useState('');

useEffect(() => {
	if (!search && !username) {
		setTitle('Nothing...');
		return;
	}
	
	setTitle(`${search} for ${username}`);
}, [search, username])
````

*A REMPLACER PAR*

````typescript
const [search, setSearch] = useState('');
const [username, setUsername] = useState('');
const title = !search && !username ? 'Nothing...' : `${search} for ${username}`;

return(<h2>{title}</h2>);
````

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> ne pas oublier qu'une variable dépendant d'un state sera mise à jour si le state change car ce dernier déclenche un re-render du composant !

## key

source : https://beta.reactjs.org/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes

La propriété ````key```` de React est principalement utilisée dans les boucles afin d'optimiser le repaint des éléments (comme le *trackBy* Angular). Mais la propriété ````key```` permet aussi de pouvoir contrôler les instances des composants.
Chaque fois que React rend vos composants, il appelle vos fonctions pour récupérer les nouveaux éléments React qu'il utilise pour mettre à jour le DOM. Si vous renvoyez les mêmes types d'éléments, il conserve ces composants/noeuds DOM, même si toutes les props ont changés.

La seule exception à cette règle est la clé prop. Cela vous permet de renvoyer exactement le même type d'élément, mais force React à démonter l'instance précédente et à en monter une nouvelle. Cela signifie que tout état qui existait dans le composant à ce moment-là est complètement supprimé et que le composant est "réinitialisé" à toutes fins utiles. Pour les composants fonction, cela signifie que React exécutera le nettoyage des effets, puis il exécutera les initialiseurs d'état et les rappels d'effet.

Pour utiliser la propriété ````key```` il suffit donc de l'ajouter 

````html
<Profile
      userId={userId}
      key={userId}
    />
````
[Back to top](#hooks)      

## Custom hook

Exemple de définition d'un custom hook qui expose 2 fonctions *searchData* et *getDetails*

*useApi.tsx*

````typescript
export const useApi = () => {
	const url = 'https://xxxxxxx';
	
	const searchData = async (title: string): Promise<any> => {
		const result = await fetch(`${url}?title=${encodeURI(title)}`);		
		return result.json();
	}
	
	const getDetails = async (id: string): Promise<DetailsResult> => {
		const result = await fetch(`${url}?id=${id}`)
		return result.json();
	}
	
	return {
		searchData,
		getDetails
	}
}
````

*Utilisation*

````typescript
import useApi from '../hooks/useApi';

const Home = () => {
	const  { searchData } = useApi();
	const [searchTerm, setSearchTerm] = useState('');
	const [result, setResult] = useState([]);
	
	// rafraichir la recherche à chaque fois que le searchTerm change
	useEffect(() => {
		if (searchTerm === '') {
			setResult([]);
			return;
		}
		
		const loadData = async () => {
			const result = await searchData(searchTerm);
			if (result) {
				setResult(result);
			}			
		}
		loadData();
		
	}, [searchTerm])
}
````

## useState

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> bien positionner ses states. Trop souvent on a tendance à positionner les states dans le composant parent alors que ce dernier n'utilise pas forcément le contenu => https://www.youtube.com/watch?v=NZqMVUEiDIw&ab_channel=WebDevSimplified

Il faut garder à l'esprit que toute modification d'un state entraine un repaint du composant, de fait, modifier un state lors d'une saisie n'a pas forcément d'intérêt si visuellement nous n'avons pas de nécessité de rafraichir l'affichage.

[Back to top](#hooks)      

## useEffect

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> Avant de se lancer, il faut bien se questionner sur la nécessité ou non d'utiliser un effect : https://beta.reactjs.org/learn/you-might-not-need-an-effect, on abuse trop souvent du useEffect pour de mauvaises raisons

Le hook useEffect est un hook qui remplace **dans un composant fonctionnel** les évènements ````componentDidMount```` et ````componentWillmount```` que l'on utilise avec les composant de classe. Il va permettre de **déclencher une fonction de manière asynchrone lorsque l'état du composant change**. 
Cela peut permettre d'appliquer des effets de bords ou peut permettre de reproduire la logique que l'on mettait auparavant dans les méthodes 
````componentDidMount```` et ````componentWillUnmount````

useEffect prend en premier paramètre une fonction qui sera exécutée lorsqu'une de ses dépendance change 
(cette fonction est exécutée de manière asynchrone et ne bloquera pas le rendu du composant). 

Le second paramètre permet de définir l'état (state ou props) dont on souhaite observer les mises à jour. C'est un tableau qui permet de définir les dépendances de ce hook (cela permet de n'exécuter la fonction que si un élément a changé pour l'élément observé).

*exemple*

ici, le traitement du useEffect sera déclenché une première fois à l'initialisation puis à chaque modification de la valeur *products* du contexte *ctx*
````tsx
 useEffect(() => {
    // traitement ...
  }, [ctx.products])
````

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> Si aucune dépendance n'est ajoutée en second paramètre, alors la fonction sera exécutée à chaque fois qu'un state du composant sera mis à jour

 **Si un tableau vide** est fourni en second paramètre, cela indique "aucune dépendance" au hook, de ce fait la fonction passée en premier paramètre ne sera exécuté que lors du montage et démontage du composant. Comme un ngOnInit sous Angular

<img src="https://img.shields.io/badge/ATTENTION-DD0031.svg?logo=LOGO"> il est **très** important de noter que l'exécution du *useEffect* intervient aussi à l'initialisation de la valeur du state !!  
 
 *Exemple de composant de classe*
 ````tsx
 class ExampleComponent extends Component {
    logMe() {
        console.log("Je n'ai qu'un paramètre");
    }
    componentDidMount() {
        this.logMe();
    }
    componentDidUpdate() {
        this.logMe();
    }
}
 ````
 
 *Exemple équivalent de composant fonctionnel*
 ````tsx
 import { useEffect } from "react";

function ExampleComponent() {
    useEffect(() => {
        console.log("Je n'ai qu'un paramètre");
    }, []);

    return <>Hello world</>;
}
````

<img src="https://img.shields.io/badge/Bonne%20Pratique-68ADFE.svg?logo=LOGO"> Il est conseillé d'éviter de modifier des state à l'intérieur des *useEffect*. Ils ne sont pas fait pour ça initialement. Il faut leur préférer l'utilisation de fonctions callback. De manière générale, les *useEffect* sont surtout utilisés pour souscrire / se désabonner à des évènements / observables

### unmount 

Chaque useEffect que vous déclarez vous donne accès à un callback permettant d'intervenir sur le démontage du composant. Il s'agit du retour de votre fonction dans le useEffect dans laquelle vous fournissez une fonction de rappel.

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> cette fonction de "nettoyage" va être jouée lors de **chaque** update du useEffect !!!

````tsx
useEffect(() => {
    // Ce que vous voulez
    return () => {
        // Fonction de rappelle qui s'exécute lors du démontage
    };
});
````

Cette fonction de rappelle va s'exécuter lors du démontage du composant. Vous aurez besoin de l'utiliser régulièrement si vous gérez des évènements spécifiques dans le contexte du JavaScript en général. Typiquement, si vous utilisez un setInterval ou des observables dans un composant de fonction, il faudra bien penser à le couper et à vous désabonner!

````tsx
 useEffect(() => {
        const countInterval = setInterval(() => {
            setCount((count) => count + 1);
        }, 1000);

        return () => {
            // Si vous ne le faites pas, vous générez une "fuite de mémoire"
            clearInterval(countInterval);
        };
    }, []);
````

[Back to top](#hooks)      

## useLayoutEffect

Fonctionne comme *useEffect* à la différence qu'il s'exécute **après** le calcul du rendu d'un composant mais **avant** l'affichage du dom à l'écran. Ce qui signifie que React attend la fin du traitement avant de rendre le dom visible pour l'utilisateur

[Back to top](#hooks)      

## custom hook

Lorsqu'un traitement utilisant un ou plusieurs hook est utilisé dans plusieurs composants, il est possible de créer un hook personnalisé qui n'est ni plus ni moins qu'une fonction JS

par exemple :

````tsx
const App = () => {
	const [title, setTitle] = useState('')
	
	useEffect(() => {
		const data = fetchFromDataBase(article.id);
		setTitle(data.displayTitle);
	}, [])
}
````

Peut être réécrit de la manière suivante 

````tsx
const useDisplayTitle = () => {
	const [title, setTitle] = useState('')
	
	useEffect(() => {
		const data = fetchFromDataBase(article.id);
		setTitle(data.displayTitle);
	}, [])
	
	return title ?? 'default value';	// <-- return value
}

const App = () => {
	const title = useDisplayTitle();
}
````

[Back to top](#hooks)      

## useContext

Le Contexte nous permet de récupérer simplement nos datas sans avoir à tout passer manuellement. Pour cela, on englobe le composant parent le plus haut dans l’arborescence de composants avec ce qu’on appelle un *Provider*. Tous les composants enfants pourront alors se connecter au Provider et ainsi accéder aux props, sans avoir à passer par tous les composants intermédiaires. On dit que les composants enfants sont les Consumers 

le Contexte est conçu pour **partager des données qui peuvent être considérées comme globales** :
* des données sur l’utilisateur actuellement authentifié, 
* le thème, 
* la langue utilisée, etc.

Exemple d'utilisation : https://openclassrooms.com/fr/courses/7150606-creez-une-application-react-complete/7256029-partagez-vos-donnees-avec-le-contexte-et-usecontext#:~:text=Le%20Contexte%20est%20une%20fonctionnalit%C3%A9,d'acc%C3%A9der%20au%20State%20partag%C3%A9.  

### En résumé

Le Contexte est une fonctionnalité de React permettant de partager le state entre plusieurs composants parents et enfants, à l'aide d'un Provider.

````useContext````  est un hook permettant de se "brancher" très simplement au Contexte, et donc d'accéder au State partagé.

L'utilisation du Contexte est une des méthodes de State Management, qui peut se cumuler avec d'autres méthodes, telles que l'utilisation de Redux.

> Il est conseillé de créer un fichier séparé pour gérer chaque contexte. Ce fichier doit décrire la forme que va avoir le context (pas les valeurs).


1 - Créer le fichier contexte

````typescript
import { createContext, useMemo, useState } from "react";

export type PlayerType = {
  guid: string,
  name: string,
  color: string,
  score: number
}

const PlayerCtx = createContext<{
  players: PlayerType[];
  updatePlayers: (p: PlayerType[]) => void;
  deletePlayers: () => void;
} | null>(null);

// Avec initialisation
// const PlayerCtx = createContext<{
//   players: PlayerType[];
//   setPlayers: (p: PlayerType[]) => void;
// } | null>({
//   players: [
//     {
//       name: "Guillaume",
//       color: "#ffcc00",
//       score: 150,
//     },
//     {
//       name: "Maël",
//       color: "#aa3355",
//       score: 270,
//     },
//   ],
//   setPlayers: () => {},
// });

// custom provider
const PlayerContextProvider = ({ children }) => {
  const [players, setPlayers] = useState<PlayerType[]>([]);
  
  // Initialisation depuis Firebase par exemple
  useEffect(() => {
    const fetchData = async () => {
      const firebaseData = await fetchFirestoreData(
        "players_table"
      );
      setPlayers(firebaseData);
    };

    fetchData();
  }, []);

  const deletePlayers = () => {
    setPlayers([]);
  };

  const ctxValue = useMemo(
    () => ({
      players,
      updatePlayers: (newPlayers: PlayerType[]) => setPlayers(newPlayers),
      deletePlayers,
      resetPlayersScore,
    }),
    [players, setPlayers]
  );
  // const ctxValue = {
  //   players,
  //   updatePlayers: (newPlayers: PlayerType[]) => setPlayers(newPlayers),
  //   deletePlayers,
  // };

  return <PlayerCtx.Provider value={ctxValue}>{children}</PlayerCtx.Provider>;
};

export { PlayerCtx, PlayerContextProvider };
````
2 - Créer un custom hook 

Permet de vérifier la valeur du contexte avant utilisation

````typescript
import { useContext } from "react";
import { PlayerCtx } from "../context/player-provider";

export const usePlayers = () => {
  const ctx = useContext(PlayerCtx);

  if (!ctx) {
    throw new Error(
      "Le contexte usePlayer doit être utilisé à l'intérieur du provider PlayerContextProvider"
    );
  }
  return ctx;
};

````

3 - Ajout du contexte dans l'application ou sur un composant

````typescript
import { PlayerContextProvider } from "./shared/context/player-provider";

function App() {
  return (
    <PlayerContextProvider>
      <Outlet />
    </PlayerContextProvider>
  );
}
````

4 - Consommation du contexte

````typescript
import { usePlayers } from "../../shared/hooks/player-hook";
import List from "@mui/material/List";

export const ScoreSheet = () => {
  const playersCtx = usePlayers();
  
  const addPlayer = () => {
    let currents = [...playersCtx.players];
    const newPlayer = {guid: '0001d21d', name: 'test', score: 0, color: '#ffcc00'};
    currents.push(newPlayer);
    
    playersCtx.updatePlayers(currents);
  };

  return (
    <>
      <Header />
      <div className="form">
        <List className="ion-list">
          {playersCtx.players.map((player, i: number) => (
            <div key={player.guid}>...</div>
          ))}
        </List>
      </div>
    </>
  );
};
````

### Autre méthode (moins propre)

1 - Créer le fichier contexte

````tsx
import React from 'react';

export default React.createContext({
  theme: '',
  updateTheme: (themeName: string) => {} 
});

// Autre exemple de déclaration
interface userContext {
  players: number,
  updatePlayers: (count: number) => void,
  extensionEnabled: boolean,
  updateExtensionEnabled: (enabled: boolean) => void,
  tiles: string,
  updateTiles: (tiles: string[]) => void
}
export default React.createContext<userContext | null>(null);
````

2 - Importer le contexte dans le composant parent par exemple

````tsx
import ThemeContext from './contexts/themeContext';
````

3 - Positionner le contexte

Le contexte se comporte comme un composant qui englobe les autres. On va donc encadrer les balises de la vue avec le contexte

Il faut ensuite donner une *value* au theme. Cette *value* doit correspondre à la structure que l'on a donné au contexte

````tsx
import ThemeContext from './contexts/themeContext';

function App() {

  const [theme, setTheme] = useState('light-theme');

  const contextValue = {
    theme: theme,
    updateTheme: setTheme
  }
    
  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={theme}>
        <Toolbar />
        <ProductList />
      </div>
    </ThemeContext.Provider>
  )
}
````

Ici nous avons utilisé les valeurs du *useState* mais ça pourrait être d'autres variables / fonctions.

4 - Consommer le contexte avec le hook ````useContext```` dans le composant enfant

````tsx
import ThemeContext from '../../contexts/themeContext';

export default function Toolbar() {

  const ctx = useContext(ThemeContext);

  const handleChangeTheme = (e: any) => {
    ctx.updateTheme(e.currentTarget.value);
  }
  return (
    <div className="toolbar">
	  <label>Select theme : </label>
	  <select className="select" defaultValue={ctx.theme} onChange={handleChangeTheme}>
		<option value="light-theme">Light</option>
		<option value="dark-theme">Dark</option>
	  </select>
	</div>
  )
}
````

[Back to top](#hooks)      

## useReducer

*useReducer* est une alternative à *useState*, de type ````(state, action) => newState```` qui retourne le state courant associé à une fonction *dispatch* (utilise le pattern Redux)

Il faut préférer l'utilisation de *useReducer*  à *useState* lorsqu'on doit gérer une logique de state complexe qui implique plusieurs sous-valeurs ou lorsque le state suivant dépends du state précédent.

*useReducer* permet également d'optimiser les performances des composants qui déclenchent des mises à jour approfondies, car vous pouvez transmettre la répartition au lieu des rappels.

Voici un exemple de compteur géré avec *useReducer*

````tsx
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button> // dispatch l'action 'decrement'
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
````
[Back to top](#hooks)      

## useRef

hook qui permet de faire une référence à un objet de la vue comme ````ViewChild```` en Angular

````tsx
const inputRef = useRef();

const handleSubmit = (e) => {
	e.preventDefault();
	
	const value = inputRef.current.value;
} 

return (
	<form action="submit" onSubmit={handleSubmit}>
		<input ref={inputRef} />
		<button>envoyer</submit>
	</form>
)
````

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> Pour gérer les données dans un formulaire, il n'est **pas recommandé** d'utiliser *useRef()* car ce dernier ne provoque pas de re-render automatique de l'affichage.

[Back to top](#hooks)      

## useParams

*useParams* est un hook de **React Router** (voir chapitre navigation), permettant de récupérer les paramètres d'une route

[Back to top](#hooks)      

## useLocation

*useLocation* est un hook de **React Router** (voir chapitre navigation), permettant de récupérer certaines informations sur la route en cours

[Back to top](#hooks)   

## useNavigate

*useNavigate* est un hook de **React Router** permettant de naviguer via le code JS

````tsx
import { useNavigate } from 'react-router-dom';

function MyCompo() {
    const navigate = useNavigate();
    
    rootToHome() {
      navigate('/home');
    }
    
    navigateToPrevious() {
    	navigate(-1)
    }
}
````

[Back to top](#hooks)   

## useMemo et useCallback

https://www.w3schools.com/react/react_usememo.asp

Ce hook permet de retourner une valeur mémorisé (assimilable à une valeur mise en cache), généralement très utile pour mémoriser des traitements lourds qu'on souhaite éviter de recalculer lors du changement d'un state dans le composant par exemple.

le useMemo ne sera alors rejoué **uniquement** si l'une de ses dépendances est mise à jour 

*Exemple d'utilisation*

````typescript
function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  // ✅ This is fine if getFilteredTodos() is not slow.
  const visibleTodos = getFilteredTodos(todos, filter);
  // ...
}
````

Peut être converti avec *useMemo* de la manière suivante si le traitement ````getFilteredTodos()```` est lent

````typescript
import { useMemo, useState } from 'react';

function TodoList({ todos, filter }) {
  const [newTodo, setNewTodo] = useState('');
  const visibleTodos = useMemo(() => getFilteredTodos(todos, filter), [todos, filter]);
  // ...
}
````

````useCallback```` est similaire à la différence qu'il retourne une **fonction** mémorisée au lieu d'une **valeur** mémorisée

````typescript
const [count, setCount] = useState(0);
const [other, setOther] = useState(0);

//const total = expensiveCalculation(count);	// sera rejoué à chaque modification d'un state du composant même s'il s'agit du state *other*

const total = useMemo(() => expensiveCalculation(count), [count]);	// ne sera rejoué uniquement si le state *count* est modifié

````

[Back to top](#hooks)   

## useQuery

Le hook useQuery est un hook fourni par la bibliothèque React Query qui permet de **faciliter la gestion des requêtes** de données dans une application React.

Plus précisément, useQuery permet de définir une requête de données à partir d'une fonction qui récupère les données à partir d'une source de données (par exemple, une API). Lorsque cette fonction est appelée, **useQuery gère le cycle de vie de la requête** et renvoie un objet contenant plusieurs informations importantes, telles que l'état de la requête, les données récupérées et une fonction permettant de mettre à jour manuellement les données.

useQuery est un **state manager** et garde les données en cache


Il est possible de simplifier le code suivant 

````typescript

const fetchUser = () =>  fetch('https://jsonplaceholder.typicode.com/users').then((res) => res.json());

const Users = () => {
  const [data, setData] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchUsers()
      .then((data) => setData(data))
      .catch((error) => setIsError(true))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error...</p>;
  }

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
};
````

En :

````typescript
const fetchUser = () =>  fetch('https://jsonplaceholder.typicode.com/users').then((res) => res.json());

const Users = () => {
  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error...</p>;
  }

  return (
    <ul>
      {isSuccess && data.map((user) => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
};
````

### Zod

Zod est une **bibliothèque de validation de schémas** pour TypeScript. Elle permet de définir et de valider des schémas de données pour garantir que les données sont conformes à un format spécifique.

En utilisant Zod avec React, vous pouvez définir des schémas de validation pour les données entrantes dans vos composants, afin de garantir que les données respectent un format spécifique. Cela peut aider à prévenir les erreurs et les bugs, en s'assurant que les données sont bien formatées avant d'être traitées par votre application.

En reprenant l'exemple précédent, on pourrait modifier le code de la manière suivante pour être plus *type safe*

````typescript
import { z } from 'zod';

// Créer un UserSchema
const UserSchema = z.array(
  z.object({
    id: z.number(),
    name: z.string(),
  })
);

const fetchUsers = () =>
  fetch('https://jsonplaceholder.typicode.com/users')
    .then((res) => res.json())
    .then((json) => UserSchema.parse(json));

const Users = () => {
  const { data, isLoading, isError } = useQuery({
    queryFn: fetchUsers,
    queryKey: ['users'],
  });
  
  // ...
}
````

[Back to top](#hooks)   
