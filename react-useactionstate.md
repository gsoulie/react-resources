## Comment fonctionne useActionState

### Le principe de base

> ````useActionState```` est un hook qui connecte un formulaire à une **server action** tout en gérant automatiquement l'état de la réponse. 

Il suit un cycle simple :
````
Utilisateur soumet → Action exécutée → État mis à jour → UI re-render
````

### La signature

````typescript
const [state, formAction, isPending] = useActionState(action, initialState);
````

Les 3 valeurs retournées :

- **`state`** → le dernier retour de l'action (ou `initialState` au premier render)
- **`formAction`** → la fonction à passer à `<form action={...}>`
- **`isPending`** → `true` pendant l'exécution de l'action

---

### Le cycle de vie illustré
````
┌─────────────────────────────────────────────────────┐
│                                                     │
│   INITIAL RENDER                                    │
│   state = initialState ({})                         │
│   isPending = false                                 │
│                                                     │
└──────────────────────┬──────────────────────────────┘
                       │ L'utilisateur clique sur Submit
                       ▼
┌─────────────────────────────────────────────────────┐
│                                                     │
│   PENDING                                           │
│   state = {} (inchangé)                             │
│   isPending = true  ← le bouton se désactive        │
│                                                     │
└──────────────────────┬──────────────────────────────┘
                       │ La server action s'exécute
                       ▼
┌──────────────────────────────────┐
│  SERVER ACTION                   │
│                                  │
│  createUserAction(               │
│    prevState,  ← état précédent  │
│    formData    ← données du form │
│  )                               │
│                                  │
│  return { errors: {...} }        │
│      OU                          │
│  return { success: true }        │
└──────────────────────┬───────────┘
                       │ La valeur retournée devient le nouvel état
                       ▼
┌─────────────────────────────────────────────────────┐
│                                                     │
│   APRÈS EXÉCUTION                                   │
│   state = { errors: { email: [...] } }              │
│   isPending = false                                 │
│                                                     │
│   → React re-render avec le nouvel état             │
│   → Les erreurs s'affichent dans le formulaire      │
│                                                     │
└─────────────────────────────────────────────────────┘
````

**Le paramètre ````prevState```` souvent ignoré**

C'est l'état du cycle précédent, disponible dans l'action. Il peut être utile par exemple pour accumuler des tentatives :

````typescript
export async function createUserAction(
  prevState: FormState,  // ← état du render précédent
  formData: FormData
): Promise<FormState> {
  // prevState contient ce qui était retourné au submit précédent
  // Au premier submit : prevState = initialState = {}
  // Au deuxième submit : prevState = { errors: {...} } ou { success: true }
}
````

*Comparaison avec l'approche classique*

````typescript
// ❌ Avant useActionState — gestion manuelle
const [errors, setErrors] = useState({});
const [isPending, setIsPending] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsPending(true);
  const result = await createUser(formData);
  setErrors(result.errors);
  setIsPending(false);
};

// ✅ Avec useActionState — tout est géré automatiquement
const [state, formAction, isPending] = useActionState(createUserAction, {});
````

**Ce que useActionState gère pour nous**

* Le isPending automatique pendant l'exécution     
* La mise à jour de state avec le retour de l'action    
* La compatibilité avec le streaming SSR et les Server Components Next.js      
* Le passage de prevState à chaque exécution pour pouvoir chaîner les états    

> C'est essentiellement un useState + useTransition + la glue pour les server actions, packagé en un seul hook.

## Exemple d'utilisation dans un fetch classique

<details>
  <summary>Code source</summary>

**Schéma de validation des données ZOD**
*schemas/posts.ts*

````typescript
import { z } from "zod";

// Schéma de validation pour un post
export const PostSchema = z.object({
  userId: z.number(),
  id: z.number(),
  title: z.string(),
  body: z.string(),
});

// Schéma pour un tableau de posts
export const PostsArraySchema = z.array(PostSchema);

// Type TypeScript inféré depuis le schéma
export type Post = z.infer<typeof PostSchema>;

