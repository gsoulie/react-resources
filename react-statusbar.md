
[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# StatusBar

*Expo* met à disposition un composant *<StatusBar>*

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> l'utilisation de ce composant nécessite l'encadrement de toute la vue par les balises ````<>...</>````

````jsx
import { StatusBar } from 'expo-status-bar';

export default function App() {  
  return (
	<>
		<StatusBar style='light'></StatusBar>
		<View>...</View>
	</>
````

Le composant *<StatusBar>* permet de définir la couleur des éléments qu'elle contient via la propriété ````style=''```` qui peut prendre les valeurs *light, dark, auto*
