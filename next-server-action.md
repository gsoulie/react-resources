[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Server actions

Next 13.4 introduit les *server actions*, qui permettent d'exécuter du code serveur depuis un composant client.

Voici  par exemple un bouton qui exécute un fetch depuis un formulaire

> **Remarque** : Dans un formulaire, on utilisera ````action```` et non plus ````submit````

````typescript
export function AddToFavoritesButton({ id }) {
    async function addToFavorites(data) {
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

autre exemple

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
