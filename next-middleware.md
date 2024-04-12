[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Middleware et interceptor

[Documentation officielle](https://nextjs.org/docs/app/api-reference/file-conventions/middleware)     

Les middlewares vous permettent d'exécuter du code **sur le serveur** avant qu'une requête ne soit complétée. Ensuite, en fonction de la requête entrante, 
vous pouvez modifier la réponse en réécrivant, en redirigeant, en modifiant les en-têtes de requête ou de réponse, ou en répondant directement.

Les middlewares s'exécutent avant que le contenu mis en cache et les routes ne soient rendus, et sont particulièrement utiles pour implémenter de la logique personnalisée côté serveur, 
gérer le comportement de l'authentification, modifier les requête (ajout d'en-tête bearer par exemple) etc...

## Cas d'utilisation
Intégrer des middlewares dans votre application peut entraîner des améliorations significatives en termes de performances, 
de sécurité et d'expérience utilisateur. Voici quelques scénarios courants où les middlewares sont particulièrement efficaces :

* Authentification et autorisation : Assurez-vous de l'identité de l'utilisateur et vérifiez les cookies de session avant d'accorder l'accès à des pages spécifiques ou à des routes d'API.
* Redirection côté serveur : Redirigez les utilisateurs au niveau du serveur en fonction de certaines conditions (par exemple, la localisation, le rôle de l'utilisateur).
* Réécriture des chemins : Prend en charge les tests A/B, les déploiements de fonctionnalités ou les chemins hérités en réécrivant dynamiquement les chemins vers les routes d'API ou les pages en fonction des propriétés de la requête.
* Détection de bots : Protégez vos ressources en détectant et en bloquant le trafic de bots.
* Journalisation et analytique : Capturez et analysez les données de requête pour obtenir des informations avant leur traitement par la page ou l'API.
* Activation/désactivation de fonctionnalités : Activez ou désactivez dynamiquement des fonctionnalités pour des déploiements de fonctionnalités transparents ou des tests.

> Il est toutefois déconseillé d'utiliser les middlewares pour réaliser des traitements lourds, opérations directes sur la bdd, gestion complexe de session, récupération et manipulation de données.

## Convention

Le fichier **middleware.ts** est réservé pour cet usage et doit être placé à la racine du projet (au même niveau que le répertoire *app* ou à l'intérieur de *src*)

**1 seul** fichier *middleware.ts* est supporté par projet

## Contenu

Le fichier doit exporter **une seule** fonction nommée **middleware**, ainsi qu'un objet *config* **optionnel**

````typescript
import { NextResponse, NextRequest } from 'next/server'
 
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  return NextResponse.redirect(new URL('/home', request.url))
}
 
export const config = {
  matcher: '/about/:path*',
}
````

L'option matcher vous permet de cibler des chemins spécifiques sur lesquels le Middleware doit s'exécuter. Vous pouvez spécifier ces chemins de plusieurs manières :

* Pour un seul chemin : Utilisez directement une chaîne de caractères pour définir le chemin, comme '/about'.
* Pour plusieurs chemins : Utilisez un tableau pour répertorier plusieurs chemins, par exemple matcher: ['/about', '/contact'], ce qui applique le Middleware à la fois à /about et /contact.

L'option matcher accepte également un tableau d'objets avec les clés suivantes :

* source : Le chemin ou le motif utilisé pour faire correspondre les chemins de requête. Il peut s'agir d'une chaîne de caractères pour une correspondance directe de chemin ou d'un motif pour une correspondance plus complexe.
* regexp (optionnel) : Une chaîne de caractères d'expression régulière qui affine la correspondance en fonction de la source. Il permet un contrôle supplémentaire sur les chemins à inclure ou à exclure.
* locale (optionnel) : Un booléen qui, lorsqu'il est défini sur false, ignore le routage basé sur la localisation dans la correspondance des chemins.
* has (optionnel) : Spécifie des conditions basées sur la présence d'éléments de requête spécifiques tels que les en-têtes, les paramètres de requête ou les cookies.
* missing (optionnel) : Se concentre sur les conditions où certains éléments de requête sont absents, comme les en-têtes ou les cookies manquants.

````typescript
export const config = {
  matcher: [
    {
      source: '/api/*',
      regexp: '^/api/(.*)',
      locale: false,
      has: [
        { type: 'header', key: 'Authorization', value: 'Bearer Token' },
        { type: 'query', key: 'userId', value: '123' },
      ],
      missing: [{ type: 'cookie', key: 'session', value: 'active' }],
    },
  ],
}
````

## Exemple

Le middleware suivant, se déclenche lorsque le matcher "/api" est appelé. En d'autres termes, si on essaye de naviguer vers une route contenant "/api/...", le middleware redirige automatiquement vers la page /login

````typescript
export function middleware(request: NextRequest) {
  const token = request.headers.get('Authorization');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/:path*"]
}
````