export type PostsState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: z.infer<typeof PostsArraySchema> }
  | { status: "error"; message: string };

````

**Server action - fetch**
*actions/posts.action.ts*

````typescript
// actions/posts.actions.ts
"use server";

import { routes } from "@/helpers/routes";
import { PostsArraySchema, PostsState } from "@/schemas/post";

/**
 * Action serveur pour récupérer les posts depuis l'API JSONPlaceholder.
 * Utilise la validation Zod pour garantir l'intégrité des données.
 * @param _prevState
 * @returns
 */
export async function fetchPostsAction(
  _prevState: PostsState,
): Promise<PostsState> {
  try {
    const res = await fetch(`${routes.api.fetchPosts}`, {
      next: { revalidate: 60 }, // ISR : cache 60s
    });

    if (!res.ok) {
      throw new Error(`HTTP error — status: ${res.status}`);
    }

    const raw: unknown = await res.json();
    const parsed = PostsArraySchema.safeParse(raw);

    if (!parsed.success) {
      const details = parsed.error.issues
        .map((i) => `[${i.path.join(".")}] ${i.message}`)
        .join(", ");

      return {
        status: "error",
        message: `Données invalides reçues de l'API : ${details}`,
      };
    }

    return { status: "success", data: parsed.data };
  } catch (err) {
    return {
      status: "error",
      message: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
````

**Page Next**
*posts.page.tsx*

````typescript
import { PostsList } from "@/components/posts/post-list";

// app/posts/page.tsx
export default function PostsPage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <PostsList />
    </main>
  );
}



// components/posts-list.tsx
"use client";

import { fetchPostsAction } from "@/app/useActionState/actions/posts.action";
import { PostsState } from "@/schemas/post";
import { startTransition, useActionState, useEffect } from "react";

const INITIAL_STATE: PostsState = { status: "idle" };

export function PostsList() {
  const [state, dispatch, isPending] = useActionState(
    fetchPostsAction,
    INITIAL_STATE,
  );

  // Chargement automatique au montage
  useEffect(() => {
    startTransition(() => dispatch()); // dispatch DOIT être appelé dans un startTransition pour éviter le blocage de l'UI (non nécessaire lors de l'utilisation avec un formulaire)
  }, [dispatch]);

  return (
    <section
      aria-label="Liste des posts"
      aria-live="polite"
      aria-busy={isPending}
    >
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Posts</h1>
        <button
          onClick={() => startTransition(() => dispatch())}
          disabled={isPending}
          className="px-4 py-2 text-sm border rounded-md disabled:opacity-50 transition-opacity"
          aria-label="Recharger les posts"
        >
          {isPending ? "Chargement…" : "Rafraîchir"}
        </button>
      </div>

      {isPending && (
        <div role="status" className="text-center py-12 text-gray-500">
          <span className="sr-only">Chargement en cours</span>
          Chargement…
        </div>
      )}

      {state.status === "error" && !isPending && (
        <div
          role="alert"
          className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200"
        >
          <p className="font-medium">Erreur lors du chargement</p>
          <p className="text-sm mt-1">{state.message}</p>
          <button
            onClick={() => dispatch()}
            className="mt-3 text-sm underline hover:no-underline"
          >
            Réessayer
          </button>
        </div>
      )}

      {state.status === "success" && !isPending && (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.data.map((post) => (
            <li
              key={post.id}
              className="p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow"
            >
              <span className="text-xs font-medium text-indigo-600 uppercase tracking-wide">
                Post #{post.id}
              </span>
              <h2 className="mt-1 font-medium text-gray-900 line-clamp-2 capitalize">
                {post.title}
              </h2>
              <p className="mt-2 text-sm text-gray-500 line-clamp-3">
                {post.body}
              </p>
            </li>
          ))}
        </ul>
      )}

      {state.status === "idle" && !isPending && (
        <p className="text-center text-gray-400 py-12">
          Aucune donnée chargée.
        </p>
      )}
    </section>
  );
}

````
  
</details>
