[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Généralités

* [Ressources](#ressources)     
* [ViteJS](#vitejs)    
* [Hooks](#hooks)    
* [props](#props)     
* [StrictMode](#strictmode)    
* [Sass](#sass)    
* [Généricité](#généricité)    

## Ressources

Prise en main React en 1h : https://www.youtube.com/watch?v=h2a0cSC1Vz8&ab_channel=ViDev     

## ViteJS

Vitejs : est un outil de génération de frontend (react, preact, vanilla, vue, svelte, javascript, typescript)

````npm create vite@latest ````

Puis suivre les instructions : choix du framework, choix du langage

Ensuite se positionner dans le répertoire du projet et faire 

````
npm i
npm run dev
````

[Back to top](#généralités)      

## Hooks


### useState

[Back to top](#généralités)      

### useEffect

Le hook useEffect est un hook qui remplace **dans un composant fonctionnel** les évènements ````componentDidMount```` et ````componentWillmount```` que l'on utilise avec les composant de classe. Il va permettre de déclencher une fonction de manière asynchrone lorsque l'état du composant change. 
Cela peut permettre d'appliquer des effets de bords ou peut permettre de reproduire la logique que l'on mettait auparavant dans les méthodes 
````componentDidMount```` et ````componentWillUnmount````

useEffect prend en premier paramètre une fonction qui sera exécutée lorsqu'une de ses dépendance change 
(cette fonction est exécutée de manière asynchrone et ne bloquera pas le rendu du composant). 

Le second paramètre permet de définir l'état (state ou props) que l'on souhaite observer. C'est un tableau qui permet de définir les dépendances de ce hook (cela permet de ne pas exécuter la fonction que si un élément
 a changé pour ce composant). 
 Si vous ne mettez aucune dépendance (un tableau vide) dans ce cas là la fonction passée en premier paramètre ne sera exécuté que lors du montage du composant.

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
    });

    return <>Hello world</>;
}
````

#### unmount 

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

[Back to top](#généralités)      

### useRef

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


[Back to top](#généralités)      

## Props

### children

La propriété *children* est un mot clé destiné à une propriété spéciale de react. Cette props peut être assimilée à du slot de transclusion un peu à la manière de *<ng-content>* en angular

Cela permet de passer du contenu complexe en paramètre d'un composant 

*App.tsx*
````tsx
<Hello name='Guillaume'>
	<span style={{ color: 'red' }}>Bonjour Typescript</span>
</Hello>
````

*Hello.tsx*
````tsx
type HelloProps = PropsWithChildren<{
  name: string
}>;
export const Hello = ({name, children}: HelloProps) => {
  return (
    <div>
      <b>{name}</b> : { children }
    </div>
  )
}  
````

boucle for

````
<ul>
	{todos.map((todo, i) => (
		<li key={i}>{ todo }</li>
	))}
</ul>
````
[Back to top](#généralités)      
  
### Passage de props avancé

Par exemple on souhaite créer un composant *<CustomButton>* dont le but est de surcharger le bouton standard html

*CustomButton.tsx*
````tsx
export const CustomButton = ({ children, ...props}) => {
	return (
		<button className="btn" {...props}>
			{ children }
		</button>
	)
};
````

**Analyse** le passage de props avec ````{ children, ...props}```` permet de pouvoir appilquer à notre bouton custom toutes les propriétés ajoutées
depuis le parent ````<CustomButton type="submit">````. Ce qui veut dire que dans ce cas on pourra appliquer à notre bouton custom la propriété ````type=submit```` directement
comme s'il s'agissait d'un vrai élément html ````<button>````

*App.tsx*
````tsx
<CustomButton type="submit">Submit button</CustomButton>
````

[Back to top](#généralités)      

## StrictMode

Par défaut, le mode stric de react est activé dans le fichier *main.tsx*

````tsx
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
````

Ceci a pour effet en mode debug **uniquement** de rendre les composants **2 fois**, ceci dans le but de détecter des anomalies dans le code. Il est donc normal d'observer un doublement des appels lors des *useEffect*.

Pour désactiver le mode strict, il suffit de retirer la balise ````<React.StrictMode>````
  
[Back to top](#généralités)      

## Sass

````npm i sass````

[Back to top](#généralités)      

## Généricité
  
Pour rendre un composant générique au maximum, on met un maximum de paramètres dans les props

*Parent.tsx*
````tsx
<Fruit
	fruitInfo={fruit}
	actionClick={() => handleDelete(fruit.id)} />
	
<Fruit
	fruitInfo={fruit}
	actionClick={() => handleOpenDetail(fruit.id)} />
	
````

*Enfant.tsx*
````tsx
export const Fruit = ({fruitInfo, actionClick) => {
	return(
		<li>
			{fruitInfo } <button onClick={actionClick}>Click me</button>
		</li>
	)
	
}
````

De cette manière, depuis le parent on peut définir n'importe quelle action sur le click sans avoir à modifier le traitement dans le composant enfant.

On pourrait faire de même avec la valeur *fruitInfo* pour gérer autre chose que des fruits
[Back to top](#généralités)      
