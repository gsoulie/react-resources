[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Server actions

Next 13.4 introduit les *server actions*, qui permettent d'exécuter du code serveur depuis un composant client. Tout code nécessitant d'être joué côté serveur, doit donc être préfixé par ````'use server'````

Voici  par exemple un bouton qui exécute un fetch depuis un formulaire

> **Remarque** : Dans un formulaire, on utilisera ````action```` et non plus ````submit````

````typescript
export function AddToFavoritesButton({ id }) {
    const addToFavorites = async (data: FormData) => {
        'use server';

        await fetch(`/api/tracks/${id}/favorites`, { method: 'POST' });
    }
    return (
        <form action={addToFavorites}>
            <button type="submit">Add to Favorites</button>
        </form>
    );
}
````

*Exemple - Interaction avec formulaire*
````typescript
async function create(formData: FormData) {
  'use server';
  const post = await db.post.insert({
    title: formData.get('title'),
    content: formData.get('content')
  })
  redirect(`/blog/${post.slug}`)
}

export default function Page() {
  return (
    <form action={create}>
    ...
    </form>
  )
}
````

*Exemple - Interaction directe avec la BDD (prisma)*
````typescript
import { prisma } from "@/db/db";

export default function Page() {
  const todos = await prisma.todo.findMany();

  const addTodo = async (formData: FormData) => {
    'use server';

    const content = formData.get('content');

    await prisma.todo.create({
        data: { content: content as string }
    })

    revalidatePath('/todos');    // Important : invalider les data en cache pour redéclencher le chargement des données
  }
  return (
    <form action={addTodo}>
    ...
    </form>
  )
}
````
