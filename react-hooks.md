[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Hooks

* [useState](#usestate)     
* [useEffect](#useeffect)      
* [useRef](#useref)     
* [useContext](#usecontext)     
* [useReducer](#usereducer)     
* [useParams](#useparams)     
* [useLocation](#uselocation)    
* [useNavigate](#useNavigate)     

## useState

[Back to top](#hooks)      

## useEffect

Le hook useEffect est un hook qui remplace **dans un composant fonctionnel** les évènements ````componentDidMount```` et ````componentWillmount```` que l'on utilise avec les composant de classe. Il va permettre de déclencher une fonction de manière asynchrone lorsque l'état du composant change. 
Cela peut permettre d'appliquer des effets de bords ou peut permettre de reproduire la logique que l'on mettait auparavant dans les méthodes 
````componentDidMount```` et ````componentWillUnmount````

useEffect prend en premier paramètre une fonction qui sera exécutée lorsqu'une de ses dépendance change 
(cette fonction est exécutée de manière asynchrone et ne bloquera pas le rendu du composant). 

Le second paramètre permet de définir l'état (state ou props) que l'on souhaite observer. C'est un tableau qui permet de définir les dépendances de ce hook (cela permet de ne pas exécuter la fonction que si un élément
 a changé pour ce composant). 
 **Si vous ne mettez aucune dépendance (un tableau vide) dans ce cas là la fonction passée en premier paramètre ne sera exécuté que lors du montage du composant.** Comme un ngOnInit sous Angular

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

### unmount 

Chaque useEffect que vous déclarez vous donne accès à un callback permettant d'intervenir sur le démontage du composant. Il s'agit du retour de votre fonction dans le useEffect dans laquelle vous fournissez une fonction de rappelle.

````tsx
useEffect(() => {
    // Ce que vous voulez
    return () => {
        // Fonction de rappelle qui s'exécute lors du démontage
    };
});
````

Cette fonction de rappelle va s'exécuter lors du démontage du composant. Vous aurez besoin de l'utiliser régulièrement si vous gérez des évènements spécifiques dans le contexte du JavaScript en général. Typiquement, si vous utilisez un setInterval dans un composant de fonction, il faudra bien penser à le couper!

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

[Back to top](#hooks)      

## useReducer

*useReducer* est une alternative à *useState*, de type ````(state, action) => newState```` qui retourne le state courant associé à une fonction *dispatch* (i.e Redux)

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
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
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
}
````

[Back to top](#hooks)   
