[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Not-found


<details>
	<summary>Cas particulier des multi-layouts</summary>
	
> https://github.com/vercel/next.js/discussions/50034
	
Dans le cas d'un projet découpé en plusieurs segments utilisants des layouts différents, la gestion des pages 404 **not-found.tsx** est un peu particulière car elle doit être faite pour chaque sous-segment de la route principale (ici app1 et app2)

Voici l'architecture qu'il faut mettre en place :

````
app
├── (app1)
│   ├── [...not-found]
│   │       └── page.tsx
│   │
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx
│
└── (app2)
    ├── [...not-found]
    │       └── page.tsx
    ├── admin
    │   └── page.tsx
	│
	├── not-found.tsx
    └── layout.tsx
````

Ensuite, chaque page ````[...not-found]/page.tsx```` doit contenir le code suivant :

````typescript
import { notFound } from 'next/navigation';

export default function NotFoundDummy() {
  notFound();
}
````

> La page **not-found.tsx** peut contenir ce que l'on souhaite et cette dernière sera intégrée dans le *layout.tsx* de son parent

</details>
