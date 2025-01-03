
[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Udemy : NextJS The Complete Guide

* [Bonnes pratiques](#bonnes-pratiques)
* [Forms](#forms)
* [Bdd sqlite](#bdd-sqlite)
* [Plugin SLUGIFY](#plugin-slugify)
* [Plugin Xss](#plugin-xss)
* [Routes parallèles](#routes-parallèles)
* [Routes catch all](#routes-catch-all)
* [Interception route](#interception-route)
* [Routes groupées](#routes-groupées)
* [Data fetching](#data-fetching)
* [Server actions](#server-actions)
* [Mises à jour optimistes](#mises-à-jour-optimistes)     

## Bonnes pratiques

- répertoire *components* en dehors de *app* => Plus claire de garder app uniquement pour les pages

- répertoire *actions* pour loger les server actions

- nommage des fichiers page et composants en minuscule et snake-case

- Utiliser la fonction ````notFound()```` pour les redirections en cas d'échec de fetch d'une ressource

- récupération des paramètres de route 

*/blog/[slug]/page.tsx*
````typescript
const BlogPost = async ({ params }: { params: { slug: string } }) => {
  const { slug } = await params;

  return (
    <main>
      <h1>Blog post</h1>
      <p>{slug}</p>
    </main>
  );
};

export default BlogPost;
````

- nommage des composants *page.tsx* suffixés par Page
````typescript
const CommunityPage = () => {
  return <div>Community</div>;
};

export default CommunityPage;
````

- utilisation simple des images : 

````typescript
import logoImg from "@/assets/logo.png";

<Image src={logoImg.src} alt="logo" />
````
- customiser une couleur à la volée dans *tailwind*

````typescript
<div className="text-[#ddd6cb]">
````

- destructurer les paramètres

*remplacer*
````typescript
<MealItem
            title={m.title}
            summary={m.summary}
            creator={m.creator}
            slug={m.id}
            image={m.image}
          />
````

*par*

````typescript
<MealItem {...meal}/>
````


- *loading.tsx* est un mot clé réservé. Si cette page est créée au niveau *app/* elle sera appliquée pour toutes les routes. Il est possible 
de définir un loading.tsx pour chaque route si nécessaire et donc de le créer dans le chemin souhaité

L'uitilisation d'un *loading.tsx* va avoir pour conséquence d'afficher un composant loading en pleine page (et donc masquer tout le reste)

L'utilisation de ````<Suspense>```` pour gérer les états de loading, permet d'afficher un loading dans une portion du layout affiché

- *error.tsx* : idem *loading.tsx*

- *not-found.tsx* : idem *loading.tsx*, permet de gérer les 404 au niveau souhaité

L'utilisation de la fonction ````notFound()```` de ````next/navigation````, permet de renvoyer la page *not-found.tsx* ou *error.tsx* la plus proche dans l'arborescence

````typescript
 const meal = getMeal(slug) as Meal;

  if (!meal) {
    notFound();
  }
````

- cache validation : **notion très importante**, lors de la compilation pour déploiement, next va générer un certain nombre de chose en statique et va faire de la mise en cache aggressive.
Ceci est une très bonne chose pour tous les contenus statiques, mais pose un réel problème pour les contenus dont les data peuvent changer. En effet les pages sont pré-rendues et les fetch ne seront plus rééeexécutés !

pour revalider le cache, on peut donc utiliser ````revalidatePath(<url>, <'page' | 'layout'>)````

Dans notre exemple, lors de l'ajout d'un nouvel item, on souhaite revalider le cache lors de l'ajout pour actualiser
la liste des items avant redirection

*actions/meal-action*
````
export const shareMeal = async (prevState, formData: FormData): Promise<{ message: string | null }> => {
// ...
	
  // revalider le cache pour permettre la mise à jour des données une fois déployé en prod
  revalidatePath('/meals', 'layout')

  redirect('/meals');
}
````

L'option 'page' ou 'layout' : pour modifier le type de chemin à revalider. Si le chemin contient un segment dynamique (par exemple, /product/[slug]/page), ce paramètre est requis.
Si le chemin fait référence au segment de route littéral, par exemple /product/1 pour une page dynamique (par exemple, /product/[slug]/page), 
vous ne devez pas fournir de type."

````revalidatePath('/', 'layout')```` revalidera le cache pour l'intégralité des pages du site

- metadata dynamiques : 

*static metadata*
````
export const metadata: Metadata = {
  title: "All meals",
  description: "Browse all meals",
};
````

*dynamic metadata*
````
export generateMetadata = async({params}) => {
  const { slug } = await params;

  const meal = getMeal(slug) as Meal;
  
  if(!meal) {
	notFound();
  }
  
	return {
		title: meal.title,
		description: meal.summary
	}
}
````

## FORMS

- forms action : envoyer le contenu d'un formulaire via une action serveur

*actions/meal-action.ts*
````typescript
"use server"

export const shareMeal = async (formData: FormData) => {
  const image = formData.get("image");
  if (!(image instanceof File)) {
    throw new Error("Invalid image file");
  }

  const newMeal: Meal = {
    title: formData.get("title")?.toString() ?? "",
    image: image,
    creator: formData.get("name")?.toString() ?? "",
    creatorEmail: formData.get("email")?.toString() ?? "",
    summary: formData.get("summary")?.toString() ?? "",
    instructions: formData.get("instructions")?.toString() ?? "",
  };

  // Enregistrement en BDD
  await saveMeal(newMeal);

  redirect('/meals');
}
  
````

*Component.tsx*
````
<form action={shareMeal}>
  ...
  </form>
  ````

- hook useFormStatus() 

- ajout server-side field validation : la validation "required" des champs d'un formulaire côté client n'est pas assez sécurisée.
En effet, il est possible désactiver l'attribut required d'un champs depuis la console developer.
Pour sécuriser celà, il est bon d'ajouter une validation côté serveur

voici le nouveau code de la server action précédente :

*actions/meal-action*
````
const isInvalidText = (text: string): boolean => {
  return !text || text.trim() === '';
}

export const shareMeal = async (prevState, formData: FormData): Promise<{ message: string | null }> => {
  const image = formData.get("image");
  if (!(image instanceof File)) {
    throw new Error("Invalid image file");
  }

  const newMeal: Meal = {
    title: formData.get("title")?.toString() ?? "",
    image: image,
    creator: formData.get("name")?.toString() ?? "",
    creatorEmail: formData.get("email")?.toString() ?? "",
    summary: formData.get("summary")?.toString() ?? "",
    instructions: formData.get("instructions")?.toString() ?? "",
  };

  if (isInvalidText(newMeal.title) ||
    isInvalidText(newMeal.summary) ||
    isInvalidText(newMeal.instructions) ||
    isInvalidText(newMeal.creator) ||
    isInvalidText(newMeal.creatorEmail) ||
    !newMeal.creatorEmail.includes('@') ||
    !newMeal.image || newMeal.image.size === 0
  ) {
    return {
      message: 'Invalid input.'
    }
  }

  // Enregistrement en BDD
  await saveMeal(newMeal);

  redirect('/meals');
}
````

*implémentation dans le composant formulaire*
````
import React, { useActionState } from "react";

const SharePage = () => {
  const [state, formAction] = useActionState(shareMeal, { message: null });

  return (

        <form action={formAction}>
		...
		</form>
	)
	}
````



## BDD SQLITE

````typescript
npm i better-sqlite3
````

Créer un fichier *initdb.js* contenant le script de création et insertion des données dans la base

<details>
	<summary>initdb.js</summary>

````typescript
// eslint-disable-next-line @typescript-eslint/no-require-imports
const sql = require("better-sqlite3");
const db = sql("meals.db");

const dummyMeals = [
  {
    title: "Juicy Cheese Burger",
    slug: "juicy-cheese-burger",
    image: "/meals/burger.jpg",
    summary:
      "A mouth-watering burger with a juicy beef patty and melted cheese, served in a soft bun.",
    instructions: `
      1. Prepare the patty:
         Mix 200g of ground beef with salt and pepper. Form into a patty.

      2. Cook the patty:
         Heat a pan with a bit of oil. Cook the patty for 2-3 minutes each side, until browned.

      3. Assemble the burger:
         Toast the burger bun halves. Place lettuce and tomato on the bottom half. Add the cooked patty and top with a slice of cheese.

      4. Serve:
         Complete the assembly with the top bun and serve hot.
    `,
    creator: "John Doe",
    creatorEmail: "johndoe@example.com",
  },
  {
    title: "Spicy Curry",
    slug: "spicy-curry",
    image: "/meals/curry.jpg",
    summary:
      "A rich and spicy curry, infused with exotic spices and creamy coconut milk.",
    instructions: `
      1. Chop vegetables:
         Cut your choice of vegetables into bite-sized pieces.

      2. Sauté vegetables:
         In a pan with oil, sauté the vegetables until they start to soften.

      3. Add curry paste:
         Stir in 2 tablespoons of curry paste and cook for another minute.

      4. Simmer with coconut milk:
         Pour in 500ml of coconut milk and bring to a simmer. Let it cook for about 15 minutes.

      5. Serve:
         Enjoy this creamy curry with rice or bread.
    `,
    creator: "Max Schwarz",
    creatorEmail: "max@example.com",
  },
  {
    title: "Homemade Dumplings",
    slug: "homemade-dumplings",
    image: "/meals/dumplings.jpg",
    summary:
      "Tender dumplings filled with savory meat and vegetables, steamed to perfection.",
    instructions: `
      1. Prepare the filling:
         Mix minced meat, shredded vegetables, and spices.

      2. Fill the dumplings:
         Place a spoonful of filling in the center of each dumpling wrapper. Wet the edges and fold to seal.

      3. Steam the dumplings:
         Arrange dumplings in a steamer. Steam for about 10 minutes.

      4. Serve:
         Enjoy these dumplings hot, with a dipping sauce of your choice.
    `,
    creator: "Emily Chen",
    creatorEmail: "emilychen@example.com",
  },
  {
    title: "Classic Mac n Cheese",
    slug: "classic-mac-n-cheese",
    image: "/meals/macncheese.jpg",
    summary:
      "Creamy and cheesy macaroni, a comforting classic that's always a crowd-pleaser.",
    instructions: `
      1. Cook the macaroni:
         Boil macaroni according to package instructions until al dente.

      2. Prepare cheese sauce:
         In a saucepan, melt butter, add flour, and gradually whisk in milk until thickened. Stir in grated cheese until melted.

      3. Combine:
         Mix the cheese sauce with the drained macaroni.

      4. Bake:
         Transfer to a baking dish, top with breadcrumbs, and bake until golden.

      5. Serve:
         Serve hot, garnished with parsley if desired.
    `,
    creator: "Laura Smith",
    creatorEmail: "laurasmith@example.com",
  },
  {
    title: "Authentic Pizza",
    slug: "authentic-pizza",
    image: "/meals/pizza.jpg",
    summary:
      "Hand-tossed pizza with a tangy tomato sauce, fresh toppings, and melted cheese.",
    instructions: `
      1. Prepare the dough:
         Knead pizza dough and let it rise until doubled in size.

      2. Shape and add toppings:
         Roll out the dough, spread tomato sauce, and add your favorite toppings and cheese.

      3. Bake the pizza:
         Bake in a preheated oven at 220°C for about 15-20 minutes.

      4. Serve:
         Slice hot and enjoy with a sprinkle of basil leaves.
    `,
    creator: "Mario Rossi",
    creatorEmail: "mariorossi@example.com",
  },
  {
    title: "Wiener Schnitzel",
    slug: "wiener-schnitzel",
    image: "/meals/schnitzel.jpg",
    summary:
      "Crispy, golden-brown breaded veal cutlet, a classic Austrian dish.",
    instructions: `
      1. Prepare the veal:
         Pound veal cutlets to an even thickness.

      2. Bread the veal:
         Coat each cutlet in flour, dip in beaten eggs, and then in breadcrumbs.

      3. Fry the schnitzel:
      Heat oil in a pan and fry each schnitzel until golden brown on both sides.

      4. Serve:
      Serve hot with a slice of lemon and a side of potato salad or greens.
 `,
    creator: "Franz Huber",
    creatorEmail: "franzhuber@example.com",
  },
  {
    title: "Fresh Tomato Salad",
    slug: "fresh-tomato-salad",
    image: "/meals/tomato-salad.jpg",
    summary:
      "A light and refreshing salad with ripe tomatoes, fresh basil, and a tangy vinaigrette.",
    instructions: `
      1. Prepare the tomatoes:
        Slice fresh tomatoes and arrange them on a plate.
    
      2. Add herbs and seasoning:
         Sprinkle chopped basil, salt, and pepper over the tomatoes.
    
      3. Dress the salad:
         Drizzle with olive oil and balsamic vinegar.
    
      4. Serve:
         Enjoy this simple, flavorful salad as a side dish or light meal.
    `,
    creator: "Sophia Green",
    creatorEmail: "sophiagreen@example.com",
  },
];

db.prepare(
  `
   CREATE TABLE IF NOT EXISTS meals (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       slug TEXT NOT NULL UNIQUE,
       title TEXT NOT NULL,
       image TEXT NOT NULL,
       summary TEXT NOT NULL,
       instructions TEXT NOT NULL,
       creator TEXT NOT NULL,
       creatorEmail TEXT NOT NULL
    )
`
).run();

async function initData() {
  const stmt = db.prepare(`
      INSERT INTO meals VALUES (
         null,
         @slug,
         @title,
         @image,
         @summary,
         @instructions,
         @creator,
         @creatorEmail
      )
   `);

  for (const meal of dummyMeals) {
    stmt.run(meal);
  }
}

initData();
````
 
</details>

Exécuter le script de création de la bdd : ````node initdb.js````

va créer un fichier *meals.db* dans le projet

## Plugin SLUGIFY

````typescript
npm i slugify
````

L'instruction suivante utilise la fonction slugify pour générer un slug à partir de la propriété meal.title. Un slug est une version simplifiée et optimisée pour les URL d'une chaîne de caractères, souvent utilisée dans les chemins d'accès des pages web.

````typescript
const slug = slugify(meal.title, { lower: true });
````

Fonctionnement détaillé :

* meal.title est une chaîne représentant le titre d'un repas (exemple : "Delicious Pancakes").
* L'option { lower: true } indique que le slug généré doit être entièrement en minuscules.

2-Traitement
La fonction slugify :
* Convertit les espaces en tirets (-).
* Supprime ou remplace les caractères spéciaux (comme les accents).
* Conserve uniquement les caractères alphanumériques et les tirets.
* Applique l'option spécifiée (lower: true) pour mettre tout en minuscules.

3-Sortie :

* Une chaîne de caractères au format URL-friendly (slug).

Exemple :

Cas 1 : cas simple
````
const meal = { title: "Delicious Pancakes" };
const slug = slugify(meal.title, { lower: true });
console.log(slug); // "delicious-pancakes"
````

Cas 2 : Titre avec caractères spéciaux
````
const meal = { title: "Crème Brûlée & Tartes!" };
const slug = slugify(meal.title, { lower: true });
console.log(slug); // "creme-brulee-tartes"
````

## Plugin XSS

````typescript
npm i xss

meal.instructions = xss(meal.instructions);
````
permet de protéger le contenu des attaques XSS en le préparant:

La fonction xss analyse la chaîne et filtre les balises HTML ou attributs dangereux.
Elle conserve uniquement les éléments autorisés (comme <b> ou <p> pour du contenu formaté).
Toute tentative d'injection de scripts ou de styles dangereux est supprimée ou échappée.

## Routes parallèles

En Next.js, les routes parallèles permettent de rendre plusieurs segments ou vues d'une même application de manière indépendante et simultanée. 
Ces segments sont nommés et se trouvent sous un même chemin principal, mais ils servent des contenus distincts.

*Les routes parallèles sont utiles lorsque :*

* On souhaite afficher plusieurs "contextes" ou "panneaux" sur la même page
Par exemple, un panneau montrant des archives anciennes (route @archive) et un autre panneau montrant le contenu le plus récent (route @latest).

* On souhaite gérer différentes sections de ta page de manière indépendante.
Par exemple, si une section affiche une liste d'articles et une autre section affiche un aperçu détaillé d'un article.

pour créer des routes parallèles, il faut créer des répertoires commençants par un ````@```` => ````app/archive/@archive/page.tsx```` et ````app/archive/@latest/page.tsx````.
	
Afin de rendre les routes parallèles dans le même layout, il faut créer un layout prenant en paramètre un paramètre par route parallèle (nommé comme la route parallèle associée) à la place de l'habituel ````children```` (voir code ci-dessous)

<details>
	<summary>Implémentation</summary>

*layout.tsx*
````
const ArchiveLayout = ({
  archive,
  latest,
}: Readonly<{
  archive: React.ReactNode;
  latest: React.ReactNode;
}>) => {
  return (
    <div>
      <h1 className="text-5xl font-extrabold mt-4 mb-4">News Archive</h1>
      <section>{archive}</section>
      <section>{latest}</section>
    </div>
  );
};
````
</details>

Avantages par rapport à l'utilisation d'une page unique avec plusieurs composants :
- vitesse de rendu : le chargement des segments parallèles est asynchrones contrairement à une page comportant plusieurs composants qui sont rendus en simultanés
- isolation des erreurs : si une erreur survient sur l'un des segments, celà n'affectera pas les autres segments

**Attention**

Il est recommandé d'utiliser un fichier *default.tsx* (nom réservé) pour définir un contenu ou un rendu par défaut pour une route parallèle si aucun segment spécifique n'est actif. 
Cela garantit qu'une expérience utilisateur cohérente est fournie même lorsque certaines conditions ne sont pas remplies ou qu'aucune donnée spécifique n'est disponible.

Si vous avez une structure de route parallèle comme celle-ci :
````
/app/archive/@archive/default.tsx
/app/archive/@archive/[year]/page.tsx
````
Le fichier *default.tsx* sera rendu si aucun segment dynamique (comme [year]) n'est actif pour la route @archive.

*default.tsx*
````
export default function DefaultArchive() {
  return <p>Select a year to view the archive.</p>;
}
```` 

## Routes catch all

Imaginons la structure suivante : 

````
app/archive/@archive/page.tsx
app/archive/@archive/[year]/page.tsx
````

La route ````app/archive/@archive/[year]/page.tsx```` nous permet d'afficher les news pour une année donnée. Imaginons que nous souhaiterions préciser notre recherche en rajoutant un niveau nous permettant de filtrer ensuite sur le mois.

Une solution pourrait être de rajouter une route ````app/news/[year]/[month]/page.tsx````. On pourrait pousser le concept encore plus loin et finir par rajouter X routes. Ceci étant plutôt peu pratique, on peut alors utiliser le concept de **catchAll route**

Pour se faire, il suffit de transformer notre route initiale (app/archive/@archive/[year]/page.tsx) de la manière suivante : ````app/archive/@archive/[[...filter]]/page.tsx````

Celà signifie que cette page sera activée pour n'importe quel segment ajouté après la route "/archive", et peut importe le **nombre** de segments ajoutés !

La première modification à apporter est la manière de récupérer les paramètres de route :

*Remplacer l'ancien code...*
````typescript
const ArchiveDetailPage = async ({ params }: { params: any }) => {
  const { year } = await params;	// paramètre unique params.year

  // ...
};
````

*Par le nouveau code...*
````typescript
const ArchiveDetailPage = async ({ params }: { params: any }) => {
  const { filter } = await params;	// params.filter est maintenant un TABLEAU de paramètres

  const selectedYear = filter?.[0]; // équivalent à filter ? filter[0] : undefined
  const selectedMonth = filter?.[1]; // équivalent à filter ? filter[0] : undefined
  
  // ...
};
````

**Attention**

L'ajout de la route catch all nécessite la suppression du fichier ````app/archive/@archive.page.tsx```` puisque cette dernière est aussi 
attrappée par la ````[[...filter]]````. On peut donc transférer son contenu dans la catch all route

<details>
	<summary>Exemple d'implémentation avec affichage conditionnel en fonction des paramètres récupérés</summary>

````typescript
const ArchiveDetailPage = async ({ params }: { params: any }) => {
  const { filter } = await params;

  const selectedYear = filter?.[0]; // équivalent à filter ? filter[0] : undefined
  const selectedMonth = filter?.[1]; // équivalent à filter ? filter[0] : undefined

  let news;
  let links = getAvailableNewsYears();

  if (selectedYear && !selectedMonth) {
    news = getNewsForYear(+selectedYear);
    links = getAvailableNewsMonths(+selectedYear);
  }

  if (selectedYear && selectedMonth) {
    news = getNewsForYearAndMonth(+selectedYear, +selectedMonth);
    links = [];
  }

  let newsContent = <p>No news found for the selected period.</p>;

  if (news && news.length > 0) {
    newsContent = <NewsList news={news} />;
  }

  // Afficher une fallback si les données ne contiennent pas l'année sélectionnée
  if (
    (selectedYear && !getAvailableNewsYears().includes(+selectedYear)) ||
    (selectedMonth &&
      !getAvailableNewsMonths(+selectedYear).includes(+selectedMonth))
  ) {
    throw new Error("Invalid filters");
  }

  return (
    <>
      <header className="mb-8">
        <nav>
          <ul className="flex gap-4 mb-8">
            {links.map((link) => {
              const href = selectedYear
                ? `/archive/${selectedYear}/${link}`
                : `/archive/${link}`;

              return (
                <li key={link}>
                  <Link
                    href={href}
                    className="text-[#b0b0a6] rounded font-bold text-lg hover:text-[#e5e5e1] active:text-[#e5e5e1]"
                  >
                    {link}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {newsContent}
    </>
  );
};
````

</details>


## Interception route

Une route d'interception doit être de la forme ````(<chemin-de-la-route-à-intercepter>)<nom-de-la-route-à-intercepter````

par exemple :

````
app/news/[slug]/image/page.tsx
app/news/[slug]/(.)image/page.tsx // interceptera la route image. le (.) indique que la route à intercepter se trouve dans le même répertoire
````

> Se référer à la documentation pour plus de détails

Les intercepteurs de route dans Next.js permettent de gérer des cas où certaines routes doivent être modifiées ou interagir avec une autre route spécifique sans interrompre complètement la navigation principale. 
Cela est particulièrement utile pour des fonctionnalités comme les modales, les redirections contextuelles ou des expériences utilisateur conditionnelles.

Voici un aperçu détaillé de l'intérêt d'utiliser un intercepteur de route, comme (.)image, pour intercepter la route image/page.tsx :

**1. Qu'est-ce qu'un intercepteur de route ?**

Un intercepteur de route est un mécanisme où une route spécifique est interceptée et affichée à côté ou au-dessus d'une autre route sans changer complètement l'URL principale. Cela permet de manipuler le rendu de manière conditionnelle tout en conservant le contexte global de navigation.

Dans Next.js, (.) indique une interception relative, et l'intercepteur peut s'intégrer dans une structure de page existante.

**2. Exemple concret**

*Structure des fichiers*
````
/app
  /gallery
    /page.tsx
  /gallery
    /(.)image
      /[id]
        /page.tsx
````

**Scénario utilisateur**

Un utilisateur visite ````/gallery````, qui affiche une galerie d'images.

Lorsqu'il clique sur une image, ````/gallery/image/[id]```` est chargé, mais au lieu de rediriger vers une nouvelle page complète, une modale ou un panneau latéral apparaît au-dessus de la galerie.

L'intercepteur ````(.)image/[id]/page.tsx```` gère cette vue contextuelle.

## Routes groupées

La syntaxe ````(<nom-groupe>)```` permet de regrouper plusieurs routes sous une même racine, et ainsi pouvoir définir un layout différent en fonction
de l'endroit où l'on se trouve dans le site.

Remarque : ````(<nom-groupe>)```` ne fait pas parti de l'url, c'est uniquement un mot clé permettant d'oganiser les routes


````
app/
	(landing)
		layout.tsx
		page.tsx
		error.tsx
		...
	(content)
		layout.tsx
		page.tsx
		error.tsx
		...
````

## Data fetching

### Fetch depuis composant client

<details>
	<summary>Manière classique de charger des données depuis un client</summary>

````typescript
"use client";
import React, { useEffect, useState } from "react";
import NewsList from "@/components/news/news-list";

const NewsPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [news, setNews] = useState();

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);

      const response = await fetch("http://localhost:8080/news");

      if (!response.ok) {
        setIsLoading(false);
        setError("Failed to fetch news.");
      }

      const news = await response.json();
      setNews(news);

      setIsLoading(false);
    };

    fetchNews();
  }, []);

  if (isLoading) {
    return <p>Loading news...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  let newsContent;

  if (news) {
    newsContent = <NewsList news={news} />;
  }

  return (
    <div>
      <h1 className="text-5xl font-extrabold my-4">News Page</h1>
      {newsContent}
    </div>
  );
};

export default NewsPage;
````
 
</details>

### Fetch depuis composant serveur

<details>
	<summary>Manière recommandée pour requêter des données</summary>

````typescript
import NewsList from "@/components/news/news-list";

const NewsPage = async () => {
  const response = await fetch("http://localhost:8080/news");

  if (!response.ok) {
    throw new Error("Failed to fetch news.");
  }

  const news = await response.json();

  return (
    <div>
      <h1 className="text-5xl font-extrabold my-4">News Page</h1>
      <NewsList news={news} />
    </div>
  );
};

export default NewsPage;
````
 
</details>

Pour parfaire l'experience utilisateur, il est possible d'ajouter une page *loading.tsx* (mot clé réservé) au même niveau que la page.

de cette manière, la page *loading.tsx* sera affichée automatiquement lors du chargement des données, sans avoir besoin de gérer cet état côté composant


## Server actions

plutôt que de surcharger les composants serveurs avec les appels http, il est possible de loger ces appels http dans des server actions (fichiers séparés) et de passer ces actions aux composants clients (voir exercice section-6)


## Mises à jour optimistes 


Le hook React ````useOptimistic()```` permet de réaliser des mises à jour optimistes. C'est à dire qu'il va réaliser la mise à jour visuelle instantannée, avant que la mise à jour réelle des données (qui passe par une api, enregistrement en bdd etc...) ne soit terminée.
Si la mise à jour réelle des données ne se passe pas bien, alors le hook fera automatiquement un rollback vers l'état initial de la valeur.

````useOptimistic(<data>, <callback>)````

* 1er paramètre : données à mettre à jour
* 2eme paramètre : fonction qui va mettre à jour les données et retourner le nouveau jeu de données

*Modifier le code :*
````
export default function Posts({ posts }) {

  if (!posts || posts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  return (
    <ul className="posts">
      {posts.map((post) => (
        <li key={post.id}>
          <Post post={post} />
        </li>
      ))}
    </ul>
  );
}
````

<details>
	<summary>Code mis à jour de manière optimiste</summary>
	
	
````
"use client";
import { formatDate } from "@/lib/format";
import LikeButton from "./like-icon";
import Image from "next/image";
import { togglePostLikeStatus } from "@/actions/post";
import { useOptimistic } from "react";

function Post({ post, action }) {
  return (
    <article className="post">
      <div className="post-image">
        {/* <Image
          src={post.image}
          alt={post.title}
          width={120}
          height={120}
          onError={<span>No picture</span>}
        /> */}
      </div>
      <div className="post-content">
        <header>
          <div>
            <h2>{post.title}</h2>
            <p>
              Shared by {post.userFirstName} on{" "}
              <time dateTime={post.createdAt}>
                {formatDate(post.createdAt)}
              </time>
            </p>
          </div>
          <div>
            <form
              action={action.bind(null, post.id)}
              className={post.isLiked ? "liked" : ""}
            >
              <LikeButton isLiked={post.isLiked} />
            </form>
          </div>
        </header>
        <p>{post.content}</p>
      </div>
    </article>
  );
}

export default function Posts({ posts }) {
  const [optimisticPosts, updatedOptimisticPosts] = useOptimistic(
    posts,
    (prevPosts, updatedPostId) => {
      // indice du post mis à jour
      const updatedPostIndex = prevPosts.findIndex(
        (post) => post.id === updatedPostId
      );

      if (updatedPostIndex === -1) {
        return prevPosts;
      }

      // création du post à mettre à jour, basé sur le prevPost
      const updatedPost = { ...prevPosts[updatedPostIndex] };

      // mise à jour du compteur de like
      updatedPost.likes = updatedPost.likes + (updatedPost.isLiked ? -1 : 1);

      // mise à jour de l'état isLike ou non
      updatedPost.isLiked = !updatedPost.isLiked;

      // création du nouveau tableaux de posts, basés sur le prevPosts (car prevPost est immutable)
      const newPosts = [...prevPosts];
      newPosts[updatedPostIndex] = updatedPost;

      return newPosts;
    }
  ); // premier param = l'objet data, second param = callback à jouer pour mettre à jour

  if (!optimisticPosts || optimisticPosts.length === 0) {
    return <p>There are no posts yet. Maybe start sharing some?</p>;
  }

  const updatePost = async (postId) => {
    updatedOptimisticPosts(postId);
    await togglePostLikeStatus(postId);
  };

  return (
    <ul className="posts">
      {optimisticPosts.map((post) => (
        <li key={post.id}>
          <Post post={post} action={updatePost} />
        </li>
      ))}
    </ul>
  );
}

````


optimisticPosts prend la valeur du retour de la callback (second argument de useOptimistic)

</details>


