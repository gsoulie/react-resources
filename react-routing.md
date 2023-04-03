[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Routing

* [Utilisation](#utilisation)     
* [Naviguer](#naviguer)    
* [useHistory](https://github.com/gsoulie/react-resources/blob/main/react-hooks.md#usehistory)      
* [Routes dynamiques](#routes-dynamiques)     
* [Route par défaut](#route-par-défaut)     
* [Routes imbriquées](#routes-imbriquées)     
* [Informations sur la route](#informations-sur-la-route)      
* [Route index](#route-index)     
* [Loader](#useLoaderData)    
* [Gestion des erreurs](#gestion-des-erreurs)     
* [Naviguer par code](#naviguer-par-code)     
* [Route guard](#route-guard)     
* [Lazy loading](#lazy-loading)      
* [Déclaration des routes dans fichier externe](#déclaration-des-routes-dans-fichier-externe)     
* [Exemple avec guard](#exemple-avec-guard)       


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

## Route index

La route de type **index** est la route par défaut qui sera appelée lorsque la route parent sera activée. Dans l'exemple ci-dessous, la route */profile/<id>* chargera le composant <Profile>
à l'intérieur duquel sera chargé l'élément ````<h1>Route index</h1>```` dans le *Outlet*

````tsx
<Route path="/profile/:id" element={<Profile />}>
  <Route index element={<h1>Route index</h1>}/>		<!-- Route index -->
  <Route path="/profile/:id/coords" element={<Coords />}/>
  <Route path="/profile/:id/cart" element={<Cart/>}/>
</Route>
````

[Back to top](#routing)     
	
## useLoaderData

https://www.youtube.com/watch?v=L2kzUg6IzxM&ab_channel=Academind

useLoaderData est un hook de React Router. Il permet de déclencher un chargement de data lors de l'activation d'une route. 


*Composant Enfant*
````tsx
import { useLoaderData } from 'react-router-dom';
import { fetchPostDetailFromApi } from '../shared/services/post';

export const PostDetail = () => {
	const postData = useLoaderData();
	
	return (
		<>
			<h2>Détail du post</h2>
			<h4>{ postData.title }</h4>
			<p>{ postData.message }</p>
		</>
	)
}

export function loader({ params }) {	// params de la route
	const postId = params.id;
	return fetchPostDetailFromApi(postId);
}
````

Le loader est ensuite déclenché via la propriété ````loader```` de l'élément ````<Route>````

*Composant Parent*
````tsx
import { loader as postDetailLoader } from '../components/PostDetail';

<Route path="/blog">
	<Route path=":id" element={<PostDetail />} loader="{postDetailLoader}"/>
</Route>
````
[Back to top](#routing)     

### defer

A voir utilisation de ````defer```` pour retarder le chargement de certaines données lors du routage

[Back to top](#routing)     

## Gestion des erreurs

Depuis React Router 6.4, un nouveau paramètre ````errorElement```` permet de gérer un affichage en cas d'erreur levée par le ````loader````

````tsx
<Route 
	path=":id" 
	element={<PostDetail />} 
	loader="{postDetailLoader}"
	errorElement={<h1>Une erreur est survenue lors du chargement des données</h1>}
/>
````

Ce paramètre peut être positionné sur n'importe quel route à n'importe quel niveau (note : en plaçant le paramètre au niveau parent, si une erreur est levée par un enfant, cela déclenchera l'affichage défini dans le niveau parent). Cela permet de pouvoir gérer une page d'erreur pour chaque route si besoin

### useRouteError

Le hook useRouteError permet d'accéder à l'erreur levée par le routage

Soit la requête : 

````tsx
const response = await fetch('<URL>');
if (!response.ok) {
	throw { message: 'Failed to load posts', status: 500 };
}
````

Sera lue avec le hook de la manière suivante

````tsx
import { useRouteError } from 'react-router-dom';

const error = useRouteError();

return (
	<p>{ error.code } - { error.message }</p>
)
````

[Back to top](#routing)     

## Naviguer par code

La navigation via le code se fait par l'intermédiaire du hook *useNavigate()*

````tsx
export default function Cart() {
  const navigate = useNavigate();
  
  return (
    <div>
      <h3>Votre panier</h3>
      <button onClick={() => navigate('/')}>Retour accueil</button>
    </div>
  )
}
````

[Back to top](#routing)     

## Route guard

Il existe plusieurs solution pour protéger un ensemble de route. Une des plus simple est la suivante 

1 - Créer un fichier permettant d'activer un ensemble de route si le critère choisi est validé (ex : authentification)

*ProtectedRoutes.tsx*
````tsx
import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from './shared/contexts/authContext'

export const PrivateRoutes = () => {
  //const authCtx = useContext(AuthContext);  	// possibilité de se baser sur une valeur de contexte
  let auth = {'token':true}
return (
    auth.token ? <Outlet/> : <Navigate to='/login'/>
  )
}
````

La fonction regarde si la condition est validée, si c'est le cas elle affichera le contenu des routes dans un objet ````<Outlet>````. Dans le cas contraire elle redirigera vers la route */login*

Ensuite dans le composant principal il suffit d'encadrer les routes à protéger dans une autre *Route* qui recevra comme élément le *ProtectedRoutes* défini précédemment.

Sans y inclure la route par défaut type "**" et les routes qui doivent rester accessibles tout le temps

*App.tsx*
```tsx
return (
  <AuthContext.Provider value={authCtx}>
	<div>
		<Toolbar />
		<Routes>
		
		  <Route element={<PrivateRoutes />}>
			<Route path="/" element={<ProductList />} />
			<Route path="/cart" element={<Cart/>} />
		  </Route>
		  
		  <Route path='/login' element={<Login/>}/>
		</Routes>
	</div>
  </AuthContext.Provider>
  )
````
[Back to top](#routing)     

## Lazy loading

## Lazy loading des routes

````tsx
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import React, { Suspense, lazy } from 'react';
 
const Home = lazy(() => import('./routes/Home'));
const About = lazy(() => import('./routes/About'));
 
const App = () => (
<Suspense fallback={<div>Loading...</div>}>
  <Routes>
	<Route exact path="/" component={Home}/>
	<Route path="/about" component={About}/>
  </Routes>
</Suspense>  
);
````
[Back to top](#routing)     

## Déclaration des routes dans fichier externe

*app-routing.tsx*

````typescript
import { RestrictedMembers } from './components/RestrictedMembers';
import { Admin } from './components/Admin';
import { Login } from './components/Login';
import { Public } from './components/Public';
import { ErrorPage } from './components/ErrorPage';
import { createBrowserRouter, redirect } from 'react-router-dom'
import authService from "./shared/services/auth.service";
import App from './App'

const authLoader = () => {
  if (!authService.isLogged()) {
    return redirect('/login');
  } else {
    return true;
  }
};

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          {
            element: <Public />,
            index: true
          },
          {
            element: <Login />,
            path: '/login'
          },
          {
            element: <Admin />,
            path: '/admin',
            loader: authLoader
          },
          {
            element: <RestrictedMembers />,
            path: '/members',
            loader: authLoader
          },
        ]
      }
    ]
  }
])
````

*main.tsx*

````tsx
import { routes } from './app-routing'
import { RouterProvider } from 'react-router-dom';

const router = routes;

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  // <BrowserRouter>
  //   <App />
  // </BrowserRouter>
  <RouterProvider router={router} />
)
````

*App.tsx*

````tsx
import { Outlet } from "react-router-dom";

 return (
    <>      
	<Header />
	<Menu />
	<Outlet />
    </>
  )
````
[Back to top](#routing)     

## Exemple avec guard

Une autre syntaxe consiste à séparer les routing dans différent composants. Dans cet exemple nous avons 3 zones de routage, une publique, une privée et une pour l'authentification

*App.tsx*
````
<BrowserRouter>
	<BrowserRouter>
        <Routes>
          <Route path="/*" element={<PublicRouter />}/>
          <Route path="/admin/*" element={
            <AuthGuard>
              <AdminRouter />
            </AuthGuard>
          }/>
          <Route path="/auth/*" element={<AuthRouter/>}/>
        </Routes>
      </BrowserRouter>
</BrowserRouter>
````

*Guard*
````
import { Navigate } from "react-router-dom";
import { accountService } from "@/_services/account.service";

export const AuthGuard = ({children}) => {

    if(!accountService.isLogged()){
        return <Navigate to="/auth/login"/>
    }
   
    return children
};
````

*PublicRouter.tsx*
````
import { Routes, Route } from "react-router-dom"

export const PublicRouter = () => {
	return (
		<Routes>
			<Route element={<Layout />} >
				<Route index element={<Home />} />
				<Route path="home" element={<Home />} />
				<Route path="service/:id" element={<Service />} />
				<Route path="*" element={<Error />} />
			</Route>
		</Routes>
	)
}

export const Layout = () => {
	return (
		<>
			<Header />
			
			<Outlet />
		</>
	)
}
````

*AdminRouter.tsx*
````
import { Routes, Route } from "react-router-dom"

export const AdminRouter = () => {
	return (
		<Routes>
			<Route element={<AdminLayout />} >
				<Route index element={<Dashboard />} />
				<Route path="user">
					<Route path="index" element={<User />} />
					<Route path="edit/:id" element={<UserEdit />} />
					<Route path="add" element={<UserAdd />} />
				</Route>
				<Route path="product">
					<Route path="index" element={<Product />} />
					<Route path="edit/:id" element={<ProductEdit />} />
					<Route path="add" element={<ProductAdd />} />
				</Route>
				<Route path="*" element={<Error />} />
			</Route>
		</Routes>
	)
}

export const AdminLayout = () => {
	return (
		<>
			<Header/>
            <div id="admin">
                <SideMenu/>
                <div>
					<Outlet/>
				</div>
            </div>
		</>
	)
}
````

*AuthRouter.tsx*
````
export const AuthRouter = () => {
	return (
		<Routes>
			<Route index element={<Login/>}/>
			<Route path="login" element={<Login />} />
			<Route path="*" element={<Error />} />
		</Routes>
	)
}
````

[Back to top](#routing)     
