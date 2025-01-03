[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Gestion du cache

![nextjs-cache](https://github.com/user-attachments/assets/35b535d4-ab65-404a-9e18-7117d16b2bbc)

![nextjs-cache-doc](https://github.com/user-attachments/assets/6b8b9f33-e4a0-4105-8cbb-fd302091c259)

Par défaut, NextJS fait de la mise en cache agressive, c'est à dire qu'il pré-rend les pages et ne les mets plus à jour par la suite. 
Si le cas se présente, il faut alors dire à NextJS que certaines pages / composants doivent être re-rendus lorsque les données changent.

> Il est important de noter que la version 14 fait de la mise en cache plus aggressive que dans la version 15

## Request Memoization

Nextjs mémorise les requêtes **identiques** (2 requêtes pointant la même ressource mais avec des paramètres de header différents ne sont pas considérées comme identiques) et réutilisera la réponse partout dans l'application pour un même appel. 
C'est à dire que changer de page et revenir sur la page réalisant la requête, ne mettra pas les données à jour.

Ceci est **vrai pour la version 14** de NextJS.

## Options de rafraichissement du cache

### revalidatePath

Pour cela on utilise ````revalidatePath()````. On utilise ````revalidatePath()```` **avant** de faire une redirection

````typescript
revalidatePath('/', 'layout');
````

### Configuration fetch (unitairement)

**Paramètre cache**

NextJS surcharge la fonction fetch de javascript. Il est alors possible d'agir sur le cache via le paramètre ````cache````

* ````force-cache```` : comportement aggréssif équivalent à la gestion du cache de Next 14
* ````no-store```` : **NextJS 15 ou plus**, force Nextjs à toujours envoyer une nouvelle requête

**Important** : l'option ````no-store```` est active **uniquement** pour la requête sur laquelle elle est ajoutée. C'est à dire que si une requête **identique** est utilisée ailleurs dans l'application, **sans** l'option ````no-store````, alors la seconde requête sera mise en cache

**Important** : l'option ````no-store```` aura aussi pour effet de supprimer la mise en cache de la route, et donc rafraichir la page à chaque fois que de nouvelles données seront requêttées.

**Paramètre next**

Next met aussi à disposition un paramètre ````next```` dans la fonction fetch, permettant de configurer le temps (en secondes) durant lequel next va continuer d'utiliser les données en cache **avant** de revalider le cache :

````typescript
const response = await fetch('http://localhost:8080/messages', {
	next: { revalidate: 5 }}
	);
````

````5```` est le nombre de secondes durant lequel Nextjs continue d'utiliser le cache avant de revalider le cache

### Configuration fetch (globale au fichier)

Il est possible de configurer le cache des requêtes de manière globale à un fichier, via la déclaration globale de constantes. Ceci permet d'éviter de paramétrer à la main toutes les requêtes d'un même composant / fichier

Ainsi la déclaration de la constante ````export const revalidate = 5```` aura le même effet que l'ajout du paramètre ````next: { revalidate: 5 }```` dans la requête fetch.

La déclaration de la constante ````export const dynamic = 'force-dynamic'```` aura le même effet que l'ajout du paramètre ````cache: no-store```` dans la requête fetch.

**Attention** : Il est important d'exporter ces constantes, ainsi que de respecter les nommages ````revalidate```` et ````dynamic```` qui sont des noms réservés

*app/message/page.tsx*

````typescript

/** Différentes constantes de paramétrage global **/

// export const revalidate = 5
export const dynamic = 'force-dynamic'
// export const dynamic = 'force-static'

import Messages from "@/components/messages";

export default async function MessagesPage() {
  const response = await fetch("http://localhost:8080/messages");
  const messages = await response.json();

  if (!messages || messages.length === 0) {
    return <p>No messages found</p>;
  }

  return <Messages messages={messages} />;
}
````

**Important** l'ajout de la constante ````export const dynamic = 'force-dynamic'```` va rendre la page dynamique lors de la compilation :

![next-cache-page](https://github.com/user-attachments/assets/53d2aac4-95b2-474a-bfa0-ac0b56358d33)

