[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Http
* [Interceptor - Middleware](#interceptor)
* [Middleware](#middleware)    

## Exemple d'utilisation type

<details>
  <summary>Cas simple</summary>

*fetcher*
````typescript
async function getData(params) {
  try {
    const response: Response = await fetch(
      'https://...',
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        cache: 'default'
      })
 
    if (response.ok) {
        return { err: null, data: await response.json()}
    } else {
      const { status, code } = await response.json();
      return { err: { status, code }, data: null}
      }
  } catch (err) {
    return { err: { status: 500, code: 'SERVER_ERROR' }, data: null };
  }
}
````

*utilisation*
````typescript
const { err, data } = await getData();
if (err && err.status === 404) {
  return notFound();
}
if (err && err.status === 500) {
  redirect('/500');
}
````

</details>

## Récupération du bearer coté serveur

````typescript
const cookieStore = cookies();
const token = cookieStore.get("token");
const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
const headers = Object.assign({}, authHeaders, requestConfig.headers || {});

const response: Response = await fetch("url", {
  method: requestConfig.method || "GET",
  headers: headers || {},
  cache: requestConfig.cache || "default",
  body: JSON.stringify(requestConfig.body) || null,
});
````

## Interceptor

https://nextjs.org/docs/app/building-your-application/routing/middleware

Le middleware permet d'exécuter du code avant qu'une requête ne soit terminée. Ensuite, en fonction de la demande entrante, il est possible de modifier la réponse en réécrivant, en redirigeant, en modifiant les en-têtes de demande ou de réponse, ou en répondant directement.

## Middleware

<details>
  <summary>Exemple d'implémentation de middleware</summary>

````typescript
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import { CustomKeys } from './helpers/keys';

export async function middleware(request: NextRequest) {

  const token = request.cookies.get(CustomKeys.token)?.value;  

  if (token) {
    // const requestHeaders = new Headers(request.headers);
    // requestHeaders.set('Authorization', `Bearer ${token}`);
    const newRequest = new NextRequest(request, { headers: { Authorization: `Bearer ${token}` } });
    return NextResponse.next(newRequest);
  }
  
  return NextResponse.next();
}
````
</details>
