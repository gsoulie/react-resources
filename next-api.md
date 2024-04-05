[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# api

* [Template basique](#template-basique)     

Une bonne pratique consiste à créer des api "middleware" qui auront pour role d'effectuer les appels http. De cette manière, les appels http seront "masqués" côté navigateur

Pour pravenir à ceci, il faut utiliser le répertoire ````api```` à l'intérieur du répertoire ````app````

````
app
 └── api		// répertoire contenant les api
      ├── healthcheck
      │      └── route.ts
      └── users
             └── route.ts
````
Une api se définie dans un fichier ````route.ts```` à l'intérieur duquel nous allons définir toutes les api correspondant à la route /api/<domain>. Ci-dessous, nous avons donc 2 routes internes :

* /api/healthcheck
* /api/users

Le fichier route.ts contiendra alors toutes les méthodes ````GET, POST, PUT, PATCH, DELETE```` de sa route. 

<details>
  <summary>Exemple d'implémentation</summary>


*/api/session/route.ts*
````typescript
import { routesAPI } from "@/helpers/routesBackendAPI";
import { useHttp } from "@/lib/hooks/useHttp";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import decode from 'jwt-decode';
import { CustomKeys } from "@/helpers/keys";

export async function GET(req: NextRequest, res: NextResponse): Promise<Response> {
  let userSession: any;

  // Récupération des cookies
  const cookieStore = cookies();

  // Récupération du token en cours
  const tokenCookie = cookieStore.get(CustomKeys.token);
  const token = tokenCookie ? tokenCookie.value : null;

  if (!token || token === '') {
    return NextResponse.json({ isLogged: false, message: "Aucune session active" });
  }

  // On récupère les informations de l'utilisateur connecté
  userSession = decode(token);

  const user = {
    firstName: userSession.given_name,
    lastName: userSession.family_name,
    email: userSession.email,
  }

  return NextResponse.json({ isLogged: true, user: user });
}

export async function POST(req: NextRequest, res: NextResponse): Promise<Response> {

  let userSession;

  // Récupération des cookies
  const cookieStore = cookies();

  // Récupération du token en cours
  const tokenCookie = cookieStore.get('refresh_token');
  const token = tokenCookie ? tokenCookie.value : '';

  const httpResponse = await useHttp({
    url: process.env.NEXT_PUBLIC_API_URL + routesAPI.auth.session,
    method: "POST",
    body: {
      token,
    },
  });

  if (!httpResponse.err && httpResponse.data) {
    userSession = httpResponse.data;
  } else {
    // On vide la session 
    cookies().set(CustomKeys.token, "");
    cookies().set(CustomKeys.refreshToken, "");

    return NextResponse.json({ isLogged: false, message: "Utilisateur non autorisé" }, { status: 403 });
  }

  const user = {
    firstName: userSession.given_name,
    lastName: userSession.family_name,
    email: userSession.email,
  }

  return NextResponse.json({ isLogged: true, user: user });
}

````

L'appel de cette api se fera ensuite via un hook ou un composant via un fetch pointant vers la route de cette api (/api/users) comme s'il s'agissait d'un routage de page

````typescript
const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_URL + '/api/users',
    { method: "GET" }
  );
  const resultat = await response.json();
````

> Important : un fichier api pouvant contenir plusieurs méthodes http (POST, GET, DELETE...), il est important de spécifier la méthode voulue lors du fetch pour sélectionner la bonne fonction à exécuter
> 
</details>

## template basique

<details>
 <summary>Exemple de template api</summary>

*api/user/route.ts*

````typescript
export async function GET(req: NextRequest, res: NextResponse): Promise<Response> {
  Object.assign(headers, { "Content-Type": "application/json" });
  Object.assign(headers, { Accept: "application/json" });

  try {
    const response = await fetch('<url>');
    const data = await response.json();

    return new Response(data, { status: 200 })
  } catch (error) {
    return new Response('Erreur du serveur', { status: 500});
  }
}

export async function POST(req: NextRequest, res: NextResponse): Promise<Response> {
  try {
	const requestData = await req.json();
    const response = await fetch('<url>', {
		method: 'POST',
		body: JSON.stringify(requestData),
		headers: { 'Content-Type': 'application/json'}
	});
    const data = await response.json();

    return new Response(data, { status: 201 })
  } catch (error) {
    return new Response('Erreur du serveur', { status: 500});
  }
}
````
</details>
