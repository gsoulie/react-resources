[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Généralités

## Description

La création d'un projet *Next* va générer les répertoires suivants :

* public : contient tout le contenu public de l'appli
* pages : contient tous les composants react
* pages/api : contient les api

Lors du premier rendu, Next génère le contenu statique de la page de manière à ce que le tti soit le plus rapide possible. On peut s'en rendre compte en affichant le source de la page qui contient tout le contenu html, alors que sur une application react classique, 
le contenu est dynamique (comme angular, vue...)

présentation : https://www.youtube.com/watch?v=wTFThzLcrOk&ab_channel=Grafikart.fr     

## Installation

````
npx create-next-app@latest --typescript
````

**Using sass**

````
npm install --save-dev sass
````

## Build

Lors du build, Next analyse le code de l'application, et en fonction de ce qu'il va trouver, il va choisir le mode de rendu optimal (Server, Static, SSG, ISR).

La compilation Next va construire les ressources et les ajouter dans le répertoire *.next*. Pour exporter le contenu, il faut utiliser la commande

````
npx next export 
````

-> Génère un répertoire *.out* qu'on va poser sur le serveur

## Fonctionnement

React 18 et Next 12 introduisent une version alpha des composants serveur React. Les composants serveur sont entièrement rendus sur le serveur et ne nécessitent pas de JavaScript côté client pour être rendus. De plus, les composants serveur permettent aux développeurs de conserver une certaine logique sur le serveur et d'envoyer uniquement le résultat de cette logique au client. Cela réduit la taille du bundle envoyé au client et améliore les performances de rendu côté client.

Avec NextJS, il est possible de déclarer des composants **serveur** et des composants **clients**. Il est important de se rappeler que toutes les fonctions qui s'exécutentt habituellement côté client ne sont pas accessibles côté serveur. Par exemple l'appel à ````window.xxxx```` ne pourra pas s'effectuer dans un composant déclaré comme composant serveur.
De la même manière, il n'y a pas d'état ou de reducer (useState, useReducer) dans les composants côté serveur.

Si on a besoin d'un state ou d'un reducer, alors il faut définir son composant comme étant un composant **client**.

````typescript
'use client'; // <-- déclarer le composant comme étant "client"

export default MyCompo = () => {

}
````

### Récupérer des données asynchrone côté client

Pour pouvoir récupérer des données asynchrone côté client, il existe un hook **use** qui agit comme un **await**

````typescript
'use client';

async function getData() {
  const res = await fetch('https://xxxxxx');
  return res.json();
}

export default MyCompo = () => {
  const name = use(getData());
}
````
