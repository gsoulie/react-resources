[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Généralités

* [Navigation](#navigation)     

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
npx create-next-app@latest --typescript myApp

> src/ directory ? No
> App Router ? No  // Yes = génère le répertoire app sans répertoire pages
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

# Next 13

https://blog.logrocket.com/next-js-13-app-directory/       
https://stackoverflow.blog/2022/12/20/best-practices-to-increase-the-speed-for-next-js-apps/       
https://codedamn.com/news/nextjs/next-js-best-practices       

# OLD Next 12

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

## Navigation

Next est un meta-framework orienté **file-based routing**. Les pages sont associées à une route en fonction de leur nom de fichier. Par exemple, en développement :

````pages/index.js```` est associé à la route ````/````.     
````pages/posts/first-post.js```` est associé à la route ````/posts/first-post````.     
Nous avons déjà le fichier ````pages/index.js````, alors créons ````pages/posts/first-post.js```` pour voir comment cela fonctionne.



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

### Route dynamique d'une page statique

Dans le cas ou la route de la page à charger est dynamique ````pages/posts/[id].tsx```` et qu'elle dépend de données externes (api...), il faut pouvoir connaître l'id à passer à la route dynamique.

Il faudra alors exporter la fonction asynchrone **getStaticPaths** qui sera appelée lors de la compilation

````tsx
// This function gets called at build time
export async function getStaticPaths() {
  // Call an external API endpoint to get posts
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // Get the paths we want to pre-render based on posts
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}
````

Il faut aussi dans la page dynamique, exporter **getStaticProps** pour pouvoir requêter les données associées à l'id

````tsx
export default function Post({ post }) {
  // Render post...
}

export async function getStaticPaths() {
  // ...
}

// This also gets called at build time
export async function getStaticProps({ params }) {
  // params contains the post `id`.
  // If the route is like /posts/1, then params.id is 1
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  // Pass post data to the page via props
  return { props: { post } }
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
