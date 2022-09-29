
[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Forms


````tsx
export const Form = ({ addTodoEvent }) => {

	const [fruits, setFruits] = useState<{id: nmber, nom: string}>([]);
	const [newFruit, setNewFruit] = useState('');
	
	const handleSubmit = (e) => {
		e.preventDefault();
		
		setFruits(curr => (...curr, { id: Date.now(), nom: newFruit }));
		
		setNewFruit('');
	} 
	
	const handleChange = (e) => {
		setNewFruit(e.target.value);
	}
	
	return (
		<form action="submit" onSubmit={handleSubmit}>
			<input value={inputRef} onChange={handleChange} />
			<button>envoyer</submit>
		</form>
		<ul>
			{fruits.map(f => (
				<li key={f.id}>{ f.nom }</li>
			))}
		</ul>
	)
}
````

[Back to top](#forms)     
