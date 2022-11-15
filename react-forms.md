
[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Forms

## Méthode avec champ uncontrolled

Cettte méthode est à privilégier dans la majorité des cas car elle ne procède pas à un repaint du composant à chaque saisie et c'est le dom qui gère tout seul les données

````tsx
const Form = () => {
  const handleSubmit = (e) => {
	e.preventDefault();
	const form = e.target
	
	// Version Typescript à privilégier pour le typage
	const formData = new FormData(form);
	const username = formData.get('username');	// Ne pas oublier la propriété "name" dans la vue car formData se base dessus
	
	// Version JS pur
	const el = form.elements;
	const username = el.username.value;

	form.reset();
 }

  return (
    <form onSubmit="{handleSubmit}">
	<label htmlFor="username">Username</label>
	<input type="text" id="username" name="username"/>
	<button type="submit">Submit</button>
    </form>
  );
};
````

## Méthode useState

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> la manipulation de formulaires via la méthode *useState* a pour conséquence de re-rendre la vue à chaque modification de la valeur d'un champ de saisie. C'est pourquoi cette méthode n'est à privilégier que pour les champs de type searchbar (avec recherche sans validation via un bouton) ou lorsqu'on a besoin de faire un traitement dès que l'on observe une modification d'un champ ou si l'on souhaite gérer l'affichage d'erreurs de saisie en direct.

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
			<button type="submit">envoyer</submit>
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
