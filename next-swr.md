[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# SWR

* https://swr.vercel.app/docs/getting-started
* https://paco.me/writing/shared-hook-state-with-swr 

## Présentation

SWR pour Next.js est une bibliothèque qui permet de récupérer des données en temps réel depuis un serveur, de les mettre en cache localement pour une utilisation rapide, et de les actualiser automatiquement en arrière-plan pour garantir que les données sont toujours à jour. Cela améliore les performances de votre application en évitant les appels inutiles au serveur tout en offrant une expérience utilisateur fluide.

SWR peut être utilisé pour la récupération de données http ou bien pour gérer un contexte (comme redux ou useContext). En effet, il prend en paramètre une fonction de type fetcher http ou des objets json.

*Prototype*
````
useSWR(<key>, <data fetching function>)
// ou
useSWR(<key>, {fallbackData: <objet json ou type de base>})
````

> Bonne pratique : nommer la key avec un format de type "path" pour éviter toute collision

> Attention : ````useSWR```` n'est accessible que côté client

## Chargement de données

<details>
	<summary>Exemples d'utilisation</summary>

### Méthode classique useState et useEffect

````typescript
function Dashboard() {
	const [isLoading, setIsLoading] = useState(true);
	const [dashboardData, setDashboardData] = useState(null);
	
	useEffect(() => {
		async function fetchData() {
			const response = await fetch("https://");
			const data = await response.json();
			setDashboardData(data);
			setIsLoading(false);
		}
		fetchData();
	}, [])
}	
````

### Méthode avec swr

````typescript
"use client"
import useSWR from 'swr';

const fetcher = async () => {
	const response = await fetch("https://");
	const data = await response.json();
	return data
}

function Dashboard() {
	const { data, error, isLoading } = useSWR('/api/dashboard', fetcher);
	
	// Initialisation avec des données provenant d'un objet json pour remplacer le contexte par exemple
	// const { data, error, isLoading } = useSWR('/api/dashboard', {fallbackData: "dummy"});

	if(error) return 'An error occurred';
	if(!data) return 'Loading';
	
	return (
		<>
			<h2>Posts</h2>
			<ul>
				{ data && data.map((p) => {
					<li key={p.id}>{ p.title }</li>
				}}
			</ul>
		</>
	)
}	
````

*Exemple d'utilisation dans un composant enfant*

````typescript
export const Compo2 = () => {
const { data, mutate } = useSWR("/api/user");
  

const handleChangeName = (e) => {
	mutate(e.target.value);
}

  return (
    <div>
      <h1>Composant 2</h1>
      <h4>
        <input type="text" defaultValue={data} onChange={handleChangeName} />
      </h4>
    </div>
  );
};
````

</details>

## Configuration globale

Si vous avez besoin d'utiliser SWRConfig pour effectuer une configuration globale dans vos layout ou vos pages, mais que vous ne souhaitez pas faire un layout ou une page en mode client, vous pouvez créer un composant séparé.

*my-provider.tsx*
````typescript
'use client';
import { SWRConfig } from 'swr'
export const MyProvider = ({ children }) => {
  return <SWRConfig>{children}</SWRConfig>
};
````

*layout.tsx*
````typescript
import { MyProvider } from './my-provider'
export default function Layout({ children }) {
  return <MyProvider>{children}</MyProvider>
}
````
