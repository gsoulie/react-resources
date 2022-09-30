[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Généralités

* [Ressources](#ressources)     
* [ViteJS](#vitejs)    
* [props](#props)     
* [StrictMode](#strictmode)    
* [Sass](#sass)    
* [Généricité](#généricité)    
* [Tips](#tips)     

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

## Tips

Dans VSCode, utiliser le préfixe ````rfc```` pour déclencher un snippet de création de composant fonctionnel
	
[Back to top](#généralités)    
