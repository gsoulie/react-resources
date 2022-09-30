[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Routing

* [Utilisation](#utilisation)     
* [Naviguer](#naviguer)    
* [Routes dynamiques](#routes-dynamiques)     
* [Route par défaut](#route-par-défaut)     
* [Routes imbriquées](#routes-imbriquées)     
* [Infomrations sur la route](#informations-sur-la-route)      


Par défaut il n'y a pas de gestion de des routes dans React comme sous Angular / Vue (Vue Router est maintenant intégré). 

Une des solutions pour gérer les routes en React est d'ajouter le plugin **Reac Router**.

> Remarque : Avec cette ajout, React devient un peu plus un framework et perd un peu son côté simple librairie

*Installation*
````npm install react-router-dom````

Initialisation dans le *index.js* ou *main.tsx*

````tsx
import { BrowserRouter } from 'react-router-dom';	// <-- ajouter l'import

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>	<!-- encadrer tout le dom avec BrowserRouter -->
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </BrowserRouter>
)
````

## Utilisation

Pour utiliser le routing dans un composant, il faut importer les modules ````Route```` et ````Routes````. 

Ensuite on va encadrer le code qui dépend d'un routage avec une balise ````<Routes>```` qui va contenir chaque ````<Route>````.

Chaque balise ````<Route>```` prend un paramètre *path* ainsi qu'un paramètre *element* qui va contenir tout le contenu qui est accessible via la route en question

*App.tsx*
````tsx
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <div className='main-container'>
      <img src={reactLogo} className="logo react" alt="React logo" />
      <Routes>
        <Route path="/" element={
          <div>
            <h2>Tuto Todo App</h2>
            <Hello name='Guillaume'>
              <span style={{ color: 'red' }}>Bonjour Typescript</span>
            </Hello>
          </div>
        } />
		<Route 
			path="/users" 
			element={
			  <UserList></UserList> 
			} />
      </Routes>      
      
    </div>    
  )
}
````

[Back to top](#routing)     

## Naviguer

Tout comme Angular / Vue, utiliser une balise ````<a href="">```` permet de naviguer entre les routes mais a pour inconvénient de déclencher un rafraichissement de toute la page.

Avec React Router on va donc utiliser l'élément ````<Link>````

````tsx
import { Route, Routes, Link } from 'react-router-dom';

return (
	<nav>
		<Link to="/">Accueil</Link>&nbsp;|&nbsp;
		<Link to="/users">Utilisateurs</Link>&nbsp;|&nbsp;
		<Link to="/profile/1234545">Profil</Link>
	</nav>
)
````
[Back to top](#routing)    

## Routes dynamiques

````tsx
return (
    <div className='main-container'>
      <Link to="/profile/1234545">Route avec paramètre</Link>
      
      <Routes>
        <Route path="/profile/:id" element={
          <Profile></Profile>
        } />
      </Routes>
);
````

*Récupération des paramètres de route côté enfant*

````tsx
import { useParams } from 'react-router-dom';	// <-- importer le hook useParams

export default function Profile() {
  const routeParams = useParams();

  return (
    <div>
      <h2>Votre profil</h2>
      <h4>Utilisateur N°#{ routeParams.id }</h4>
    </div>
  )
}
````
[Back to top](#routing)     

## Route par défaut

La route par défaut (i.e '**' sous Angular) se définie par le chemin ````/*````. Tout comme Angular, cette route doit être la dernière spécifiée.

````tsx
<Route path="/*" element={
  <h1>Erreur 404</h1>
} />
````
[Back to top](#routing)     

## Routes imbriquées

*Parent.tsx*
````tsx
return (
    <div className='main-container'>
	
	  <!-- navigation principale -->
      <nav>
        <Link to="/">Accueil</Link>
        <Link to="/profile/1234545">Profil</Link>
      </nav>
	  
      <Routes>
        <Route path="/" element={
          <div>
            <h2>Accueil</h2>
          </div>
        } />
        
        <Route path="/profile/:id" element={<Profile />}>
          <Route path="/profile/:id/coords" element={<Coords />}/>	<!-- route imbriquée -->
          <Route path="/profile/:id/cart" element={<Cart/>}/>
        </Route>
		
        <Route path="/*" element={<h1>Erreur 404</h1>} />
      </Routes>
	</div>
);
````

Une autre syntaxe moins verbeuse est possible 

````tsx
<Route path="/profile">
  <Route path=":id" element={<Profile/>}/>
  <Route path=":id/edit" element={<Edit />} />
  <Route path=":id/coords" element={<Coords />}/>
  <Route path=":id/cart" element={<Cart/>}/>
</Route>
````

Dans la sous-page contenant le routage imbriqué, il faut alors importer un élément ````<Outlet>```` équivalent au *<router-outlet>* Angular.

*Profile.tsx*
````tsx
import { useParams, Link, Outlet } from 'react-router-dom';

export default function Profile() {
  const routeParams = useParams();

  return (
    <div>
      <h2>Votre profil</h2>
      <h4>Utilisateur N°#{routeParams.id}</h4>
	  
	  <!-- Sous navigation : Attention à bien reprendre les paramètre dans la route si nécessaire-->
      <nav>
        <Link to={`/profile/${routeParams.id}/coords`}>Mes coordonnées</Link>&nbsp;|&nbsp;
        <Link to={`/profile/${routeParams.id}/cart`}>Mon panier</Link>
      </nav>
	  
      <Outlet />
	  
    </div>
  )
}
````
[Back to top](#routing)     
  
## Informations sur la route

L'utilisation du hook ````useLocation```` de *react-router-dom* permet de récupérer certaines informations sur la route

````tsx
import React from 'react'
import { useLocation } from 'react-router-dom';

export default function Cart() {
  const locationInfo = useLocation();
  console.log(locationInfo);
  
  return ()
}
````

Les informations retournées sont les suivantes :

````
hash: ""	// si on souhaite atteindre une ancre particulière
key: "ug7pqwxz"		// clé unique de la route
pathname: "/profile/1234545/cart"
search: ""		// paramètres de requête ex avec '?param=valeur'
state: null		// state passé en paramètre de navigation
````
  
[Back to top](#routing)     
