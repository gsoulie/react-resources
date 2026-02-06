## Composant statique 

Le composant statique ne dépend d'aucun paramètre qui évolue dans le temps, ni d'aucune données provenant d'une requête.

Ce composant est rendu au moment de la compilation 

*Composant statique* : identique pour tous les utilisateurs
````typescript
// Static component
function Header() {
  return <h1>Shop</h1>
}
 
export default async function Page() {
  return (
    <>
      <Header />
    </>
  )
}
````


## Composant dynamique

Un composant dynamique dépend de données externes (requête http...). Etant donné que les données qu'il utilise peuvent changer dans le temps,
son rendu n'est plus garanti comme stable.

Ce composant est rendu au moment de la récupération des données.

Même si le header est statique, ce dernnier ne peut pas être envoyé au browser tant que le composant dynamique n'a pas terminé de récupérer ses données.

Pour éviter ce problème, deux solutions sont possibles : 
* **Cache** : Mettre en cache le composant pour le rendre stable et le pré-rendre comme le reste de la page
* **Stream** : Diffusez le composant en continu afin qu'il devienne non bloquant et que le reste de la page n'ait pas à l'attendre

**Cache component**

Utiliser ````use cache```` permet de marquer un composant comme cache component

````typescript
import db from '@/db'
import { List } from '@/app/products/ui'
 
function Header() {}
 
// Cache component
async function ProductList() {
  'use cache'
  const products = await db.product.findMany()
  return <List items={products} />
}
 
export default async function Page() {
  return (
    <>
      <Header />
      <ProductList />
    </>
  )
}
````

## Partial prerendering (Stream)

On peut aussi éviter le blocage du rendu en utilisant le *Streaming* des données. Ceci se fait via l'utilisation de ````Suspense````.

De cette manière, Next peut pré-rendre une partie de la page et mettre à jour la page à la réception des données dynamiques

````typescript
import { Suspense } from 'react'
import db from '@/db'
import { List, Promotion, PromotionSkeleton } from '@/app/products/ui'
import { getPromotion } from '@/app/products/data'
 
// Static component
function Header() {
  return <h1>Shop</h1>
}
 
// Cache component
async function ProductList() {
  'use cache'
  const products = await db.product.findMany()
  return <List items={products} />
}
 
// Dynamic component (streamed)
async function PromotionContent() {
  const promotion = await getPromotion()
  return <Promotion data={promotion} />
}
 
export default async function Page() {
  return (
    <>
      <Suspense fallback={<PromotionSkeleton />}>
        <PromotionContent />
      </Suspense>
      <Header />
      <ProductList />
    </>
  )
}
````
