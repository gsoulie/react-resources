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
