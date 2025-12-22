[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# SVG

## Installation et configuration

Afin de pouvoir utiliser et customiser des SVG dynamiquement, une des solutions consiste à utiliser le plugin **@svgr/webpack**

````npm i @svgr/webpack````

Modifier ensuite le fichier **next.config.js** comme suit :

````typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      use: [{ loader: "@svgr/webpack", options: { icon: true } }],
    });
    return config;
  },
};

module.exports = nextConfig;
````

## Préparation

Une étape primordiale consiste à retirer tous les attributs contenant des couleurs dans le fichier svg (retirer tous les fill=#546544 stroke=#236564 ...)

Placer ensuite les images dans le répertoire ````/assets```` à la racine du projet plutôt que dans ````/public```` si l'on ne souhaite pas exposer les images publiquement (c'est à dire accessibles directement via l'url)

## Utilisation

````typescript
import ProductIcon from "@/assets/icons/produit.svg";

<ProductIcon stroke="#ffffff" strokeWidth="2" height="36px" width="36px" />
````

# Customiser un svg avec tailwind

Pour pouvoir customiser le style d'un svg lors de son survol, si ce dernier est intégré  dans un composant enfant,
il faut utiliser la propriété ````group```` de tailwindcss.

**Étapes à suivre** : 
1. retirer toutes les propriétés ````color, stroke, fill```` du svg
2. appliquer le style par défaut du svg, ainsi que le group-hover

Voici un exemple :

*layout.tsx*
````typescript
<MenuItem>
  <svg
	width="24px"
	height="24px"
	strokeWidth="1.5"
	viewBox="0 0 24 24"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	className="stroke-white group-hover:stroke-black transition-colors duration-300"	// <-- style par défaut et hover
  >
	<path
	  d="M17 21H7C4.79086 21 3 19.2091 3 17V10.7076C3 9.30887 3.73061 8.01175 4.92679 7.28679L9.92679 4.25649C11.2011 3.48421 12.7989 3.48421 14.0732 4.25649L19.0732 7.28679C20.2694 8.01175 21 9.30887 21 10.7076V17C21 19.2091 19.2091 21 17 21Z"
	  strokeWidth="1.5"
	  strokeLinecap="round"
	  strokeLinejoin="round"
	></path>
	<path
	  d="M9 17H15"
	  strokeWidth="1.5"
	  strokeLinecap="round"
	  strokeLinejoin="round"
	></path>
  </svg>
</MenuItem>
````

3. dans le composant enfant, ajouter l'attribut tailwind ````group````

*menu-item.tsx*
````typescript
export const MenuItem = (props) => {
  return (
    <li className="flex flex-col">
      <Link
        href={props.href ?? "/"}
        className="group 
			hover:bg-white 
			hover:text-black 
			text-white border border-transparent hover:border-white/20 
			py-2 px-4 rounded-full transition-all duration-300 ease-in-out"
      >
        {props.children}
      </Link>
    </li>
  );
};

````
