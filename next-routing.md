[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Routing

* [Structure](#structure)
* [Routes dynamiques](#routes-dynamiques)
* [Navigation](#navigation)
* [Récupéartion paramètre url](#récupération-paramètre-url)
* [Routage multiple avec page unique](#routage-multiple-avec-page-unique)
* [Gérer la classe css lien actif](#gérer-la-classe-css-lien-actif)
* [Paramètres dynamique de route api](#paramètres-dynamique-de-route-api)
* [Redirection URL 300](#redirection-url-300)      

## Structure

<details>
	<summary>Routage par arborescence</summary>
	
chaque répertoire représente un niveau de la route. Dans chaque répertoire, c'est le fichier ````index.tsx```` qui représente la page principale. Chaque autre fichier tsx présent représente un sous-niveau

````
pages
  |
  + index.tsx // représente la route /
  |
  + news
      |
      + index.tsx // réprésente la route /news
      |
      + other.tsx // représente la route /news/other
 
````

**Ceci étant équivalent à cette structure**

````
pages
  |
  + index.tsx // représente la route /
  |
  + news
     |
     + index.tsx // réprésente la route /news
     |
     + other
         |
         + index.tsx // représente la route /news/other
 
````

</details>

## Routes dynamiques

<details>
	<summary>Définir des routes dynamiques</summary>

Pour gérer les pages dynamiques, équivalent à une route de type ````/news/:id````, il faut renommer la page dynamique (le fichier ou le répertoire) en utilisant des crochets ````[]````

````
pages
  |
  + index.tsx // représente la route /
  |
  + news
      |
      + index.tsx // réprésente la route /news
      |
      + [newsId].tsx // représente la route /news/1
  |
  + [productId]
         |
	 + index.tsx	// représente la route /1
 
````

</details>

<details>
	<summary>Extraire les paramètres de la route avec useRouter</summary>

Pour récupérer le paramètre de la route dynamique suivante ````[newsId].tsx```` il suffit d'utiliser le hook *useRouter*	
````typescript
import {useRouter } from 'next/router';

const router = useRouter();
const id = router.query.newsId;	// nom spécifié entre les []. ici [newsId]

````
</details>

## Navigation

<details>
	<summary>Naviguer avec Link</summary>

Next propose aussi un balise ````<Link>```` comme *react-router-dom* pour la navigation mais celle ci utilise l'attribut ````href```` au lieu de *to*
	
````typescript
<li>
	<Link href={"/news/" + 1}>News 1</Link>
<li>
````

Gérer une classe "active" 

````typescript
'use client'
 
import { usePathname } from 'next/navigation'
import Link from 'next/link'
 
export function Links() {
  const pathname = usePathname()
 
  return (
    <nav>
      <ul>
        <li>
          <Link className={`link ${pathname === '/' ? 'active' : ''}`} href="/">
            Home
          </Link>
        </li>
        <li>
          <Link
            className={`link ${pathname === '/about' ? 'active' : ''}`}
            href="/about"
          >
            About
          </Link>
        </li>
      </ul>
    </nav>
  )
}
````

**Naviguer par code**

````typescript
const router = useRouter();
router.push('/details' + props.id);
````

</details>

## Récupération des searchParams

> Important : **searchParams** est un mot clé réservé

Récupération des paramètres définits dans la chaîne d'une route ````<Link href="/?mode=signin">Login with existing account.</Link>````

<details>
	<summary>Lire les paramètres d'url "?<param>&<param>"</summary>

*page.tsx*
````typescript
export default async function Page({ searchParams }: { searchParams: any }) {

	const { mode } = await searchParams;	// récupération par destructuration
	// écriture alternative
  	const mode = await searchParams.mode || <valeur_par_defaut>;

	retrun <h1>{searchParams.hello}</h1>
}
````

Avec l'url suivante : **localhost:3000/?hello=world** retournera "world"
 
</details>

## Récupération paramètre url

Route type : ````/filters/profession/[professionId]/domain/[domainId]/subDomain/[subDomainId]````

````
filters
├── profession
│       └── [professionId]
│                 ├── page.tsx
│   	          │
│                 └── domain
│                       └── [domainId]
│                               ├── page.tsx
│					            └── subDomain
│                                       └── [subDomainId]
│                                                 └── page.tsx
````

composant page : 

> Important : **params** est un mot clé réservé

Récupération des paramètres d'une route ````app/product/[id]/page.tsx````

````typescript
const ProductPage = async ({ params }: { params: any }) => {
  const { id } = await params;	// doit avoir le même nom que le répertoire de l'arborescence
````

composant client

````typescript
export const FilterClient = (props: any) => {

  const { professionId, domainId, subDomainId } = props?.params || null;  // récupération par destructuration
}
````

[Back top top](#routing)    

## Routage multiple avec page unique

<details>
	<summary>Dans certains cas, on peut vouloir accéder à une même page depuis différentes routes (afin d'éviter de créer plusieurs pages identiques et 
avoir un chargement pour chacune)
</summary>

 Soit les routes suivantes :

/search/product/profession/12345
/search/product/profession/12345/domain/445
/search/product/profession/12345/domain/445/subDomain/6

On souhaite que toute ces routes pointent vers la même page, mais exécutent une requête différente en fonction des paramètres fournis

Pour éviter de créer 3 pages qui feraient la même chose, et n'ayant que la requête de fetch différente, il suffit de créer l'arborescence suivante :

app/search/product/[[...params]]/page.tsx

ATTENTION les paramètres sont récupérés sous forme d'un tableau ['profession', '12345', 'domain', '445', 'subDomain', '6']

````typescript
const page = async ({ params }) => {
  console.log("params", params);

  return (
    <>
      ...
    </>
  );
};
export default page;
````

</details>


## Gérer la classe css lien actif

<details>
	<summary>Implémentation</summary>

````typescript
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import React from "react";

export const NarvbarLink = ({ text, href }: { text: string; href: string }) => {
  const segment = useSelectedLayoutSegment();
  
  const unactiveLink =
    "border-b-1 border-transparent hover:border-b-1 hover:border-red-700 duration-200";
  const activeLink = "border-b-2 border-red-700 duration-200";

  const handleGetLastUrlSegment = (url: string): string => {
    const urlSegments = url.split("/");
    const urlFinalSegment = urlSegments[urlSegments.length - 1];
    return urlFinalSegment;
  };

  const getCssClass = (): string => {
    return segment === handleGetLastUrlSegment(href)
      ? activeLink
      : unactiveLink;
  };

  return (
    <Link href={href} className={getCssClass()}>
      {text}
    </Link>
  );
};


<NarvbarLink text="dashboard" href="/dashboard" />
<NarvbarLink text="products" href="/products" />
<NarvbarLink text="contact" href="/contact" />
````
 
</details>


## Paramètres dynamique de route api

Il est aussi possible de faire du paramétrage dynamique de route api, le fonctionnement reste le même 

````app/api/product/[id]/route.ts````

````typescript
export async function GET(req: Request, { params }: { params: { id: string } }) {
	const { id } = await params
}
````

## Redirection URL 300

*next.config.js*
````typescript
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/my-url-to-redirect',
        destination: '/my-new-url',
        statusCode: 301
      }
    ]
  }
};

module.exports = nextConfig;
````
