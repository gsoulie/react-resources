[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Gestion des SVG

## Présentation

En partant du postulat que nous avons un ensemble de svg dans les assets de notre projet, nous souhaiterions pouvoir customiser la couleur de ces svg à la volée dans nos composants.

Afin de faciliter cette customisation, nous pouvons utiliser le plugin **vite-plugin-svgr**

> A utiliser dans le cas d'un projet généré avec Vite

````
npm i vite-plugin-svgr
````

Modifier ensuite le fichier **vite.config.js**

````typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [react(), svgr()],
})
````

Ensuite, si le projet est configuré pour fonctionner avec Typescript, il faut rajouter la configuration suivante dans le fichier **tsconfig.json**

````json
"compilerOptions": 
{
    [...rest...]
    "types": ["vite-plugin-svgr/client"] <--- this line
},
```` 

## Utilisation

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> : Avant toute chose, il faut penser à supprimer toutes les références à une couleur dans les fichiers svg (supprimer toutes les propriétés ````fill="#..."```` et ````stroke="#..."````)

Il est maintenant possible depuis n'importe quel composant, d'importer un svg en tant que composant et de modifier ses propriétés ````fill````, ````stroke```` selon le besoin

*App.tsx*

````typescript
import { ReactComponent as CalendarIcon } from "./assets/icons/calendrier.svg";

export const App = () => {

	return (
		<CalendarIcon stroke="#ffcc00" />
	)
}
````
