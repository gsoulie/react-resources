[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Routing

* [Installation](#installation)     
* [Construction du routing](#construction-du-routing)
* [Chemins absolus et chemins relatifs](#chemins-absolus-et-chemins-relatifs)      
* [Navigation avec Link et NavLink](#navigation-avec-link-et-navlink)      
* [Navigation par code avec useNavigate](#navigation-par-code-avec-usenavigate)    
* [Récupération des paramètres de route avec useParams](#récupération-des-paramètres-de-route-avec-useparams)      
* [Chargement des data avec useLoaderData](#chargement-des-data-avec-useloaderdata)
* [Utiliser les données de la loader function avec useRouteLoaderData](#utiliser-les-données-de-la-loader-function-avec-userouteloaderdata)      
* [Gérer le status de chargement avec useNavigation](#gérer-le-status-de-chargement-avec-usenavigation)     
* [Gestion des erreurs](#gestion-des-erreurs)     
* [Informations sur la route avec useLocation](#informations-sur-la-route-avec-uselocation)    
* [Route guards](#route-guards)    
* [Lazy-loading](#lazy--loading)    
* [Envoyer des data au router avec action](#envoyer-des-data-au-router-avec-action)
* [Déclenchement manuel d'une action associée à une route avec useSubmit](#déclenchement-manuel-dune-action-associée-à-la-route)
* [Déclenchement manuel d'une action par un composant non attaché à cette route avec useFetcher](#déclenchement-manuel-dune-action-par-un-composant-non-attaché-à-cette-route)
* [Déclencher l'action d'une route sans passer par le routing](#déclencher-laction-dune-route-sans-passer-par-le-routing)       
* [useActionData](#useactiondata)
* [Authentification simple avec token](#authentification-simple-avec-token)
* [Ajout Bearer dans url](#ajout-bearer-dans-url)     
* [Projet complet]()      
## Installation

````npm i react-router-dom````

## Construction du routing

<details>
	<summary>Bonne pratique de construction du routage</summary>
 	
### Déclaration des routes

Une bonne pratique pour la construction du routage consiste à déclarer les routes dans un fichier séparé, en utilisant la fonction ````createBrowserRouter```` de react-router

Voici un exemple complet de définition de routes :

*route.ts*
````typescript
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <RouteLayout />,
    errorElement: <Error />,	// gestion des erreurs (voir section dédiée)
    children: [
      {
        index: true,	// <-- spécifier la route comme index évite de re-spécifier un path = '/'
        element: <HomePage />,
      },
      {
        path: "events",
        element: <EventsLayout />,
        children: [
          {
            index: true,	// <-- /events 
            element: <EventsPage />,
            loader: eventsLoader,	// gestion du chargement des données (voir section dédiée)
          },
          {
            path: ":id",
            element: <EventDetailPage />,
			loader: EventDetailLoader
          },
          {
            path: "new",
            element: <NewEventPage />,
          },
          {
            path: ":id/edit",
            element: <EditEventPage />,
			loader: EventDetailLoader
          },
        ],
      },
    ],
  },
]);
````
	
Le routage précédent n'est pas totalement optimisé, on peut voir que les routes */events/:id* et */events/id/edit* partagent la même racine */events/id* ainsi que le le même loader. On pourrait donc factoriser le code et rajouter un niveau d'imbrication :
	
*route.ts*
````typescript
	export const routes = createBrowserRouter([
	  {
		path: "/",
		element: <RouteLayout />,
		errorElement: <Error />,	// gestion des erreurs (voir section dédiée)
		children: [
		  {
			index: true,	// <-- spécifier la route comme index évite de re-spécifier un path = '/'
			element: <HomePage />,
		  },
		  {
			path: "events",
			element: <EventsLayout />,
			children: [
			  {
				index: true,	// <-- /events 
				element: <EventsPage />,
				loader: eventsLoader,	// gestion du chargement des données (voir section dédiée)
			  },
			  {
				path: ":id",
				loader: EventDetailLoader,
				id: 'event-detail',	// <-- Lorsque plusieurs routes partagent le même loader, il faut définir un id 
				children: [
				{
					index: true,
					element: <EventDetailPage />,
					
				},
				{
					path: "edit",
					element: <EditEventPage />,
				  },
				]
			  },
			 
			  {
				path: "new",
				element: <NewEventPage />,
			  },
			  
			],
		  },
		],
	  },
	]);
````

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> : en utilisant un loader partagé entre plusieurs routes, il faut spécifier un identifiant qui servira à récupérer les données avec ````const data = useRouteLoaderData("event-detail");```` et non plus avec ````const data = useLoaderData()````
	

### Routes imbriquées

````typescript
const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: '/products', element: <Products /> }
		]
	},{
		path: '/admin',
		element: <Admin />
	}
])
````

### Route par défaut

La route par défaut (i.e '**' sous Angular) se définie par le chemin ````/*````. Tout comme Angular, cette route doit être la dernière spécifiée.

````typescript
<Route path="/*" element={
  <h1>Erreur 404</h1>
} />
````
	
### Cablage du router

Le router principal peut être ajouté soit dans le fichier **main.tsx** ou **App.tsx**

*Intégration dans le App.tsx*
````typescript
import { RouterProvider } from "react-router-dom";
import { routes } from "./routing/route";

function App() {
  const router = routes;

  return <RouterProvider router={router}></RouterProvider>;
}
````

*Intégration dans le main.tsx*
````typescript
<RouterProvider router={router}>
	<App />
</RouterProvider>
````

### Router Outlet

Le dernier élément indispensable au routage est l'ajout de l'élément ````<Outlet />````

*RouteLayout.tsx*
````typescript
import { Outlet } from "react-router-dom";

export const RouteLayout = () => {
  return (
	<>
	  <MainNavigation />
	  <Outlet />
	</>
  );
};
````

[Back to top](#routing)     

</details>

## Chemins absolus et chemins relatifs

<details>
<summary>Comprendre les chemins absolus et relatifs</summary>

* chemins absolus : commençent par un "/"
* chemins relatifs : ne commençent **pas** par un "/" est sont **concaténés à la route parent**

*Chemins absolus*
````typescript
const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		errorElement: <GlobalErrorPage />,
		children: [
			{ path: '/', element: <HomePage /> },
			{ path: '/products', element: <Products />, errorElement: <ProductErrorPage /> }
		]
	}
])
````

*Chemins relatifs*
````typescript
const router = createBrowserRouter([
	{
		path: '/root',
		element: <RootLayout />,
		errorElement: <GlobalErrorPage />,
		children: [
			{ path: '', element: <HomePage /> },
			{ path: 'products', element: <Products />,
			{ path: 'products/:id', element: <ProductsDetail /> }
		]
	}
])
````

### path ..

Il existe une manière simple de remonter à la route **parente** supérieure, via la route relative **..**

````typescript
<Link to="..">Back</Link>
````

> par défaut, la propriété ````relative```` est positionnée à ````route````

En considérant le routage précédent : 

````typescript
const router = createBrowserRouter([
	{
		path: '/root',
		element: <RootLayout />,
		errorElement: <GlobalErrorPage />,
		children: [
			{ path: '', element: <HomePage /> },
			{ path: 'products', element: <Products />,
			{ path: 'products/:id', element: <ProductsDetail /> }
		]
	}
])
````

````to=".."```` nous ramènera sur ````/root```` et non pas sur ````/products```` qui est une route "soeur", non parent.

En modifiant la propriété ````relative```` avec la valeur ````path````, le router va désormais regarder la route active et lui retirer un segment

````typescript
<Link to=".." relative="path">Back</Link>
````
Le bouton Back nous ramène maintenant sur la route ````/products````


[Back to top](#routing)    

</details>

## Navigation avec Link et NavLink

<details>
<summary>Navigation dans React</summary>
Tout comme Angular / Vue, utiliser une balise 

````html
<a href="">
````
permet de naviguer entre les routes mais a pour inconvénient de déclencher un rafraichissement de toute la page.

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

### Elément NavLink

L'élément *NavLink* est **smiliaire** à l'élément *Link*, à la différence qu'il permet de paramétrer la classe css en fonction de si le lien est actif ou non 

````tsx
import { Route, Routes, NavLink  } from 'react-router-dom';

return (
<nav>
	<NavLink to="/" className={({isActive}) => (isActive ? 'activeLink' : undefined)} end="true">Accueil</NavLink>
	<NavLink to="/users" className={({isActive}) => (isActive ? 'activeLink' : undefined)} end="true">Utilisateurs</NavLink>
	<NavLink to="/profile/1234545" style={{({isActive}) => (isActive ? (color: 'red') : undefined)}}>Profil</NavLink>
</nav>
)
````

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> : par défaut, le router regarde si la route demandée **commence** par la chaîne spécifiée dans l'attribut **to**. De cette manière, **toutes** les routes correspondantes à ce motif seront marquées comme *active*. Dans l'exemple, la première route étant la toute "/", alors toutes les routes seront marquées comme active. Ceci étant un problème, il faut alors renseigner la propriété **end** à *true* pour éviter de marquer toutes les routes comme active. Pour les routes ayant un path "unique', il n'est pas nécessaire de spécifier l'attribut *end*

[Back to top](#routing)    

</details>

## Navigation par code avec useNavigate

<details>
<summary>Utilisation du hook useNavigate</summary>

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

</details>

## Récupération des paramètres de route avec useParams

<details>
<summary>Utilisation du hook useParams</summary>

Voici comment récupérer le paramètre *id* de la route suivante : ````"/profile/:id"```` avec le hook *useParams*

````typescript
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

</details>

## Chargement des data avec useLoaderData

<details>
<summary>Utilisation du hook useLoaderData</summary>

useLoaderData est un hook de React Router. Il permet de déclencher un chargement de data lors de l'activation d'une route. les fonctions loader sont chargées au moment où l'on commence à naviguer, et donc pas après que la page ait été rendue, mais **avant** qu'on arrive sur la page.

Pour simplifier l'écriture d'un composant ayant un chargement de données dans son initialisation et par conséquent, se passer de l'utilisation d'un *useEffect*, il est possible de déclarer une fonction loader directement dans le composant (ou dans un service).
Cette fonction pourra ensuite être déclenchée directement dans le fichier de routing lors de la navigation vers ce composant.

<img src="https://img.shields.io/badge/A%20RETENIR-DD0031.svg?logo=LOGO">

* ````useLoaderData()```` Utiliser les données du loader de la **route actuelle uniquement**     
* ````useRouteLoaderData('routeId')```` Utiliser les données du loader de la **route correspondante à l'id spécifié**            

*EventPage.tsx*
````typescript
import EventsList from "../../components/EventsList";
import "./Event.css";
import { useLoaderData } from "react-router-dom";

export const EventsPage = () => {
  const data = useLoaderData();	// <-- récupérer le résultat de la fonction loader
  const fetchedEvents = data.events;

  return (
	<>
	  <EventsList events={fetchedEvents} />
	</>
  );
};

/**
 * Fonction loader : fait un appel http qui récupère les data ou retourne une erreur
 **/
export const loader = async ({ request, params }) => {
  // const eventId = params.id	// <-- récupérer l'éventuel paramètre de route
  
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
	throw new Response(JSON.stringify({ message: "Something went wrong" }), {
	  status: 500,
	});
  } else {
	return response;
  }
};

````

> **Note** : la fonction ````loader = async ({ request, params })```` accepte 2 paramètres dont ````params```` qui permet de récupérer l'éventuel paramètre dynamique de la route. Car pour rappel, les hooks ne sont **pas accessibles** en dehors des composants. En l'occurrence une fonction loader n'est **pas** un composant react

*routes.tsx*
````typescript
import { EventsPage, loader as eventsLoader } from "../pages/Event/EventsPage";

export const routes = createBrowserRouter([
	{
		path: "/",
		element: <RouteLayout />,
		errorElement: <Error />,
		children: [
		{ index: true, element: <HomePage /> },
		{ path: "events", element: <EventsLayout />,
			children: [
			  {
			    index: true,
			    element: <EventsPage />,
			    loader: eventsLoader,	// <-- déclencheur de la fonction loader
			  },
			],
		}],
	},
]);
````

[Back to top](#routing)     

</details>

## Utiliser les données de la loader function avec useRouteLoaderData

<details>
	<summary>Utilisation du hook useRouteLoaderData</summary>
	
<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> : Les *loader functions* **doivent** retourner une valeur ou **null**

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> : en utilisant un loader partagé entre plusieurs routes, il faut spécifier un identifiant qui servira à récupérer les données avec ````const data = useRouteLoaderData("event-detail");```` et non plus avec ````const data = useLoaderData()````

Dans cet exemple, on souhaite associer une *loader function* à la route principale ````/````, permettant de charger le token depuis le localstorage afin de savoir si l'utilisateur est authentifié.
	
*routes.ts*
````typescript
{
    path: "/",
    element: <RootLayout />,
    errorElement: <ErrorPage />,
	
    loader: tokenLoader, // <-- le token sera chargé à chaque fois qu'on changera de route
    id: "root",	// <-- id 
    children: [...]
}
````

*auth.js*
````tsx
export function getAuthToken() {
  const token = localStorage.getItem(KEY_TOKEN);
  return token;
}

export function tokenLoader() {
  return getAuthToken();
}
````

Il suffit ensuite depuis n'importe quel composant, de récupérer le token chargé par la *loader function* avec le hook **useRouteLoaderData** en spécifiant l'id défini dans le fichier *routes.ts*

*RandomComponent.tsx*
````tsx
const token = useRouteLoaderData("root"); // <-- récupération du token chargé dans le loader de la route principale
````	

[Back to top](#routing)     

</details>

## Gérer le status de chargement avec useNavigation

<details>
<summary>Utilisation du hook useNavigation</summary>

Le hook *useNavigation* permet de récupérer entre autre le **state** (````state: "idle" | "loading" | "submitting"````) de la navigation en cours. Ceci nous permet de pouvoir afficher un feedback à l'utilisateur en fonction de ce state.

*Exemple 1*
````typescript
import { Outlet, useNavigation } from "react-router-dom";

export const RouteLayout = () => {
  const navigation = useNavigation();
  return (
	<>
	  <MainNavigation />
	  {navigation.state === "loading" && <p>Loading...</p>}
	  <Outlet />
	</>
  );
};
````

*Exemple 2*
````typescript
function AuthForm() {
  const navigation = useNavigation();

  const [searchParams] = useSearchParams();
  const isLoginMode = searchParams.get("mode") === "login";

  const isSubmitting = navigation.state === "submitting";

  return (
    <>
      <Form method="post" className={classes.form}>
        <!-- form inputs -->

        <button disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save"}
        </button>
      </Form>
    </>
  );
}
````

[Back to top](#routing)     

</details>

## Gestion des erreurs

<details>
<summary>Gestion des erreurs avec le hook useRouterError</summary>

Il est possible de gérer les erreurs depuis le fichier de routing via la propriété ````errorElement````. Chaque route peut avoir son propre élément erreur, et c'est celui qui est le plus proche de la route qui sera déclenché.

*routes.tsx*
````typescript
export const routes = createBrowserRouter([
{
	path: "/",
	element: <RouteLayout />,
	errorElement: <Error />,	// <-- Elément error
	children: [...]
})]
````

<img src="https://img.shields.io/badge/Bonne%20pratique?logo=LOGO"> : créer une page Error générique composée d'un composant layout gérant l'affichage de l'erreur (voir exemple ci-dessous)

*Error.tsx*
````typescript
import React from "react";
import { PageContent } from "./PageContent";
import { useRouteError } from "react-router-dom";

export const Error = () => {
  const error = useRouteError();	// <-- permet de récupérer les informations relatives à l'erreur levée durant le routage

  let title = "An error occurred !";
  let message = "Something went wrong";

  if (error.status === 500) {
	// message = JSON.parse(error.data).message;	// voir methode 1 du loader ci-après : JSON.parse car l'erreur a été stringifier depuis le loader
	message = error.data.message	// voir methode 2 du loader ci-après (à préférer)
  }
  if (error.status === 404) {
	title = "404 - Not Found !";
	message = "Could not find resource or page !";
  }
  return (
	<>
	  <MainNavigation />
	  <PageContent title={title}>
		<p>{message}</p>
	  </PageContent>
	</>
  );
};
````

*PageContent.tsx*
````typescript
export const PageContent = ({ title, children }) => {
  return (
	<div>
	  <h1>{title}</h1>
	  {children}
	</div>
  );
};
````


*Exemple de gestion d'erreur déclenchée dans le loader lors du routage*
````typescript
import { json } from "react-router-dom";

export const loader = async () => {
  const response = await fetch("http://localhost:8080/events");

  if (!response.ok) {
	// --> Gestion de l'erreur remontée au router
	
	// methode 1 - Response
	// throw new Response(JSON.stringify({ message: "Something went wrong" }), {
	//   status: 500,
	// });
	
	// methode 2 - json <---- BONNE PRATIQUE
	throw json({ message: 'Could not fetch events' }, { status: 500 })
  } else {
	return response;
  }
};
````

[Back to top](#routing)     

</details>

## Informations sur la route avec useLocation

<details>
<summary>Ajouter des informations dans la route</summary>

L'utilisation du hook **useLocation** de *react-router-dom* permet de récupérer certaines informations sur la route

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

</details>

## Route guards

<details>
	<summary>Gérer la protection des routes</summary>

La création d'un guard est très simple en React, il suffit de créer une fonction qui permet, soit de rediriger l'utilisateur sur la page de login s'il n'est pas déjà identifié, sinon retourner null.
On peut en outre, rediriger vers une page d'erreur ou autre.
	
*auth.ts*
````tsx
export function checkAuthLoader() {
  // this function will be added in the next lecture
  // make sure it looks like this in the end
  const token = getAuthToken();
  
  if (!token) {
    return redirect('/auth');
  }
 
  return null;	// Rappel : une fonction loader DOIT retourner une valeur OU null
}
````

Il suffit ensuite d'assigner cette fonction au loader des pages que l'on souhaite protéger 

*routes.ts*
````tsx
	children: [
	  {
		path: "edit",
		element: <EditEventPage />,
		action: manipulateEventAction,
		loader: checkAuthLoader, // <-- GUARD
	  },
	],
},
{
	path: "new",
	element: <NewEventPage />,
	action: manipulateEventAction,
	loader: checkAuthLoader, // <-- GUARD
},
````

[Back to top](#routing)     

</details>


## Envoyer des data au router avec action

<details>
<summary>Utilisation des router actions</summary>

Il est possible d'envoyer des données au backend via des *actions* déclenchées lors du routage. On utilise pour cela le paramètre ````action```` des routes

**Déclaration de l'action dans la route**

*routes.tsx*
````typescript
import { action as newEventAction } from '../Components/NewEvent.tsx';
...
{
	path: "new",
	element: <NewEventPage />,
	action: newEventAction
},
````

**Implémentation de l'action dans le composant**

*NewEventPage.tsx*
````typescript
import { json, redirect } from "react-router-dom";
import { EventForm } from "../../components/EventForm";

export const NewEventPage = () => {
	return <EventForm />;
};

/**
* Fonction action
**/
export const action = async ({ request, params }) => {
	const data = await request.formData(); // récupère les données du formulaire concerné

	const eventData = {
		title: data.get("title"),
		image: data.get("image"),
		date: data.get("date"),
		description: data.get("description"),
	};
	
	const response = await fetch("http://localhost:8080/events", {
		method: "POST",
		headers: {
		"Content-Type": "application/json",
		},
		body: JSON.stringify(eventData),
	});
	
	if (!response.ok) {
		throw json({ message: "Could not save event" }, { status: 500 });
	}
	
	return redirect("/events"); // redirige automatiquement sur la page après traitement
};
````

> Le fonctionnement est similaire au *loader*, on déclare une fonction (qui envoi des données au backend par exemple) depuis un composant, et cette dernière sera déclenchée par le routage.

**Création du formulaire**

*EventForm.tsx*
````typescript
import { Form, useNavigate } from "react-router-dom";

export const EventForm = ({ method, event }) => {

return (
	<Form method="post">
		<p>
			<label htmlFor="title">Title</label>
			<input
			  id="title"
			  type="text"
			  name="title"
			  required
			  defaultValue={event ? event.title : ""}
			/>
		</p>
	  
		<!-- etc ... -->
	  
		<div className={classes.actions}>
			<button type="button" onClick={cancelHandler}>
			  Cancel
			</button>
			<button>Save</button>
		</div>
	</Form>
);
};

````

[Back to top](#routing)     

### Spécificité des formulaires associés

Il est nécessaire de remplacer les balises ````<form>```` classiques par des balises ````<Form method='post'>```` provenant de *react-router-dom*. Ensuite il faut s'assurer que chaque champ de saisi possède bien un attribut **name**

Ainsi, la sousmission du formulaire déclenchera automatiquement l'action associée à la **route active** et aura en paramètre tous les champs du formulaire.

[Back to top](#routing)     

</details>

## Déclenchement manuel d'une action associée à la route

<details>
	<summary>Utilisation du hook useSubmit</summary>

Il est aussi possible de déclencher une action **manuellement** via le hook ````useSubmit````qui prend en paramètre les éventuelles données à fournir à l'action, et les options.

Exemple : ici un bouton *delete* permet de supprimer un élément. 

````typescript
import { Link, useSubmit } from "react-router-dom";

function EventItem({ event }) {
	const submit = useSubmit();
	
	const  startDeleteHandler = () => {
		const proceed = window.confirm('Are you sure ?');
		
		if (!proceed) {
			return false;
		}
		
		submit(null, { method: 'DELETE' });
	}
}
````

*action correspondante*
````typescript
/** route.ts **/
/*{
	index: true,
	element: <EventDetailPage />,
	action: deleteAction,
}*/
		  
export const deleteAction = async ({ request, params }) => {
	const eventId = params.id; // récupération du paramètre de la route
	
	const response = await fetch(`http://localhost:8080/events/${eventId}`, {
		method: request.method, // récupère la méthode spécifiée lors de l'appel. On pourrait aussi mettre 'DELETE'
	});
	
	if (!response.ok) {
		throw json({ message: "Could not delete selected event." },
			{ status: 500 }
		);
	}
	
	redirect('/events');
};
````

**Exemple de déclenchement de l'action logout**

*routes.ts*
````tsx
{ path: "logout", action: logoutAction },
````

*Menu.tsx*
````tsx
const submit = useSubmit();

submit(null, { action: '/logout', method: 'post'})
````

[Back to top](#routing)     

</details>

## Déclenchement manuel d'une action par un composant non attaché à cette route

<details>
	<summary>Utilisation du hook useFetcher</summary>

n'initialise pas de transition vers une autre route

*routes.tsx*
````typescript
...
{
	path: "newsletter",
	element: <NewsletterPage />,
	action: newsletterAction,
},
````

Soit le composant suivant, intégré à la fois sur la page *NewsletterPage* (dont l'action *newsletterAction* est associée à la route), et également intégré dans le menu de navigation global de l'application.

Dans le cas d'une sousmission du formulaire via le composant intégré dans la navigation générale de l'application, nous devons pouvoir déclencher l'action ````newsletterAction```` depuis une route totalement différente de celle associée à l'action, ici ````/newsletter````.
Pour ce faire, il faut utiliser le hook ````useFetcher```` et modifier la balise ````<form>````par ````<fetcher.Form action="/newsletter" method="post">````.

> note : En utilisant ````<Form action="/newsletter" method="post">````, la sousmission entrainerait un déclenchement du routage vers la route ````/newsletter````, ce qui n'est pas souhaitable dans le cas d'une utilisation de l'action depuis une autre route, on ne souhaite pas changer de page.

*NewsletterSignup.tsx*
````typescript
import { useFetcher } from "react-router-dom";

export const NewsletterSignup = () => {
	const fetcher = useFetcher();
	
	/* === propriétés intéressantes === */
	// fetcher.state
	// fetcher.data
	
	return (
		<fetcher.Form
			method="post"
			action="/newsletter"
		>
			<input
				type="email"
				placeholder="Sign up for newsletter..."
				aria-label="Sign up for newsletter"
			/>
			<button>Sign up</button>
		</fetcher.Form>
	);
};
````
</details>

## Déclencher l'action d'une route sans passer par le routing

<details>
	<summary>Exemple de bonne pratique avec un bouton logout</summary>

Cet exemple montre la gestion du logout en utilisant les *route actions*

Le composant *Logout* est vide, il a pour rôle de vider le token dans le local storage et de re-router vers la route principale.

*Logout.tsx*
````typescript
import { redirect } from "react-router-dom";
import { KEY_TOKEN } from "../Util/auth";

export function action() {
  localStorage.removeItem(KEY_TOKEN);
  return redirect("/");
}

````

Dans le fichier *routes.ts* on ajoute une route sans composant, avec pour action, l'action de logout

*routes.ts*
````typescript
{ path: "logout", action: logoutAction },
````

On peut ensuite câbler l'action de logout depuis un bouton du menu principal en utilisant un ````<Form>````

````typescript
import { Form } from "react-router-dom";

export const MenuComponent = () => {

return(
	<Form action="/logout" method="post">
		<button>Logout</button>
	</Form>
)}
````

[Back to top](#routing)     

</details>


## useActionData

<details>
	<summary>Traitement des erreurs backend avec useActionData</summary>

Ce hook permet de récupérer les éventuelles erreurs levées par le backend et d'y réagir

Imaginons que le backend fournisse une api *POST* permettant d'avjouter un nouvel event avec un titre, image, date, description. Cette api contrôle la validité des champs avant d'ajouter la donnée en base. 
En cas de non conformité, elle retournera une erreur ````422```` avec un objet error contenant la liste des champs en défaut

*structure de l'api*
````typescript
router.post('/', async (req, res, next) => {
	const data = req.body;
	
	let errors = {};
	
	if (!isValidText(data.title)) { errors.title = 'Invalid title.'; }
	
	if (!isValidText(data.description)) { errors.description = 'Invalid description.'; }
	
	if (!isValidDate(data.date)) { errors.date = 'Invalid date.'; }
	
	if (!isValidImageUrl(data.image)) { errors.image = 'Invalid image.'; }
	
	if (Object.keys(errors).length > 0) {
		return res.status(422).json({
			message: 'Adding the event failed due to validation errors.',
			errors,
		});
	}
	
	try {
		await add(data);
		res.status(201).json({ message: 'Event saved.', event: data });
	} catch (error) {
		next(error);
	}
});
````

Notre frontend expose le formulaire suivant :

````typescript
import {
Form,
json,
redirect,
useActionData,
useNavigate,
useNavigation,
} from "react-router-dom";

export const EventForm = ({ method, event }) => {
	const navigate = useNavigate();
	
	const navigation = useNavigation();
	const isSubmitting = navigation.state === "submitting";
	
	const data = useActionData(); // <-- récupération des données de l'action la plus proche

const cancelHandler = () => { navigate(".."); }

return (
	<Form method={method} className={classes.form}>

		{/* Traitement des erreurs de validation provenant du backend, récupérée par useActionData */}
	
		{data && data.errors && (
			<ul>
			  {Object.values(data.errors).map((err) => (
			    <li key={err}>{err}</li>
			  ))}
			</ul>
		)}
		
		<p>
		<label htmlFor="title">Title</label>
		<input
		  id="title"
		  type="text"
		  name="title"
		  required
		  defaultValue={event ? event.title : ""}
		/>
		</p>
		  
		<!-- Autres champs ... -->
		  
		<div className={classes.actions}>
			<button type="button" disabled={isSubmitting} onClick={cancelHandler}>
			  Cancel
			</button>
			<button disabled={isSubmitting}>
			  {isSubmitting ? "Submitting..." : "Save"}
			</button>
		</div>
	</Form>
);
};

export const action = async ({ request, params }) => {
	const data = await request.formData(); // récupère les données du formulaire concerné
	
	const eventData = {
		title: data.get("title"),
		image: data.get("image"),
		date: data.get("date"),
		description: data.get("description"),
	};
	
	let url = "http://localhost:8080/events";
	
	if (request.method === "PATCH") {
		// test sur lowercase important !!
		url += `/${params.id}`;
	}
	
	const response = await fetch(url, {
		method: request.method, // props venant du composant EventForm
		headers: { "Content-Type": "application/json", },
		body: JSON.stringify(eventData),
	});
	
	// Voir projet backend code retour 442 si champs formulaire non valides
	if (response.status === 422) { return response; }
	
	if (!response.ok) { throw json({ message: "Could not save event" }, { status: 500 }); }
	
	return redirect("/events"); // redirige automatiquement sur la page après traitement
};
````

**Les parties importantes** sont le feedback utilisateur géré avec 

````typescript
{/* Traitement des erreurs de validation provenant du backend, récupérée par useActionData */}
{data && data.errors && (
<ul>
  {Object.values(data.errors).map((err) => (
    <li key={err}>{err}</li>
  ))}
</ul>
)}
````
  
Ainsi que l'interception de l'erreur ````422```` dans l'action 

````typescript
 // Voir projet backend code retour 442 si champs formulaire non valides
  if (response.status === 422) {
	return response;
  }
````

</details>

## Authentification simple avec token

<details>
	<summary>Authentification simple avec token</summary>
	
Dans cet exemple, on déclenche une *action* d'authentification sur la route ````/auth```` via un formulaire d'authentification. Pour savoir si le formulaire est mode mode 'login' ou 'signup', on contrôle les paramètres de l'URL ````/auth?mode=login```` ou ````/auth?mode=signup````
	
*Authentication.ts*
````tsx
// ... Component stuff
return (<AuthForm />)

/**
 * Action signup / login déclenchée par le routage du formulaire d'authentification
 */
export const authAction = async ({ request, params }) => {
  const authFormData = await request.formData(); // récupération des données du formulaire d'authentification

  const authData = {
    email: authFormData.get("email"),
    password: authFormData.get("password"),
  };

  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw json({ message: "Unssuported mode" }, { status: 422 });
  }

  const response = await fetch(`http://localhost:8080/${mode}`, { // AUTHENTIFICATION
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response) {
    throw json({ message: "Could not authenticate user" }, { status: 500 });
  }

  // manage token
  const resData = await response.json();
  const token = resData.token;
  localStorage.setItem(KEY_TOKEN, token);
  const expiration = new Date(); // Enregistrer la date d'expiration du token, ici (date + 1h)
  expiration.setHours(expiration.getHours() + 1);
  localStorage.setItem(KEY_TOKEN_EXPIRATION, expiration.toISOString());

  return redirect("/");
};
````

*routes.ts*
````tsx
// Other routes...
{ path: "auth", element: <AuthenticationPage />, action: authAction },
````

Formulaire d'authentification avec gestion des erreurs

*AuthForm.tsx*
````tsx
import {  Form,  Link,  useActionData,  useNavigation,  useSearchParams,} from "react-router-dom";

function AuthForm() {
  const data = useActionData();	// récupérer les données de la réponse http (pour afficher le détail de l'erreur par ex)
  const navigation = useNavigation();

  const [searchParams] = useSearchParams();	// paramètre de la route, vient-on de /auth?mode=login ou /aut?mode=signup
  const isLoginMode = searchParams.get("mode") === "login";

  const isSubmitting = navigation.state === "submitting";	// feedback utilisateur

  return (
    <>
      <Form method="post" className={classes.form}>
        <h1>{isLoginMode ? "Log in" : "Create a new user"}</h1>
        {data && data.errors && (
          <ul>
            {Object.values(data.errors).map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        )}
        {data && data.message && <p>{data.message}</p>}

        <p>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" required />
        </p>
        <p>
          <label htmlFor="image">Password</label>
          <input id="password" type="password" name="password" required />
        </p>
        <div className={classes.actions}>
          <Link to={`?mode=${isLoginMode ? "signup" : "login"}`}>
            {isLoginMode ? "Create new user" : "Login"}
          </Link>
          <button disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Save"}
          </button>
        </div>
      </Form>
    </>
  );
}

export default AuthForm;
````	
[Back to top](#routing)     

### Service Auth.ts

````typescript
import { redirect } from "react-router-dom";

export const KEY_TOKEN = "token";
export const KEY_TOKEN_EXPIRATION = "token_expiration";

//export getAuthToken = () => {
export function getAuthToken() {
  const token = localStorage.getItem(KEY_TOKEN);

  if (!token) { return null; }

  const tokenDuration = getTokenDuration();
  console.log(tokenDuration);

  if (tokenDuration < 0) { return "EXPIRED"; }

  return token;
}

export function tokenLoader() { return getAuthToken(); }

export function getTokenDuration() {
  const storedDate = localStorage.getItem(KEY_TOKEN_EXPIRATION);
  const expirationDate = new Date(storedDate);
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime();
  return duration;
}

/**
 * Route GUARD
 * @returns
 */
export function checkAuthLoader() {
  // this function will be added in the next lecture
  // make sure it looks like this in the end
  const token = getAuthToken();

  if (!token) {
    return redirect("/auth");
  }

  return null; // this is missing in the next lecture video and should be added by you
}

export function logout() {
  localStorage.removeItem(KEY_TOKEN);
  localStorage.removeItem(KEY_TOKEN_EXPIRATION);
}

````
[Back to top](#routing)     

</details>

## Ajout Bearer dans url

<details>
	<summary>Gérer les entêtes Http</summary>
	
````typescript
const response = await fetch("http://localhost:8080/events/" + eventId, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
    method: request.method,
});
````

[Back to top](#routing)     

</details>

