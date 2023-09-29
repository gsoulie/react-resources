[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Http

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