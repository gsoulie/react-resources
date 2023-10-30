[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# SWR

* [Présentation](#présentation)
* [Chargement de données](#chargement-de-données)
* [Configuration globale](#configuration-blogale)     

* https://swr.vercel.app/docs/getting-started
* https://paco.me/writing/shared-hook-state-with-swr 

## Présentation

SWR pour Next.js est une bibliothèque qui permet de récupérer des données en temps réel depuis un serveur, de les mettre en cache localement pour une utilisation rapide, et de les actualiser automatiquement en arrière-plan pour garantir que les données sont toujours à jour. Cela améliore les performances de votre application en évitant les appels inutiles au serveur tout en offrant une expérience utilisateur fluide.

SWR peut être utilisé pour la récupération de données http ou bien pour gérer un contexte (comme redux ou useContext). En effet, il prend en paramètre une fonction de type fetcher http ou des objets json.

*Prototype*
````
useSWR(<key>, <data fetching function>)
// ou
useSWR(<key>, {fallbackData: <chaîne de caractère>})
````

> Bonne pratique : nommer la key avec un format de type "path" pour éviter toute collision

> Attention : ````useSWR```` n'est **accessible que côté client**

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

### Déclaration swr sous forme de hook

*useSuppliers.tsx*
````typescript
import { apiRoutes } from "@/helpers/api-routes";
import { SupplierDTO } from "@/helpers/models/supplier.model";
import { swrKeys } from "@/helpers/swrKeys";
import useSWR from "swr";

const fetcher = async () => {
  // ==> Appel l'api définie dans le répertoire api
  const response = await fetch(
      process.env.NEXT_PUBLIC_BASE_URL + apiRoutes.suppliers,
      { method: 'GET' }
    );
  const resultat = await response.json();
  return resultat?.suppliers as SupplierDTO[] || [];
};
const useSuppliers = () => {
  const { data, mutate, error, isLoading } = useSWR(swrKeys.suppliers, fetcher);
  return { suppliers: data, error, isLoading, setSuppliers: mutate };
};
export default useSuppliers;
````

Déclaration de l'api 

*app/api/suppliers/route.ts*
````typescript
import { routesAPI } from "@/helpers/routesBackendAPI";
import { useHttp } from "@/lib/hooks/useHttp";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse): Promise<Response> {

  const apiResponse = await useHttp({
    url: process.env.NEXT_PUBLIC_API_URL + routesAPI.suppliers.getAllAvailable,
    method: 'GET'
  });
  
  if (apiResponse.err) {
    console.log('GET suppliers Error', apiResponse.err);
    return NextResponse.json({ suppliers: null, error: apiResponse.err });
  }

  return NextResponse.json({ suppliers: apiResponse.data || null });
}
````

S'utilise de la manière suivante dans les composants :

````typescript
const { suppliers, isLoading, error } = useSuppliers();
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
