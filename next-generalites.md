[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Généralités

* [Bonnes pratiques](#bonnes-pratiques)     
* [Installation](#installation)
* [Architecture recommandée](#architecture-recommandée)
* [Sass](#sass)
* [Build](#build)
* [Variables d'environnement](#variables-d-environnement)     
* [Runtime](#runtime)     
* [NextTopLoader](#nexttoploader)     
* [Next 13](#next-13)
* [Référencement](#référencement)
* [Type générique T](#type-générique-t)
* [Configuration eslint](#configuration-eslint)     

## Présentation

<details>
  <summary>NextJS est un framework fullstack pour React</summary>

Il permet de rendre le développement de grosses applications plus facile en ajoutant des fonctionnalités et en améliorant certaines autres.

* support SSR : avantage SEO
* routage basé sur l'arborescence : moins de code à développer pour gérer le routage
  
La création d'un projet *Next* va générer les répertoires suivants :

* public : contient tout le contenu public de l'appli
* pages : contient tous les composants react
* pages/api : contient les api

Lors du premier rendu, Next génère le contenu statique de la page de manière à ce que le tti soit le plus rapide possible. On peut s'en rendre compte en affichant le source de la page qui contient tout le contenu html, alors que sur une application react classique, 
le contenu est dynamique (comme angular, vue...)

présentation : https://www.youtube.com/watch?v=wTFThzLcrOk&ab_channel=Grafikart.fr     

</details>

## Stack recommandée

* SWR (= redux / context)
* react-bootstrap | voir aussi Shadcn https://ui.shadcn.com/ (très sympa)
* NextTopLoader : https://www.npmjs.com/package/nextjs-toploader

## Bonnes pratiques

* Il est fortement conseillé de déclarer toutes les pages serveur en asynchrone et de créer au même niveau un composant client pour gérer les traitements clients s'il y en a.
* Toujours faire **un maximum d'appels http côté serveur**
* Utilise *SWR* uniquement sur les éléments **fréquemment mis à jour** car il est très gourmand et il est **asynchrone** ce qui peut poser quelques difficultés d'utilisation si un traitement nécessite les données issues du swr
* DTO / classes : utiliser class-validator de typescript et class-transformer
* Formulaires : utiliser react-form avec yup

### Bonnes pratiques utilisation pages serveur

<details>
	<summary>L'objectif est de toujours réaliser les requêtes côté serveur et de passer les données + filtres éventuels au composant client 
afin de limiter au maximum l'utilisation de state / effect.</summary>

Côté client, le but consiste à mettre à jour les paramètres de route (dans l'url) à chaque modification de filtre ou autre,
et à refaire un router.push() ou router.redirect().

De cette manière, on revient sur la page (serveur) qui va récupérer les nouveaux paramètres (filtrage etc...) et relancer une requête.

> A noter, cette méthode ne recharge pas toute la page, mais uniquement son state interne, ce qui est optimisé

> Exemple fonctionnel : https://github.com/gsoulie/react-resources/tree/main/next-server-page-best-practices     

*app/search/page.tsx*

````typescript
export type DataParams = {
	token?: string,
	page?: number,
	size?: number,
	sortBy?: string,
	total?: number,
	categories?: FilterCatregoryType,
	...
}

export default async ProductPage = ({
	params,
	searchParams
}:
{
	params: {lang: Locale},
	searchParams?: {[key: string]: string | string[] | undefined}
}) => {
	if (isEmpty(searchParams.page) || isEmpty(searchParams.size) || isEmpty(searchParams.sortBy)) {
		const destination: string = `/products?page=1&size=10&sortBy=supplier`;
		
		return redirect(destination);
	}
	
	const apiEndpoint: string = process.env.NEXT_PUBLIC_API_URL;
	const cookieStore = cookies();
	const token: string = cookieStore.get('token')?.value;
	
	// APPEL HTTP
	const httpResponseData = ...
	
	const data: DataParams = {
		token: token | null,
		total: httpResponseData?.total,
		page: Number(searchParams.page),
		size: Number(searchParams.size),
		sortBy: String(searchParams.sortBy),
		categories: httpResponseData?.categories || null
	}
	
	return (
		<>
			<ProductsPageClient apiEndpoint={apiEndpoint} data={data}/>
		</>
	)
	
}
````

*app/search/client.tsx*

````typescript
// ...
// affichage des datas...

<ProductFilters totalResults={total} filters={filters} />
````

*components/Search/ProductFilters.tsx*

````typescript
import { ReadonlyURLSearchParams, usePathname, useRouter, useSearchParams } from 'next/navigation'

const ProductFilters: React.FC<{ totalResults: number, filters: any }> = ({ totalResults, filters }) => {
	const searchParams: ReadonlyURLSearchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();
	const [itemsPerPage, setItemsPerPage] = useState(filters.size || 50);
	const [currentPage, setCurrentPage] = useState(filters.page || 1);
	const itemOrderList: SearchRequestSortOrder[] = [SearchRequestSortOrder.ASC, SearchRequestSortOrder.DESC];
	const [sortBy, setSortBy] = useState(filters.sortBy || '');
	
	const onUpdateFilter = (
	page: number = 1,
	itemsPerPageParams: number,
	sortByVal: SearchRequestSortOrder | string): void => {
		const newParams: URLSearchParams = new URLSearchParams(searchParams.toString());
		
		newParams.set('page', page.toString());
		newParams.set('size', itemsPerPage.toString());
		newParams.set('sortBy', sortByVal.toString());
		
		const url: string = `${pathname}/?${newParams.toString()}`;
		
		router.push(url);
	}
}
````
</details>

## Installation

````
npx create-next-app@latest --typescript myApp

> src/ directory ? No
> App Router ? No  // Yes = génère le répertoire app sans répertoire pages
````

### Mise à jour 

````
npm i next@latest
````

## Architecture recommandée

````
app
 ├── page.tsx		// page principale (/)
 ├── layout.tsx		// layout global
 ├── not-found.tsx	// page 404
 ├── loading.tsx	// composant de loading éventuel
 │
 ├── user
 │   └── page.tsx	// page correspondant à la route /user
 │
 ├── products	
 │   ├── page.tsx	// page correspondante à la route /products
 │   └── [productId]
 │            └── page.tsx	// page correspondante à la route /products/<productId>
 │
 ├── api		// répertoire contenant les api
 │    └── healthcheck
 │            └── route.ts
 │
components
 ├── ui		// Contient les boutons, inputs et autres éléments UI communs à toute l'application
 │
assets		// Contient les images que l'on ne souhaite pas exposer publiquement via une url (icones...)
 │
helpers		// Contient les services custom
 │
lib		// Contient les custom hooks
 │
styles
 ├── app.scss	// remplace le global.scss
 ├── colors.scss
 ├── button.scss
 ├── input.scss
 ├── custom.scss
 ├── settings.scss
````

### Noeud de routage

Dans certains cas on veut pouvoir avoir un layout différent entre plusieurs routes, c'est à dire empêcher l'héritage du layout principal sur toutes les pages. Pour ce faire on utilise des noms de répertoire avec des ````( )````. Un répertoire avec des parenthèse n'est pas considéré comme un segment de route, mais uniquement comme un "noeud de routage".

Dans l'exemple ci-dessous, on souhaite dissocier la partie authentification des autres pages du site, car elle se différencie avec un layout différent. On créé donc 2 noeuds de routage ````(auth) et (dashboard)```` qui possèdent chacun leur layout.

````
app
├── (auth)
│     ├── auth
│         ├── [...not-found]
│         │          └── page.tsx
│         ├── layout.tsx	// layout spécifique pour la route auth
│         ├── not-found.tsx
│         ├── page.tsx		// correspond à la route (/auth)
│         └── register           
│                └── page.tsx	// correspond à la route (/auth/register)
└── (dashboard)
    ├── [...not-found]
    │       └── page.tsx
    ├── page.tsx	// correspond à la route (/)
    ├── layout.tsx	// layout global
    ├── not-found.tsx
    └── user
          └── page.tsx	// correspond à la route (/user)

````

les nom de répertoire avec ( ) sont à considérer comme des "noeud" de routage pour séparer les layouts. 
Ils ne sont pas considérés comme des routes mais permettent aux routes de ne pas partager les même layout. 
Sans ça, le layout principal sera appliqués sur toutes les pages 

## Sass

<details>
  <summary>Configurer le projet en mode sass</summary>

````
npm install --save-dev sass
````

*next.config.mjs*
````typescript
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};

export default nextConfig;
````

OU *next.config.ts*

````typescript
/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {  
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
};
module.exports = nextConfig;
````

*app.scss*
````css
@import '~bootstrap/scss/functions'; // bootstrap
@import '~bootstrap/scss/variables'; // bootstrap
@import '~bootstrap/scss/mixins/_breakpoints'; // bootstrap
@import './buttons';
// Tous les autres imports fichiers locaux sass
@import './inputs'; 
@import './custom'; 
@import './colors'; 

// import du fichier principal de la librairie bootstrap 
// (provenant de node_modules)
@import '~bootstrap/scss/bootstrap';

// ... définition des styles
````

</details>

## Build

Lors du build, Next analyse le code de l'application, et en fonction de ce qu'il va trouver, il va choisir le mode de rendu optimal (Server, Static, SSG, ISR).

La compilation Next va construire les ressources et les ajouter dans le répertoire *.next*. Pour exporter le contenu, il faut utiliser la commande

````
npx next export 
````

-> Génère un répertoire *.out* qu'on va poser sur le serveur

## Variables d'environnement

les variables d'environnement sont **par défaut accessibles uniquement serveur**. Afin de pouvoir les utiliser côté client, il faut les préfixer par ````NEXT_PUBLIC_````

*.env.production*
````
URL_PREFIX="https://www.hello.com"
BASE_PATH="/hello"
NEXT_PUBLIC_BASE_URL="https://www.hello.com/my-app"
NEXT_PUBLIC_API_URL="https://www.hello.com/api/"

````

## Runtime

<details>
	<summary>Gérer le type de runtime selon l'OS de la machine</summary>

En fonction de la machine sur laquelle est déployée l'application (window, mac, linux) il est possible que certaines fonctionnalités ne soient pas accessibles (ex : gestion des cookies).
Ceci est du à un bug lié au mode **runtime** (par défaut "nodejs"). 

*page.tsx*
````typescript
// à positionner APRES tous les imports
export const runtime = "edge" // pour une machine mac / linux;
````

</details>

## NextTopLoader

<details>
	<summary>Gérer un indicateur de chargement de page avec toploader</summary>

https://www.npmjs.com/package/nextjs-toploader

Alternative : https://github.com/Skyleen77/next-nprogress-bar

````
npm i nextjs-toploader
````

### Utilisation

Dans le layout principal ajouter la balise NextTopLoader dans le body

````typescript
import NextTopLoader from "nextjs-toploader";

return (
    <html lang="en">
      <body className={inter.className}>
	  
        <NextTopLoader />
		
        <HeaderWrapper />
        <div className="main-wrapper">{children}</div>
        <Footer />
      </body>
    </html>
  );
````

### Bug des liens de type anchor "#"

Un clic sur des liens de type "#" déclenche le toploader alors qu'on ne navigue sur aucune page. Pour contourner ce bug :

````typescript
  const handlePaginationClick = (e, page: number) => {
    e.preventDefault();		// trick
    e.nativeEvent.stopImmediatePropagation();	// trick

    // traitement callback custom
    onPageChange(page);
  }
  
  
   <Pagination.Item
	key={index}
	active={page === currentPage}
	onClick={(e) => handlePaginationClick(e, page)}
  >
	{page}
  </Pagination.Item>
````

</details>

## Référencement

<details>
  <summary>Gérer le référencement des pages</summary>

Le code suivant permet d'écarter des pages du référencement google ou autre

````typescript
export function generateMetadata(): Metadata {
  return {
    robots: {
      follow: false,
      index: false,
    },
  };
}
````

</details>


# Next 13

https://blog.logrocket.com/next-js-13-app-directory/       
https://stackoverflow.blog/2022/12/20/best-practices-to-increase-the-speed-for-next-js-apps/       
https://codedamn.com/news/nextjs/next-js-best-practices       

# OLD Next 12

<details>
  <summary>Différences Next 12 / Next 13</summary>

## Fonctionnement

React 18 et Next 12 introduisent une version alpha des composants serveur React. Les composants serveur sont entièrement rendus sur le serveur et ne nécessitent pas de JavaScript côté client pour être rendus. De plus, les composants serveur permettent aux développeurs de conserver une certaine logique sur le serveur et d'envoyer uniquement le résultat de cette logique au client. Cela réduit la taille du bundle envoyé au client et améliore les performances de rendu côté client.

Avec NextJS, il est possible de déclarer des composants **serveur** et des composants **clients**. Il est important de se rappeler que toutes les fonctions qui s'exécutentt habituellement côté client ne sont pas accessibles côté serveur. Par exemple l'appel à ````window.xxxx```` ne pourra pas s'effectuer dans un composant déclaré comme composant serveur.
De la même manière, il n'y a pas d'état ou de reducer (useState, useReducer) dans les composants côté serveur, intératctions avec un formulaire ou bien même d'intéractions avec le dom.

Si on a besoin d'un state ou d'un reducer, alors il faut définir son composant comme étant un composant **client**.

````typescript
'use client'; // <-- déclarer le composant comme étant "client"

export default MyCompo = () => {

}
````

https://www.youtube.com/watch?v=6aP9nyTcd44&ab_channel=SonnySangha

Depuis Next 13 l'arborescence fichier intègre un répertoire **app** dont le but est de contenir les *layouts*, *routes imbriquées*,
et il utilise les **composants serveurs par défaut**.

A l'intérieur de ce répertoire, il est possible de faire des requêtes http pour l'ensemble de l'application

Dans Next, une **page** est un composant React, c'est donc dans le répertoire **pages** qu'il faut créer les composants React. A noter que **chaque page est
associée à une route** basée sur le nom du fichier.

Pour gérer les routes dynamiques, le nom du fichier devra avoir la syntaxe suivante ````pages/posts/[id].tsx````

Par défaut, Next pré-rend chaque page, ce qui signifie que Next créé le HTMl des pages en avance, au lieu d'attendre que ce soit fait côté client. Ceci améliore les performance.

Chaque page HTML générée est associée à un code JS minimal. Quand la page est chargée par le navigateur, le JS est exécuté et la page est ensuire rendue entièrement intéractive.

Next utilise 2 formes de pré-rendu

**Static generation (recommended)** : Le HTML est généré à la compilation et réutilisé à chaque requête. Plus performant car les 
pages peuvent être mises en cache dans le CDN. **Il est conseillé d'utiliser la génération statique le plus possible**. Pour savoir quand utiliser la génération statique, il suffit de se poser la question
"Puis-je pré-afficher cette page avant la demande d'un utilisateur ?" Si la réponse est oui, alors vous devriez choisir la génération statique

**SSR** : HTML généré à chaque requête. **A utiliser pour les pages nécessitant de rafraichir fréquemment les données et si le contenu de la page est amené à changer à chaque requête**

## Génération page statique avec données

Pour pouvoir générer des pages statiques utilisant des données provenant d'une API, Next doit exporter une fonction asynchrone qui s'appelle **getStaticProps** dans le **même fichier** que le composant.

Cette fonction sera appelée lors de la compilation et permettra de passer des données provenant d'une API aux ````props```` de la page à pré-rendre.

````tsx
export default function Blog({ posts }) {
  // Render posts...
}

// This function gets called at build time
export async function getStaticProps() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      posts,
    },
  }
}
````

## Génération SSR

Pour utiliser une page en mode SSR, il faut exporter la fonction asynchrone **getServerSideProps**. Cette fonction sera appelée par le serveur à chaque requête.

Par exemple si une page a besoin de rafraichir fréquemment les données depuis une API, on pourrait écrire le code de la manière suivante :

````tsx
export default function Page({ data }) {
  // Render data...
}

// This gets called on every request
export async function getServerSideProps() {
  // Fetch data from external API
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  // Pass data to the page via props
  return { props: { data } }
}
````

## A Retenir

* Génération statique (recommandée) : le code HTML est généré au moment de la compilation et sera réutilisé à chaque requête. Pour qu'une page utilise la génération statique, exportez le composant de la page ou exportez **getStaticProps** (et **getStaticPaths** si nécessaire). C'est idéal pour les pages qui peuvent être pré-rendues avant la demande d'un utilisateur. Vous pouvez également l'utiliser avec le rendu côté client pour apporter des données supplémentaires.

* Rendu côté serveur : le code HTML est généré à chaque requête. Pour qu'une page utilise le rendu côté serveur, exportez **getServerSideProps**. Étant donné que le rendu côté serveur entraîne des performances plus lentes que la génération statique, utilisez-le uniquement si cela est absolument nécessaire.

- getStaticProps : exécutée une fois lors de la compilation pour chaque chemin retourné pendant la compilation
- getStaticProps : exécutée en arrière-plan quand le paramètre fallback: true
- getStaticProps : exécutée avant le rendu initial quand le paramètre fallback: blocking
- getStaticPaths : exécutée une fois lors de la compilation
- getStaticPaths doit être utilisé avec getServerSideProps et ne peut pas être utilisé avec getServerSideProps
- en **mode développement**, getStaticPaths et getStaticProps sont exécutées à **chaque** requête
- getServerSideProps : exécutée à chaque requête

### getServerSideProps

La fonction ````getServerSideProps```` est executée à chaque requête est ne peut pas être exécutée côté client.

* Lorsque vous demandez directement cette page, getServerSideProps s'exécute au moment de la demande et cette page sera pré-rendue avec les accessoires renvoyés

* Lorsque vous demandez cette page sur les transitions de page côté client via suivant/lien ou suivant/routeur, Next.js envoie une requête API au serveur, qui exécute getServerSideProps
````getServerSideProps```` renvoie JSON qui sera utilisé pour rendre la page. Tout ce travail sera géré automatiquement par Next.js, vous n'avez donc rien à faire de plus tant que vous avez défini getServerSideProps.

````getServerSideProps```` ne peut être exporté qu'à partir d'une page. Vous ne pouvez pas l'exporter à partir de fichiers non page.

Notez que vous devez exporter ````getServerSideProps```` en tant que fonction standalone — cela ne fonctionnera pas si vous ajoutez ````getServerSideProps```` en tant que propriété du composant de page.

Vous ne **devez utiliser getServerSideProps que si vous avez besoin d'afficher une page dont les données doivent être récupérées au moment de la demande**. Cela peut être dû à la nature des données ou des propriétés de la demande (telles que les en-têtes d'autorisation ou la géolocalisation)

### Mise en cache avec SSR

Il est possible d'ajouter un en-tête à ````getServerSideProps```` pour lui indiquer de mettre en cache la réponse

````typescript
// This value is considered fresh for ten seconds (s-maxage=10).
// If a request is repeated within the next 10 seconds, the previously
// cached value will still be fresh. If the request is repeated before 59 seconds,
// the cached value will be stale but still render (stale-while-revalidate=59).
//
// In the background, a revalidation request will be made to populate the cache
// with a fresh value. If you refresh the page, you will see the new value.
export async function getServerSideProps({ req, res }) {
  res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=59'
  )

  return {
    props: {},
  }
}
````

### Gestion des erreurs

Lorsqu'une erreur est levée par ````getServerSideProps````, la page ````pages/500.js```` est déclenchée.

### getStaticPaths

Quand utiliser la fonction ````getStaticPaths```` ?

- Les données proviennent d'un CMS sans tête
- Les données proviennent d'une base de données
- Les données proviennent du système de fichiers
- Les données peuvent être mises en cache publiquement (non spécifiques à l'utilisateur)
- La page doit être pré-rendu (pour le référencement) et être très rapide — getStaticProps génère des fichiers HTML et JSON, qui peuvent tous deux être mis en cache par un CDN pour des performances

### getStaticProps

La fonction ````getServerSideProps```` ne peut être exécutée que côté **serveur**. Elle ne peut pas être exécuté côté client et ne sera même pas inclue dans le bundle navigateur.
  
</details>

## Type générique T

Voici comment écrire une arrow fonction avec type ````<T>```` dans un fichier TSX

````typescript
// méthode classique avec function
function useSortableData<T>(items: T[], config = null) { }

// méthode avec arrow function
const useSortableDataT = <T,>(items: T[], config = null) => { }


// Appel
const { items, requestSort, getClassNamesFor } = useSortableData<AddressDTO>(data ?? []);
````

**Explication** : Les fichiers TSX interprètent les balises html, de fait, déclarer le type générique avec ````<T>```` dans une arrow fonction lève une erreur. Il est donc nécessaire de lui ajouter ````,```` si l'on souhaite utiliser l'écriture arrow function

## Configuration ESlint

<details>
	<summary>Exemple de fichier .eslintrc.json</summary>

*.eslintrc.json*
````json
{
  "extends": "next/core-web-vitals",
  "rules": {
    "react/react-in-jsx-scope": 0,
    "react/display-name": 0,
    "react/prop-types": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/explicit-member-accessibility": 0,
    "@typescript-eslint/indent": 0,
    "@typescript-eslint/member-delimiter-style": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-var-requires": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "no-console": [
      2,
      {
        "allow": ["warn", "error"]
      }
    ]
  }
}

````

</details>

