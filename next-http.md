[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Http
* [Interceptor - Middleware](#interceptor)
* [Middleware](#middleware)
* [Tanstack react-query](#tanstack-react-query)     

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

### Autre exemple d'interceptor

<details>
  <summary>http.js</summary>

````typescript

*http.js*

import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const rootUrlBackend = process.env.NEXT_PUBLIC_ROOT_URL;

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

const instancePublic = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

instance.interceptors.request.use(
  (config) => {
    if (config.url.includes('/public')) {
      return config;
    }

    if (config.method === 'post' && config.url === '/security/refresh') {
      return config;
    }

    if (config.method === 'patch') {
      config.headers['Content-Type'] = 'application/merge-patch+json';
    }

    if (config.authorization !== false) {
      const token = useAuthStore.getState().accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (config) => config,
  (error) => {
    const originalRequest = error.config;
    originalRequest.headers = JSON.parse(JSON.stringify(originalRequest.headers || {}));
    const refreshToken = useAuthStore.getState().refreshToken;

    const handleError = (error) => {
      useAuthStore.getState().logout();
      window.location.reload();
      return Promise.reject(error);
    };

    if (error.response?.status === 401) {
      if (refreshToken && error.response?.data?.error === 'Expired token') {
        instance
          .post('/security/refresh', {
            refreshToken: refreshToken,
          })
          .then((response) => {
            const refreshedAuthDatas = {
              accessToken: response.data.accessToken,
              refreshToken: response.data.refreshToken,
              roles: response.data.roles ?? [],
              permissions: response.data.permissions ?? [],
            };
            useAuthStore.getState().setRefreshedAuthDatas(refreshedAuthDatas);
            return Promise.resolve();
          }, handleError);
      } else {
        useAuthStore.getState().logout();
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
export { instancePublic, rootUrlBackend };
````

<details>
  <summary>authStore.js</summary>

````typescript
import Cookies from 'js-cookie';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      fullName: '',
      login: (authData) => {
        Cookies.set('token', authData.token, { sameSite: 'strict' });
        return set(() => ({
          isLoggedIn: true,
          accessToken: authData.token,
          refreshToken: authData.refreshToken,
          fullName: authData.fullName,
          roles: authData.roles,
          permissions: authData.permissions,
        }));
      },
      logout: () => {
        Cookies.remove('token');
        return set(() => ({
          isLoggedIn: false,
          accessToken: null,
          refreshToken: null,
          fullName: '',
          roles: [],
          permissions: [],
        }));
      },
      setRefreshedAuthDatas: (authDatas) => {
        Cookies.set('token', authDatas.accessToken, { sameSite: 'strict' });
        return set(() => ({
          accessToken: authDatas.accessToken,
          refreshToken: authDatas.refreshToken,
          roles: authDatas.roles,
          permissions: authDatas.permissions,
        }));
      },
    }),
    {
      name: 'auth',
    }
  )
);

````
  
</details>
  
</details>

## Tanstack react-query

TanStack Query (souvent appelé React Query lorsqu'il est utilisé avec React) est une bibliothèque de gestion de l'état serveur pour les applications JavaScript, particulièrement populaires dans l'écosystème React. Elle facilite la gestion des données asynchrones (comme les appels API) en offrant des outils pour la récupération, la mise en cache, la synchronisation et la mise à jour des données serveur.

**Avantages de TanStack Query**

* Gestion simplifiée des requêtes asynchrones : Vous pouvez facilement récupérer, mettre en cache, synchroniser et mettre à jour les données.
* Caching efficace : Les données récupérées sont mises en cache, ce qui réduit les appels API redondants et améliore les performances.
* Invalider et refetcher : Permet d'invalider les données et de les récupérer à nouveau facilement lorsque cela est nécessaire.
* Synchronisation automatique : Les données peuvent être synchronisées en arrière-plan, s'assurer qu'elles sont toujours à jour.
* Gestion des erreurs et des états de chargement : Fournit des hooks pour gérer facilement les états de chargement, de succès et d'erreur des requêtes.
* Mutations : Facilite la mise à jour des données côté serveur et la mise à jour correspondante du cache local.
* Support pour les requêtes dépendantes : Permet de définir des requêtes qui dépendent des résultats d'autres requêtes.
* Développement et tests simplifiés : Simplifie le développement d'applications réactives et facilite les tests unitaires grâce à la séparation claire des préoccupations et à la gestion prévisible des états.

**Cas d'usage préconisés**

* Applications avec de nombreux appels API : Idéal pour les applications qui font beaucoup d'appels API et nécessitent une gestion efficace des états de chargement, de succès et d'erreur.
* Applications avec données dynamiques : Parfait pour les applications où les données changent fréquemment et doivent être synchronisées en temps réel (par exemple, tableaux de bord, applications de chat).
* Projets nécessitant des mises à jour optimistes : Utile pour les applications où les mises à jour optimistes (mettre à jour l'UI avant que l'API ne confirme la mise à jour) améliorent l'expérience utilisateur.
* Applications avec des données complexes et interdépendantes : Idéal pour les applications où les données dépendent les unes des autres et où les requêtes doivent être coordonnées.

Installer react-query
````
npm i react-query
````

<details>
  <summary>Implémentation</summary>

Pour illustrer l'utilisation de *Tanstack*, nous allons utiliser une *server action* définie dans un fichiers */app/actions.ts*, qui appelle l'api Next */app/api/user/routes.ts*

*Tanstack* met à disposition deux hooks principaux ````useQuery```` principalement utilisée pour la récupération de données (ie: ````GET````) et ````useMutation```` utilisée plutôt pour les requêtes modifiant les données (````POST, PUT, PATCH, DELETE````) 

Dans cet exemple on utilise deux composants ````<TanstackGET />```` et ````<TanstackPOST />```` pour illustrer les deux types d'appels. *Tanstack* est accessible **côté client**, et doit définir un contexte ````<QueryClientProvider>```` qui accueil les composants utilisant *Tanstack* . 

Les *server actions* doivent être définies dans un composant **server** en ajoutant ````"use server"````

> **Important** : Il n'y a pas de mise en cache avec les *server actions*, d'autre part, ces dernières s'exécutent séquentiellement et non en parrallèle.

*/app/actions.ts*
````typescript
"use server"

export const getUser = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/user", { method: "GET" });
    const resultat = await response.json();

    if (response.ok) {
      return resultat;
    } else {
      const { status, statusText } = await response;
      throw { err: { status, statusText }, data: null };
    }
  } catch (e: any) {
    throw { err: { status: e?.err.status ?? 500, statusText: e?.err?.statusText ?? 'Server error' }, data: null };
  }
}
````

*/app/api/user/route.ts*
````typescript
export async function GET() {
  return NextResponse.json({ message: "John DOE" });
}
````

*Tanstack.tsx*
````typescript
"use client";

import { getUser } from "@/app/actions";
import React from "react";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
} from "react-query";

const queryClient = new QueryClient();

export const Tanstack = () => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
          <TanstackGET />
          <TanstackPOST />
      </QueryClientProvider>
    </>
  );
};
````

*TanstackGET.tsx*
````typescript
export const TanstackGET = () => {
  const { data, isLoading, error } = useQuery({
    queryFn: () => getUser(),
    onSuccess: () => {},
    onError: () => {
      console.log("tanstack error");
    },
  });

  return (
    <>
      <div>Tanstack - useQuery (GET)</div>
      {isLoading && <h1>Loading user...</h1>}
      {error && <h1>Tanstack Error !</h1>}
      <h1>{data?.message}</h1>
    </>
  );
};
````

*TanstackPOST.tsx*
````typescript
export const TanstackPOST = () => {
  // useMutation est généralement utilisé pour les API qui transforment les data (POST / PUT)
  const {
    data,
    mutate: server_getUser,
    isLoading,
    error,
  } = useMutation({
    mutationFn: getUser,
    onSuccess: () => {},
    onError: () => {},
  });

  return (
    <>
      <div>Tanstack - useMutation (POST)</div>

      <button className="btn-primary m-4" onClick={() => server_getUser()}>
        Search
      </button>
      {isLoading && <h1>Loading user...</h1>}
      {error && <h1>Tanstack Error !</h1>}
      <h1>{data?.message}</h1>
    </>
  );
};
````
  
</details>
