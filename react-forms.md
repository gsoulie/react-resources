
[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Forms

## [Exemples de validation basique de formulaire avec utilisation de custom hook](https://github.com/gsoulie/react-resources/tree/main/react-forms)

## Méthode avec champ uncontrolled

**ATTENTION** : à placer dans un composant **client** avec ````"use client"````

Cettte méthode est à privilégier dans la majorité des cas car elle ne procède pas à un repaint du composant à chaque saisie et c'est le dom qui gère tout seul les données

````tsx
import { FormEvent } from "react";

const Form = () => {
  const handleSubmit = (e: React.FormEvent) => {	// typage alternatif (e: FormEvent<HTMLFormElement>)
	e.preventDefault();
	const form = e.target
	
	// Version Typescript à privilégier pour le typage
	const formData = new FormData(form);
	const username = formData.get('username');	// Ne pas oublier la propriété "name" dans la vue car formData se base dessus
	
	// Récupérer tous les champs du formulaires d'un coup
	const values = Object.fromEntries(formData); // => { username: 'toto', tel: '06060606' }
	
	// variante avec destructuration
	const { username, tel} = Object.fromEntries(formData);
	
	// Version JS pur
	const el = form.elements;
	const username = el.username.value;

	form.reset();
 }

  return (
    <form onSubmit="{handleSubmit}">
	<label htmlFor="username">Username</label>
	<input type="text" id="username" name="username"/>
	
	<label htmlFor="tel">Telephone</label>
	<input type="text" id="tel" name="tel"/>
	<button type="submit">Submit</button>
    </form>
  );
};
````

### Conversion des valeurs du formulaire

Pour convertir les résultats, il faut au préalable passer par un *toString()*

````typescript
// Conversion d'un input date
const date = formData.get("date")?.toString() || "";
const dateValue = date ? new Date(Date.parse(date)) : null;

// Conversion d'un input number
const amount = formData.get("amount")?.toString() || 0;
const amountValue = amount ? parseFloat(amount) : 0;
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

## Méthode useRef

La dernière méthode consiste à utiliser le hook **useRef**

````typescript
const userNameRef = useRef<HTMLInputElement>(null);

const submitHandler = (e: React.FormEvent) {
	e.preventDefault();

	const value = userNameRef.current?.value;
}

return (
	<form onSubmit={submitHandler}>
		<input id="username" ref={userNameRef} />
	...
)
````
