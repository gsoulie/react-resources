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
