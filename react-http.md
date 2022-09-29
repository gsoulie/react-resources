

[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Http

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
