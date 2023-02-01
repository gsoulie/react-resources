[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Généralités

* [Principes](#principes)     
* [Ressources](#ressources)     
* [ViteJS](#vitejs)    
* [props](#props)     
* [StrictMode](#strictmode)    
* [Sass](#sass)    
* [Généricité](#généricité)    
* [Tips](#tips)     
* [Frameworks UI](#frameworks-ui)     
* [Variables d'environnement](#variables-denvironnement)     
* [Déploiement](#déploiement)    
* [Icons](#icons)     
* [Services](#services)     

## Principes

**Hydratation** : Le principe d'hydratation dans le contexte du server-side rendering (SSR) fait référence à la technique permettant de prendre un composant React ou Vue qui a été initialement rendu côté serveur, puis de le "réhydrater" côté client en lui donnant accès à toutes les fonctionnalités de React ou Vue, comme les interactions utilisateur, les événements, etc. Cela permet d'optimiser les performances en affichant le contenu plus rapidement pour l'utilisateur tout en conservant les avantages de l'interactivité offerte par les frameworks JavaScript côté client.

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
	
### Props typées

Il existe plusieurs façon de typer les *props* d'un composant, voici les plus courantes :

#### Méthode interface

Utilisable avec et sans destructuration

````tsx
export interface IProps {
  product: Product,
  user: User
}

export const ProductTile = ({product, user}: IProps) => { return ( <h1>{ product.title }</h1> }

````

#### Méthode PropsWithChildren

````typescript
import React, {PropsWithChildren} from 'react';

export interface Props {
  product: Product;
}

const ProductDetail = (props: PropsWithChildren<Props>) => {...}
````

#### Méthode React.FC

La méthode avec ````React.FC```` utilise ````PropsWithChildren```` de manière transparente

````tsx
export interface Props {
  product: Product
}

export const ProductTile: React.FC<Props> = (props) => {
	return (
		<>
			<h1>{ props.product.title }</h1>
		</>
	)
}
````
[Back to top](#généralités)    
	
### Astuce spread props
	
Astuce pour faciliter le passage d'un grand nombre de props il est possible d'utiliser la notation *spread* props

Afin d'éviter ceci : 

````tsx
const data = {
	id: 23,
	age: 35,
	name: 'Jen',
	bio: 'My name is Jen'
}

<User id={data.id} name={data.name} age={data.age} bio={data.bio}/>
````

préférer l'écriture suivante :

````tsx
const data = {
	id: 23,
	age: 35,
	name: 'Jen',
	bio: 'My name is Jen'
}

<User {...data} />
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
	
### Utiliser un fichier variables.scss

**Créer un fichier variables.scss**

````css
:root {
  --color-primary: #0070f3;
  --color-primary-hover: #097cff;
  --box-shadow: 0 4px 14px 0 rgb(0 118 255 / 39%)
}
````

**Importer le fichier dans le global.scss**
	
````css
@import './variables.scss';
	
.btn {
	background-color: var(--color-primary);	
}
````

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

## Tips

Dans VSCode, utiliser le préfixe ````rfc```` pour déclencher un snippet de création de composant fonctionnel
	
[Back to top](#généralités)    
	
## Frameworks UI

* Material UI : https://mui.com/material-ui/getting-started/installation/
	
````
npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
````
	
* Chakra : https://chakra-ui.com/getting-started     
* Ant design : https://ant.design/docs/react/introduce     
* React bootstrap : https://react-bootstrap.github.io/getting-started/introduction     


[Back to top](#généralités)    
	
## Variables d'environnement

créer un fichier .env à la racine du projet

Pour une utilisation avec *Vite*, déclarer les variables à exposer en les préfixants par *VITE_*. Les variables non préfixées de la sorte ne seront pas accessibles

utiliser les variables n'importe où dans le projet avec la syntaxe :
````
import.meta.env.VITE_MA_VARIABLE
````

[Back to top](#généralités)    
	
## Déploiement
	
````
npm run build
````
	
déployer ensuite sur le serveur web (firebase, netlify, heroku, github pages, etc...)
[Back to top](#généralités)    
	
## icons

https://react-icons.github.io/react-icons/
	
````
import { MdArrowForwardIos } from 'react-icons/md';

return (
	<span>A vos abris<MdArrowForwardIos /></span>
)
````

[Back to top](#généralités)    
	
## Services
	
````typescript
import { SelectedColor, COLORS } from './../enum/colors.enum';
class ColorHelper {
  constructor() { }

  fetchColors = (): SelectedColor[] => {

    const colorSet: SelectedColor[] = COLORS.map((c) => ({
      color: c,
      selected: false,
    }));

    return colorSet;
  }
}
export default new ColorHelper();
	
// Appel
import colorHelper from "../../shared/hooks/color-helper.service";

export const Player = () => {
  const [colors, setColor] = useState<SelectedColor[]>(
    colorHelper.fetchColors()
  );
}
````

[Back to top](#généralités)    
