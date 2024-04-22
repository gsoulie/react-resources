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

<details>
    <summary>code</summary>

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

</details>

*Exemple - Interaction directe avec la BDD (prisma)*

<details>
    <summary>code</summary>

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
    
</details>

*Refactoring propore*

<details>
    <summary>code</summary>

Pour plus de clarté, il est recommandé de séparer les *server actions* dans des fichiers spécifiques (dans un répertoire "actions") et de séparer le code des composants serveur., du code des composants clients.

Ici, nous allons déplacer le formulaire dans un composant *client*, la serveur action dans un fichier *actions.ts* et le serveur dans son *page.tsx*


*Server component Page.tsx*
````typescript
import Form from "@/components/form";

export default async function TodosPage() {
    const todos = await prisma.todo.findMany();

    return (
        <Form />

        <ul>
            { todos.map((todo) => (<li>...</li>)) }
        </ul>
    )
}
````

*actions.ts*
````typescript
"use server"

import { prisma } from "@/db/db";
import { revalidatePath } from "next/cache";

export const addTodo = async (formData: FormData) => {
    const content = formData.get('content');

    await prisma.todo.create({
        data: { content: content as string }
    })

    revalidatePath('/todos');
}
````

*Form.tsx*
````typescript
"use client"

export default function Form() {
   return (
    <form action={addTodo}>
    ...
        <button>Add</button>
    </form>
  )
}
````
    
</details>
