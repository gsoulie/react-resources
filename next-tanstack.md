[< Back to main Menu](https://github.com/gsoulie/Mobile-App-Development)    

````19/01/2026```` 

# Veille

## Présentation
**TanStack Start est un framework full-stack** basé sur TanStack Router + Vite + Nitro, visant à être une alternative légère à Next.js. Il n’est pas juste un router, mais un ensemble cohérent pour construire des applis full-stack modernes.

TanStack Start est né de la volonté de proposer une alternative moderne aux frameworks full-stack traditionnels, souvent perçus comme lourds et fortement couplés à un écosystème propriétaire. En capitalisant sur le succès des bibliothèques TanStack largement adoptées dans l’industrie (Query, Router, Table), l’équipe a conçu TanStack Start pour répondre aux enjeux actuels des entreprises : performance, scalabilité, maîtrise des coûts d’infrastructure et réduction du vendor lock-in. L’objectif est de fournir un socle technologique flexible, performant et pérenne, capable de s’adapter aussi bien aux architectures cloud modernes qu’aux contraintes métiers spécifiques.

## Est-ce le futur « remplaçant potentiel » de Next.js ?

📌 Il y a une perception dans la communauté que TanStack Start pourrait devenir une alternative sérieuse à Next.js dans certains contextes, surtout pour :

* ceux qui cherchent plus de contrôle et moins de conventions implicites
* ceux qui préfèrent type safety poussée
* ceux qui veulent un framework léger et flexible
* projets SPAs interactifs / dashboards, pas forcément sites marketing classiques

## NextJS vs Tanstack Start

| Aspect        | **Next.js**                           | **TanStack Start**                                |
| ------------- | ------------------------------------- | ------------------------------------------------- |
| Orientation   | **Server-First** (RSC, SSR, SSG, ISR) | **Client-First** avec opt-in SSR/loader explicite |
| Conventions   | Forte, “magie” implicite              | Faible, **explicit & minimal logic overhead**     |
| Routing       | File-based App Routing                | Router **type-safe**, code-first ou file-based    |
| TypeScript    | Support TS (bon DX)                   | **Type safety end-to-end** (compile-time)         |
| Data fetching | Implicite / partielles conventions    | **Explicit loaders, composable cache**            |
| Build tooling | Turbopack/Webpack (propriétaire)      | **Vite** + Nitro                                  |
| Ecosystème    | Très large + Vercel optimisations     | Croissant, centré sur libs TanStack               |

> 👉 **Type safety** est un vrai différenciateur chez TanStack — params de route, query params, loader data, etc. — alors que Next.js a une base TS solide mais des zones grises entre client/server boundary.

## Performances et DX
#### Dev & build performance

✔️ TanStack Start (Vite) : démarrage ultra rapide, HMR immédiat, énorme boost de productivité.     
❗ Next.js : startup de serveur plus lente, HMR parfois lent malgré Turbopack.     

> 👉 Grande différence sur projets larges ou microservices front.   

#### Runtime & bundle size

* TanStack Start a un runtime plus léger, moins de « framework overhead ».
* Next.js embarque davantage de runtime pour RSC, routing automatique, etc.   
➡️ Dans des apps très interactives ZÉRO framework, Start peut être plus performant.

## Routing & data fetching
#### Routing

* TanStack Router : routing fully typed, search & path params typés, événements de navigation, plus puissant que le routing Next.
* Next.js : file-based routing standard, conventionnel, moins typé.   
👉 Si les routes typées sont critiques pour toi — gros avantage TanStack Router.

#### Data fetching

* Next.js : RSCs + server actions → SSR, streaming, SSG, etc.
* TanStack Start : loaders explicites, intégration native à TanStack Query (SWR).
Si ta logique server est complexe avec plein de middleware, validation et types, TanStack Start est plus clair et contrôlé

## Sécurité

* Next.js bénéficie d’une longue production history et de nombreuses patches sécurité intégrées par Vercel / communauté.
* TanStack Start : approche explicite = moins de « surcouches magiques » → tu maîtrises mieux le comportement de sécurité.

Sur les risques classiques (CSRF, SSRF, XSS), les deux dépendront fortement de ton code et pratiques, pas du framework pur.

> 👉 Next.js a l’avantage de maturité et contexte d’entreprise (Edge, middleware, etc.), mais TanStack Start est explicitement plus audit-friendly.

## Documentation & écosystème

* Next.js : énorme communauté, tonnes de ressources, plugins, templates.
* TanStack : docs solides pour Router & Query ; Start encore en croissance / release candidate / early stable.    
➡️ Tant que TanStack Start n’a pas des années de production derrière lui (comme Next), l’écosystème est plus jeune, donc plus évolutif mais moins stable mature

## Pérennité

* Next.js : déjà la norme pour les grandes entreprises, avec des conventions établies.
* TanStack Start : fort momentum, mais pas encore prouvé large scale comme solution universelle.    
> 👉 Migration vers TanStack Start est risquée pour des projets legacy ou équipes très larges sans prototypage préalable.

## Notion de route type-safety

### Problématique initiale du routing classique
Voici quelques exemples concrets afin d'illustrer le problème réel du routing classique. 

Dans la majorité des frameworks (y compris Next.js), les routes sont :
* définies par structure de fichiers
* consommées via des strings non typées

👉 Exemple Next.js :
````
router.push(`/users/${userId}?tab=profile`)
````

#### Problèmes :

#### ❌ Problème 1 — Erreurs silencieuses
````
router.push(`/user/${userId}`) // faute de frappe
````

➡️ Aucun warning TypeScript    
➡️ Bug détecté uniquement en runtime

#### ❌ Problème 2 — Paramètres non validés
````
const id = searchParams.get("id") // string | null
````

Tu dois ensuite :
````
const userId = Number(id)
if (isNaN(userId)) ...
````

➡️ Boilerplate   
➡️ Bugs fréquents    
➡️ Contrats faibles   

#### ❌ Problème 3 — Couplage faible entre route et composant

La route dit :
````
/users/[id]
````

Mais ton composant :
````
const id = params.id // any-ish
````

➡️ Aucun contrat fort    
➡️ Si tu renommes [id] → [userId] → cassé en silence    

#### ❌ Problème 4 — Refactoring risqué

Renommer un segment :
````
/dashboard/settings → /app/settings
````

➡️ Tu dois rechercher toutes les strings dans le code     
➡️ Aucun compilateur pour t’aider     

### Solution du Type safe routing

**Le principe est que la route devient une API typée, pas juste un chemin texte.**

Cela implique :

* paramètres typés
* query params typés
* navigation typée
* loaders typés
* autocomplétion IDE
* erreurs au build, pas en prod

#### Exemple Tanstack Router

````typescript
export const userRoute = createRoute({
  path: '/users/$userId',
  parseParams: (params) => ({
    userId: Number(params.userId),
  }),
})

/**
 * Utilisation dans un composant :
 **/

// Récupération d'un paramètre de route
const { userId } = userRoute.useParams()

// Navigation typée
router.navigate({
  to: userRoute,
  params: { userId: 42 },
})

````
Ici on décrit explicitement :

* userId est un number
* conversion faite une seule fois
* contrat global

➡️ Zéro parsing manuel    
➡️ Impossible d’avoir undefined   
➡️ Sécurité totale   

## En résumé

👉 TanStack Router est pensé router-first, Next.js est framework-first.

👉 **TanStack Start — avantages**

✅ Type-safe routing & params    
✅ Explicite, « pas de magie »    
✅ Super DX (Vite, dev rapide)    
✅ Flexible, déployable partout (pas lock-in)    
✅ Meilleur contrôle middleware / validation    
✅ Très bon pour apps hautement interactives    

👉 **TanStack Start — inconvénients**

❗ Écosystème plus jeune    
❗ SSR / Server Components encore moins « matures » que Next.js    
❗ Pas encore prouvé sur projets très gros / enterprises    
❗ Moins de plugins / intégrations prêtes à l’emploi    

👉 **Next.js — avantages**

✅ Maturité & stabilité industrialisée     
✅ RSCs out-of-the-box + SSR/SSG/ISR complet    
✅ Large communauté / plugins / solutions SaaS intégrés    
✅ Edge functions & CDN optimisés Vercel    
✅ Très bon SEO et expérience pre-rendering   

👉 **Next.js — inconvénients**

❗ Plus de conventions implicites    
❗ Dev DX peut être plus lent (server startup, HMR)     
❗ Certains patterns de données ou caches peu clairs ou vite complexes
