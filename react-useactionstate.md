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
