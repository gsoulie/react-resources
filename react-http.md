

[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Http

* [fetch](#fetch)     
* [axios](#axios)    
* [Intercepteur http](#intercepteur-http)     

## Fetch

La méthode basique pour faire des appels http consiste à utiliser la méthode *fetch*

````tsx
getPost = async () => {
	const response = await  fetch('https://jsonplaceholder.typicode.com/posts', {
	    method: 'GET'
	  });
	if(!response.ok) {
		throw { message: 'Failed to fetch posts', status: 500 };
	}
	return response.json();
}
````

## Axios

Comme avec Vue, il est pratique d'utiliser **Axios** pour gérer les appels http

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

[Back to top](#http)     
