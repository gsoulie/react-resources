

[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Http

* [fetch](#fetch)     
* [axios](#axios)    
* [Intercepteur http](#intercepteur-http)     

## Fetch

<details>
	<summary>La méthode basique pour faire des appels http consiste à utiliser la méthode *fetch*</summary>

 
````tsx
type Post = {
    title: string;
    message: string;
}
async fetchData<T>(url: string) => {
    const response = await  fetch(url, { method: 'GET' });
    if(!response.ok) {
	throw { message: 'Failed to fetch posts', status: 500 };
	return null;
    }
    return response.json() as T;
}

const Component = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    useEffect(() => {
        fetchData<Post>('/api/posts')
	.then((json) => {
	    ...
	    setPosts(json)
	})
    }, [])
}
````

````typescript
const res = await fetch('/user', {
  headers: {
    // ✅ If we are sending serialized JSON, we should set the Content-Type:
    'Content-Type': 'application/json'
  },
  method: 'POST',
  body: JSON.stringify({ name: 'Steve Sewell', company: 'Builder.io' })
})
````

</details>

## Axios

<details>
	<summary>Comme avec Vue, il est pratique d'utiliser **Axios** pour gérer les appels http</summary>

 
````npm i axios````

````tsx
export const UserList = () => {

	const [users, setUsers] = useState<any[]>([]);
	const [err, setError] = useState(null);
	
	async function fetchUsers() {
		try {
		  axios.get('https://dummyjson.com/users')
			.then(res => {
			  setUsers(res.data.users);
			  setError(null);
			})
			.catch(e => {
			  setUsers([]);
			  setError(e.message);
			});
		} catch (e) {
		  console.log('error over here');
		  setError(e);
		}
	}

	useEffect(() => {
		fetchUsers();
	}, []);
}
````

<details>
	<summary>Exemple de Helper basé sur axios</summary>

 ````typescript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com/',
});

// Function to handle API errors
const handleError = (error) => {
  if (error.response) {
    // The request was made and the server responded with a status code outside the 2xx range
    console.error(error.response.data);
    console.error(error.response.status);
    console.error(error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.error(error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('Error', error.message);
  }
  console.error(error.config);
};

export default class ApiService {
  static async get(path) {
    try {
      const response = await api.get(path);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  static async post(path, payload) {
    try {
      const response = await api.post(path, payload);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  static async put(path, payload) {
    try {
      const response = await api.put(path, payload);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }

  static async delete(path) {
    try {
      const response = await api.delete(path);
      return response.data;
    } catch (error) {
      handleError(error);
    }
  }
}
````

**Utilisation**

````typescript
import ApiService from './ApiService';

const fetchData = async () => {
  const data = await ApiService.get('/data');
  return data;
};
````
</details>

</details>

[Back to top](#http)     

## Intercepteur http

Gestion des intercepteurs http avec axios : 

*httpInterceptor.ts*

````typescript
import axios from 'axios';

// Intercepteur de requête : permet de modifier les en-têtes par exemple
export const requestInterceptor = () => {

  axios.interceptors.request.use(
    (request) => {
      console.log('axios interception', request);
      const token = '<access_token>'//localStorageService.getAccessToken()
      if (token) {
        request.headers['Authorization'] = 'Bearer ' + token
      }
      // config.headers['Content-Type'] = 'application/json';
      return request;
    },
    (error) => {
      Promise.reject(error)
    }
  )
}

// Intercepteur de réponse : permet de gérer les codes retours
export const responseInterceptor = () => {
  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
 
      // -- Gérer le retry --
      // if (error.config && error.response && error.response.status === 401) {
      //   return updateToken().then((token) => {
      //     error.config.headers.xxxx <= set the token
      //     return axios.request(config);
      //   });
      // }
      
      if (error?.response?.status === 404) {
        // Not found
        throw new Error(error?.message);
      }
      if (error?.response?.statuse === 401) {

        // Non autorisé, redirection login etc...

        return alert('UNAUTHORIZED');
      }

      throw new Error(error?.message);
    }

  )
}
````

Appel depuis le *main.tsx*

*main.tsx*

````tsx
import { responseInterceptor, requestInterceptor } from './shared/hooks/httpInterceptor.interceptor';

requestInterceptor();
responseInterceptor();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
<BrowserRouter>
    <App />
</BrowserRouter>    
)
````

### Interceptor Axios vs Fetch classique

*Interceptor Axios*

````typescript
import axios from "axios";

// Créez une instance d'Axios avec une configuration par défaut
const instance = axios.create({
  baseURL: "http://localhost:3000",
});

// Ajouter un interceptor pour injecter le bearer token dans le header de chaque requête
instance.interceptors.request.use((config) => {
  // Récupérer le token depuis localStorage, ou tout autre endroit où vous l'avez stocké
  const token = localStorage.getItem("token");

  // Si un token existe, ajoutez-le dans le header de la requête
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;

````

*Interceptor Fetch*

````typescript
function fetchWithAuth(url, options) {
  const token = localStorage.getItem("token");
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
  const headers = Object.assign({}, authHeaders, options.headers || {});
  return fetch(url, { ...options, headers });
}


// Appel

fetchWithAuth("http://example.com/api/data")
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));
````

[Back to top](#http)     
