
[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Udemy : NextJS The Complete Guide



## Bonnes pratiques :

- répertoire *components* en dehors de *app* => Plus claire de garder app uniquement pour les pages

- répertoire *actions* pour loger les server actions

- nommage des fichiers page et composants en minuscule et snake-case

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

*remplacer  *
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

Va créer un fichier *initdb.js*

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
