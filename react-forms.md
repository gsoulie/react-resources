
[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Forms

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

## Méthode avec champ uncontrolled

Cettte méthode est à privilégier dans la majorité des cas car elle ne procède pas à un repaint du composant à chaque saisie

````tsx
const Form = () => {
  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    const name = form.elements.name.value;

    alert(`Submitted ${name}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" id="name" />
      <button type="submit">Submit</button>
    </form>
  );
};
````

[Back to top](#forms)     
