
# Nouveauté NextJS

* [Next 16](#next-16)

## Next 16

<details>

  <summamry>Nouveauté de la v16</summary>

````21/10/2025````

> [Article blog Next 16](https://nextjs.org/blog/next-16)
> 
À la veille de la Next.js Conf 2025, la version 16 de Next.js est enfin disponible. Cette mise à jour majeure introduit des **améliorations significatives** en termes de **performance, de flexibilité et d’expérience développeur**. Voici un tour d’horizon des principales innovations.

## Cache Components : Une Nouvelle Ère pour le Rendu Partiel
Next.js 16 introduit les Cache Components, une fonctionnalité qui rend le cache plus explicite et flexible grâce à la directive ````"use cache"````. 

Cette approche s’appuie sur le modèle de Partial Pre-Rendering (PPR), permettant de combiner rendu statique et dynamique au sein d’une même page.

Pour activer les Cache Components, ajoutez simplement cette configuration dans votre next.config.ts :

*next.config.ts*
````typescript
const nextConfig = {
  cacheComponents: true,
};

export default nextConfig;
````

**Cas d’usage :**

* *Pages hybrides* : Certaines sections sont statiques (comme un en-tête), tandis que d’autres sont dynamiques (comme un panier d’achat).
* *Navigation instantanée* : Grâce au cache, les transitions entre pages sont quasi instantanées.


## Next.js DevTools MCP : Le Debugging Assisté par IA
Next.js 16 intègre le Model Context Protocol (MCP) dans ses DevTools, offrant une assistance IA pour le debugging. Cette fonctionnalité permet aux agents IA d’accéder à :

* Le contexte de routage, de cache et de rendu.
* Les logs unifiés (navigateur et serveur).
* Les erreurs détaillées sans copie manuelle.

**Avantages :**

* Diagnostic automatisé : L’IA peut suggérer des corrections directement dans votre workflow.
* Contexte actif : Compréhension fine de la route ou du composant en cours de développement.


## proxy.ts : Une Clarification des Frontières Réseau
> Le fichier ````middleware.ts```` est remplacé par ````proxy.ts````, clarifiant la frontière réseau de l’application.

Ce changement vise à uniformiser le runtime (Node.js) et à simplifier la logique d’interception des requêtes.

Exemple de Migration : Renommez simplement votre fichier et adaptez l’export :

*proxy.ts*
````typescript
export default function proxy(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url));
}
````
**Pourquoi ce changement ?**

* Clarté : Le terme "proxy" reflète mieux la fonction de gestion des requêtes entrantes.
* Runtime unique : Plus de confusion entre Edge et Node.js.


## Améliorations des Logs : Une Meilleure Visibilité
Les logs de développement et de build sont désormais plus détaillés, affichant le temps passé à chaque étape (compilation, rendu, optimisation).

**Exemple de Sortie Terminal :**

````
✓ Finished TypeScript in 1114ms
✓ Collecting page data in 208ms
✓ Generating static pages in 239ms
````

**Impact :**

* Optimisation ciblée : Identifiez rapidement les goulots d’étranglement.
* Transparence : Meilleure compréhension des performances de l’application.


## Turbopack : Le Bundler par Défaut
Turbopack, désormais stable, devient le bundler par défaut pour tous les nouveaux projets Next.js. Ses performances sont impressionnantes :

* 2 à 5 fois plus rapide en build de production.
* Jusqu’à 10 fois plus rapide pour le Fast Refresh.

**Exemple d’Utilisation :**

````
# Pour forcer l'utilisation de Webpack (si nécessaire)
next dev --webpack
next build --webpack
````

**Cas d’usage :**

* Projets volumineux : Réduction drastique des temps de compilation.
* Développement agile : Fast Refresh quasi instantané.


## React Compiler : L’Optimisation Automatique
Le React Compiler est désormais stable dans Next.js 16. Il optimise automatiquement les composants en mémoïsant les rendus, réduisant ainsi les re-rendus inutiles.

**Activation :**

*next.config.ts*
````typescript
const nextConfig = {
  reactCompiler: true,
};

export default nextConfig;
````

**Installation :**
````
npm install babel-plugin-react-compiler@latest
````

**Avantages :**

* Performance accrue : Moins de calculs redondants.
* Code plus propre : Pas besoin de useMemo ou useCallback manuels.

## Routing et Navigation Optimisés
Next.js 16 améliore significativement le système de routing :

* Deduplication des layouts : Un layout partagé est téléchargé une seule fois, même pour 50 liens.
* Prefetching incrémental : Seules les parties non cachées sont préchargées.

**Exemple de Gains :**

|Ancienne Version|Next.js 16|
|-|-|
|50 requêtes pour un layout partagé|1 requête|
|Prefetching complet de la page|Prefetching ciblé|


## Nouvelles API de Cache
Next.js 16 introduit des API de cache plus explicites :

* ````revalidateTag(tag, profile)```` : Invalide le cache avec un profil de durée de vie (ex: 'max', 'hours').
* ````updateTag(tag)```` : Met à jour immédiatement le cache pour les Server Actions (lecture après écriture).
* ````refresh()```` : Rafraîchit les données non cachées.

*Exemple d’Utilisation :*

````typescript
// Invalidation avec profil
revalidateTag('blog-posts', 'max');

// Mise à jour immédiate
updateTag(`user-${userId}`);

// Rafraîchissement des données non cachées
refresh();
````

## React 19.2 et les Fonctionnalités Canary
Next.js 16 intègre les dernières fonctionnalités de React 19.2 :

* View Transitions : Animations fluides entre les états de l’UI.
* ````useEffectEvent```` : Extraction de la logique non réactive des effets.
* ````<Activity/>```` : Gestion des activités en arrière-plan.

**Exemple de View Transition :**

````typescript
// Utilisation dans un composant
import { ViewTransition } from 'next/view-transitions';

function ProductPage() {
  return (
    <ViewTransition>
      {/* Contenu avec transitions animées */}
    </ViewTransition>
  );
}
````

## Suppressions et Dépréciations

|Fonctionnalité|Remplacement|
|-|-|
|middleware.ts|proxy.ts|
|next/legacy/image|next/image|
|images.domains|images.remotePatterns|

### Comportements Modifiés

* Turbopack par défaut : Opt-out avec --webpack.
* ````images.minimumCacheTTL```` : Passe de 60s à 4h.
* Accès asynchrone obligatoire : ````await params, await searchParams````, etc.
  
</details>
