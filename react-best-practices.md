[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Bonnes pratiques


## Performance

Un point important à avoir en tête est que la modification d'un state **entraine un rafraichissement de tout le composant** dans lequel il est déclaré / modifié. Ce qui veut dire que si le composant en question contient d'autres composants enfants qui n'ont aucune relation avec le state modifié, alors ces composants enfants seront eux-aussi rafraichi lors de la modification du state.

Ceci peut causer d'important problème de performance.

La solution à ce problème consiste donc à diviser correctement l'application pour faire en sorte qu'un composant lié à un state ne contienne pas d'autres composants enfants indépendant de ce même state

## Utilisation des fragments

Les *fragments* sont une notation particulière (sucre syntaxique) pour remplacer une *<div>* lorsque cette dernière n'est pas nécessaire.

Dans l'exemple ci-dessous, nous sommes obligé d'encadrer le contenu du code conditionnel avec une ````<div>```` sinon la compilation retournera une erreur car toute expression JSX/TSX doit avoir **un seul** élément parent.

````tsx
<div>
	{ isVisible ? (
		<MyCompo />
	) : (
		<div>	<!-- encadrement avec div obligatoire -->
			<h1>My label</h1>
			<button>Click me</button>
		</div>
	)}
</div>
````

Dans ce cas précis, nous avons ajouté une div **uniquement** pour pallier l'erreur de compilation, à moins que nous souhaitions ajouter du css à cette div, elle est **inutile** pour nous.

C'est donc dans ce cas précis qu'il est préférable d'utiliser les *fragments* ````<>...</>````

````tsx
<div>
	{ isVisible ? (
		<MyCompo />
	) : (
		<>	<!-- encadrement avec fragment -->
			<h1>My label</h1>
			<button>Click me</button>
		</>
	)}
</div>
````

L'utilisation d'un fragment **ne créé pas de noeud supplémentaire dans le DOM** contrairement à une <div>. Il s'agit juste de sucre syntaxique.


### Imports dynamiques

Pour optimiser un peu plus les performances, il est possible de faire de l'import dynamique. Cette méthode permet de n'importer les éléments que lorsqu'on en a réellement besoin

Soit le code suivant qui importe la dépendance (ici un service) *myHelper* de manière classique. Ceci veut dire que la dépendance sera systématiquement importée même si la fonction qui l'utilise n'est jamais appelée.

````typescript
import { myHelper } from '../shared/services/helper.ts';

const Page = () => {
	const hello = async () => {
		return myHelper();
	}
}
````

peut être optimisé de la manière suivante

````typescript
const Page = () => {
	const hello = async () => {
		const { myHelper } = await import '../shared/services/helper.ts';
		return myHelper();
	}
}
````

[Back to top](#bonnes-pratiques)     

## Lazy load component

````tsx
const MyComponent = React.lazy(() => import('./MyComponent'));

export const Page = () => {
	return (
		<>
			<Suspens fallback={<span>Loading...</span>}>
				<MyComponent/>
			</Suspens>
		</>
	)
}
````

Vous noterez également l’ajout d’un composant nommé Suspens qui nous vient de *React.Suspens* et qui fonctionne avec React.lazy. Il est **obligatoire** au bon fonctionnement du lazy-loading et doit toujours être le parent des composants lazy-loadés. Ainsi, Suspens, en plus de nous permettre d’utiliser le lazy-loading, nous permet notamment d’afficher quelque chose en attendant que le composant importé dynamiquement ait finit d’être téléchargé via sa propriété fallback qui peut prendre n’importe quel noeud React ! (Pratique pour afficher des loaders ! :p )

[Back to top](#bonnes-pratiques)     

## notation Curry

Afin de faciliter la répétition d'écriture, il est pratique d'utiliser la notation *Curry*

Remplacer ceci : 

````tsx
const handleItem = (e: any, v: number) => {
	console.log(e, v);
}

<>
	<input onChange={(e) => handleItem(e, 1)} />
	<input onChange={(e) => handleItem(e, 2)} />
	<input onChange={(e) => handleItem(e, 3)} />
</>
````

par :

````tsx
const handleItem = (v: number) => {
	return (e: any) => console.log(e, v);
}

<>
	<input onChange={handleItem(1)} />
	<input onChange={handleItem(2)} />
	<input onChange={handleItem(3)} />
</>
````
[Back to top](#bonnes-pratiques)     

## Hook custom

````tsx
function Component() {
	const [toggle, setToggle] = useState(false);
	
	const on = useCallback(() => setToggle(true), []);
	const off = useCallback(() => setToggle(false), []);
	const toggle = useCallback(() => setToggle(!toggle), [toggle]);
}
````

Peut se réécrire

````tsx
function useToggle() {
	const [state, setState] = useState(false);
	
	const handlers = useMemo(
		() => ({
			on: () => setState(true),
			off: () => setState(false),
			toggle: () => setState(!state),
		}),
		[]
	);
	
	return [state, handlers];
}

const [toggleState, {on, off, toggle}] = useToggle();
````


[Back to top](#bonnes-pratiques)     
