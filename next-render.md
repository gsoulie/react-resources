[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Pré-rendu

* [getStaticProps](#getstaticprops)
* [getServerSideProps](#getserversideprops)
* [Création des api](#création-des-api)

## Introduction 

*useEffect* s'exécute **APRES** le premier rendu de la page. Lorsqu'on regarde le code source la page, on ne voit pas de données dans la page. Le pré-rendu construit la page lors du premier cycle de rendu,
et non après le second cycle. En explorant le code source de la page, cette dernière ne contient pas les données, ceci est une bonne chose pour le SEO mais pas pour le référencement.

1 - pré-rendu de la page : 1er cycle de rendu
2 - hydratation : 2ème cycle de rendu

**Il existe 2 types de rendus :**

* **rendu statique** (SSG Static Site Generating): réalisé lors du **build** du projet ````npm run build````, pas de modification de la page à l'exécution, pas d'hydratation. Il faut re-compiler si l'on souhaite modifier le contenu de la page
* **rendu SSR** : réalisé à la volée lors de l'exécution

**Par défaut**, Next génère les pages en mode **statique**

## getStaticProps

<details>
  <summary>Fonction getStaticProps()</summary>

  ````getStaticProps()```` est une fonction asynchrone qui peut être exportée **uniquement** depuis les composants du répertoire **pages**. Elle est utilisée pour générer 
des données lors de la **compilation** (jamais exécutée depuis le client ou le serveur). Elle récupère les données et génère les pages HTML sur le serveur et les met en cache.

C'est l'une des fonctions **les plus utilisée** avec NextJS. Elle permet de : charger du code depuis une API, charger le contenu d'un fichier... **La page est donc générée statiquement est mise en cache**

La fonction getStaticProps **doit toujours retourner un objet** ayant à minima la clé ````props````

````typescript
return {
	props: {	// obligatoire !
		products: DUMMY_PRODUCTS	// example
	}
}
````

Cet objet *props* sera passé en paramètre du composant associé

````typescript
export const HomePage = (props) => {

	return <MeetupList meetups={props.meetups} />
}

export const getStaticProps = async (context) => {

	// ... fetching data from API
	const data....

	return {
		props: {
			meetups: data 
		}
	}
}
````

**Paramètre context**

Le paramètre *context* permet de récupérer les paramètres d'url (ici productId si la route est la suivante [productId]/index.ts) 

````typescript
export async function getStaticProps(context) {
	
	const productId = context.params.productId;
	
}
````

### Fonction getStaticPaths

La fonction getStaticPaths doit **obligatoirement** être exportée dans les composants issus d'une route *dynamique* ([productId]/index.ts). En effet, le code contenu dans la fonction ````getStaticProps```` est exécuté pendant la phase de **compilation**.
Par conséquent, il ne peut pas connaître et générer à l'avance toutes les pages statiques correspondant à tous les identifiants dynamiques.

Il faut donc ajouter la fonction getStaticPaths 

````typescript
export async function getStaticPaths() {
	return {
		paths: [{ // tableau contenant 1 objet par paramètre dynamique dans le chemin 
			params: {
				productId
			}
		}],
		fallback: true
	}
}	
````

La propriété **fallback** permet de *pré-générer* les pages pour certaines valeurs spécifiques (ex : pré-générer les pages les plus fréquemment servies) et de générer dynamiquement les autres.

* Si la propriété **fallback** est à *false*, celà indique que *paths* contient TOUTES les valeurs dynamiques autorisées. Si l'utilisateur saisi une autre valeur, alors il sera redirigé vers une page 404.
* Si la propriété **fallback** est à *true*, celà indique que *paths* ne contient que quelques-unes des valeurs autorisées. Si l'utilisateur saisi un autre valeur, alors react essayera de générer les pages dynamiquement sur le serveur pour la valeur demandée

### Propriété revalidate

**L'inconvénient majeur** du rendu statique et que si les données venaient à changer en base, la page ne serait pas réactualisée. Il faudrait alors re-compiler et re-déployer l'application pour mettre à jour les données car **pour rappel**, la fonction *getStaticProps* est
**exécutée lors de la compilation**

Pour pallier à cette problématique, la propriété ````revalidate```` permet d'activer la fonctionnalité **incremental static generation**. Cette propriété est un nombre de secondes pour lequel Next va attendre avant de regénérer la page après réception de requêtes entrantes.
Ce qui veut dire qu'une page sera réactualisée toutes les X secondes à chaque fois qu'elle sera demandée. 

````typescript
return {
		props: {
			meetups: data 
		},
		revalidate: 5	// ex : 3600 si les données sont mises à jour toutes les heures
	}
````

</details>

## getServerSideProps

<details>
  <summary>Fonction getServerSideProps()</summary>

  La fonction ````getServerSideProps```` est une fonction asynchrone **exécutée uniquement côté serveur après déploiement**. Elle est **exécutée à chaque requête pour la page** et fonctionne comme la fonction getStaticProps, dans le sens ou elle doit retourner aussi un objet avec l'attribut props

````typescript
export const getServerSideProps = async (context) => {

	const req = context.req;
	const res = context.res;
	
	// ... fetching data from API
	const data....

	return {
		props: {
			meetups: data 
		}
	}
}
````

````getStaticProps()```` est plus appropriée dans les cas où les données de la page ne sont pas souvent mises à jour. A l'inverse, si les données doivent être actualisées à chaque demande de la page, alors il faut privilégier l'usage de ````getServerSideProps````

**Paramètre context**

> ATTENTION : dans la fonction getServerSideProps, le paramètre **context** ne retourne pas les mêmes éléments que dans la fonction getStaticProps

### récupérer les params et searchparams depuis les props

Dans les dernières versions de Next, il est possible de récupérer les *params* et *searchParams* directement dans les props d'une page avec le code suivant :

````typescript
export default Page({params, searchParams}: {params: { userId: string}, searchParams: {[key: string]: string | string[] | undefined};})
````

**Peut être simplifié et factorisable avec la réécriture suivante**

````typescript
type PageProps<T> = {
	params: T,
	searchParams: {[key: string]: string | string [] | undefined};
}

export default Page({params, searchParams}: PageProps<{userId: string}>)
````

</details>

## Création des Api

<details>
  <summary>Créer des api et couplage avec Firebase</summary>

  La création des api se fait en utilisant le répertoire **pages/api**. Un fichier dans ce répertoire représente une api

````
pages
  |
  + api
     |
	 + products.ts
	 + new-product.ts
```` 

Donnera les apis : */api/products* et */api/new-products*

### Couplage Firebase

La première étape consiste à créer le projet dans la Firebase Console, à récupérer la configuration puis à installer le package firebase

````
npm i firebase
````

**Configuration**

* Création d'un fichier ````.env```` à la racine du projet pour y stocker les credentials

*.env*
````
NEXT_PUBLIC_FIREBASE_API_KEY="<your_api_key>"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="<your_firebase_data>"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="<your_firebase_data>"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="<your_firebase_data>"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="<your_firebase_data>"
NEXT_PUBLIC_FIREBASE_APP_ID="<your_firebase_data>"
````

* Création d'un fichier de configuration à la racine du projet pour initialiser la bdd

*config.ts*
````typescript
import { initializeApp } from "firebase/app"
import { getFirestore} from "firebase/firestore"

const firebaseConfig = {
	apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
	authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
	storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
````

#### Api POST

#### Fetching data
</details>
