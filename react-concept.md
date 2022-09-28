
[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# React Native

* [Ressources](#ressources)     
* [Présentation](#présentation)     
* [Structure des éléments selon les plateformes](#structure-des-éléments-selon-les-plateformes)      
* [Installation](#installation)     
* [Différences entre les plateformes](#différences-entre-les-plateformes)     
* [Styles](#styles)     

## Ressources

https://www.youtube.com/watch?v=VozPNrt-LfE&ab_channel=Academind

## Présentation 

**React JS** est une lib JS pour le développement web

**React native** est une collection de builtin components qui sont compilés en élément natif UI. les API natives sont exposés au JS.


<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> React Native est **différent** de React !

React native se comporte comme React-dom, il connecte React à une plateforme spécifique (Android, iOS).

Les éléments d'UI : la vue écrite en JSX et les composants, sont ensuite compilée en natif. Contrairement à la logique JS (fonctions, state, directives...)
qui n'est pas compilée.


## Structure des éléments selon les plateformes

|Web browser (react-dom)|Native compo (Android)|Native compo (iOS)|React native JSX|
|-|-|-|-|
|````<div>````|````android.View````|````UIView````|````<View>````|
|````<input>````|````EditText````|````UITextField````|````<TextInput>````|


<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> React Native n'est **PAS du web** ! En conséquence il ne faut pas raisonner comme sous Ionic, Angular, Vue... Ce n'est **PAS** une web app contrairement à *React* !

Il faut donc avoir en tête les points suivants :

* Il n'y a pas de css, Android et iOS ne connaissent pas le css. On utilise du *inline-styling* ou des objets JSON comme propriété *style*
* On utilise une syntaxe *proche* du css mais ce n'en est pas
* il n'y as pas d'héritage de style, celà veut dire qu'un style appliqué sur un parent (ex une div) ne sera pas appliqué aux éléments enfants. (ex si on ajoute une propriété ````color: 'white'```` sur une *View*, cette couleur ne sera pas appliquée aux élément *<Text>* enfants qui pourraient exister 
* On utilise les composants natif, par exemple du texte ne peut pas être ajouté en dehors d'un composant <Text>
* Les balises html classiques utilisées dans les autres framework n'existent pas pour React Native (contrairement à React) ! On utilise les composants React Native
[Back to top](#react-native)     
  
## Installation

Deux CLI sont disponibles pour créer un projet React Native, le CLI *Expo* et le CLI *React Native*. Il est possible de passer de l'un à l'autre à postériori.

Le CLI *Expo* est plus simple d'utilisation et présente plusieurs avantages. Attention toutefois, on trouve moins de ressources (tutos, aide) pour *expo* et une partie des fichiers de configuration sont masqués contrairement à React Native CLI.

De plus le CLI expo offre une feature très intéressante lors du run. Il se connecte à l'application mobile "Expo" qui permet via wifi de déployer l'application sur le smartphone afin de la déployer en mode live-reload ! Il utilise un serveur web sur lequel il déploie l'application.
### CLI Expo
  
Installation ````npm i -g expo-cli````

Création du projet ````npx create-expo-app AwesomeProject````

Exécution 
````
npx expo install @expo/webpack-config@^0.17.0 
npx expo start --web
npx expo start
````

### CLI React Native
  
Création du projet ````npx react-native init AwesomeProject````

````
npm start
npm run web
npm run android
npm run ios
````
[Back to top](#react-native)     
  
## Différences entre les plateformes

Certains styles ne s'appliquent pas directement sur les éléments selon la plateforme.

Par exemple une propriété ````borderRadius: 8px```` ne fonctionnera pas directement sur un élément *<Text>* sous iOS.

Pour prendre en charge ces petites différences, il faut contourner le fonctionnement. Par exemple dans le cas cité, 
il faudrait pour iOS, encapsuler le l'élément *<Text>* dans une *<View>* et appliquer le borderRadius sur la *<View>* plutôt que sur l'élément *<Text>*
  
[Back to top](#react-native)     
  
## Styles

### Button
  
Les composant de type *Button* ne sont pas surchargeables comme en web classique. Il contienent un certain nombre de propriétés permettant de leur appliquer du style. Si l'on souhaite surcharger ces styles ou créer un style personnalisé, il faut alors créer son propre bouton à partir d'un composant ````<Pressable>````
  
Autre exemple, si on souhaite ajouter un margin sur un *Button* il faut au préalable l'inclure dans une *<View>* et appliquer le margin sur cette *<View>*

[Back to top](#react-native)     
