[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Test

* [Outils](#outils)
* [Anatomie des tests](#anatomie-des-tests)
* [Tester un changement de state](#tester-un-changement-de-state)
* [Tester des composants asynchrones](#tester-des-composants-asynchrones)    

## Outils

Les outils les plus populaires pour réaliser les unitaires et simuler (rendering) l'application dans un browser, sont **Jest** et **React Testing Library**

L'exécution des tests se fait via la commande ````npm test````

## Anatomie des tests

<details>
	<summary>Organisation des tests</summary>
	
Un test basique est déclaré via la fonction ````test(...)````
	
*App.test.ts*
````typescript
import { render, screen } from '@testing-library/react';

test('renders Greeting as a text', () => {
	// Arange
	render(<Greeting />);
	
	// Act - perform main action
	
	// Assert - Compare
	const greetingElement = screen.getByText('Greeting', { exact: false });
	expect(greetingElement).toBeInTheDocument();
})

// Autre test etc...
test('', () => {})
````

On peut ensuite *regrouper* les tests par "domaine", ou s'ils concernent un même élément, en les regroupant sous la fonction ````describe()````

````typescript
describe('Greeting component', () => {

	test('renders Greeting as a text', () => {
		render(<Greeting />);
		const greetingElement = screen.getByText('Greeting', { exact: false });
		expect(greetingElement).toBeInTheDocument();
	})
	
	// autres tests sur Greeting component etc...
})
````
	
</details>

## Tester un changement de state

<details>
	<summary></summary>
	
Dans cet exemple, le composant affiche un texte par défaut. Lorsqu'on clique sur un bouton, on change l'état du state et on modifie le texte affiché

*Greeting.ts*	
````typescript
import React, { useState } from "react";

export const Greeting = () => {
  const [changedText, setChangedText] = useState(false);

  const clickHandler = () => { setChangedText(true); };

  return (
    <>
      <h2>Greeting</h2>
      {!changedText && <p>Good to see you</p>}
      {changedText && <p>Changed !</p>}
	  
      <button data-testid="btn-change" onClick={clickHandler}>
        Change text
      </button>
    </>
  );
};

````

*Greeting.test.ts*	
````typescript
import { render, screen } from "@testing-library/react";
import { Greeting } from "./Greeting";
import userEvent from "@testing-library/user-event";

describe("Greeting component", () => {
  test("renders greeting as a text", () => {
    // Arrange
    render(<Greeting />);

    // Act - Perform main action

    // Assert - compare
    //screen : accéder au virtual dom
    const greetingElement = screen.getByText("Greeting", { exact: false });
    expect(greetingElement).toBeInTheDocument();
  });

  test("initial text without changed", () => {
    render(<Greeting />);
    const initial = screen.getByText("Good to see you", { exact: false });
    expect(initial).toBeInTheDocument();
  });

  test("initial text changed after button click", () => {
    render(<Greeting />);

    // Act - click on button
    const buttonElement = screen.getByTestId("btn-change");
    userEvent.click(buttonElement);

    const changed = screen.getByText("Changed !");
    expect(changed).toBeInTheDocument();
  });

  // Bien s'assurer que l'élément contenant le texte initial est bien supprimé de l'affichage
  test("initial text does not render after button click", () => {
    render(<Greeting />);

    const buttonElement = screen.getByTestId("btn-change");
    userEvent.click(buttonElement);

    const initial = screen.queryByText("Good to see you", { exact: false });
    expect(initial).toBeNull();
  });
});

````

### Référence d'un élément

Il existe plusieurs manières de récupérer la référence d'un élément du DOM, en voici quelques unes

````typescript
const buttonElement = screen.getByRole('button');

const buttonElement = screen.getByText("Change text");

const buttonElement = screen.getByTestId("btn-change");	// nécessite l'ajout d'un attribut data-testid sur l'élément
````

### Syntaxe alternative

````typescript
test("initial text does not render after button click", () => {
	render(<Greeting />);

	const buttonElement = screen.getByTestId("btn-change");
	userEvent.click(buttonElement);

	const initial = screen.queryByText("Good to see you", { exact: false });
	expect(initial).toBeNull();
});
  
// === OU (attention à l'ordre d'appel du click sur le bouton ! ===

	test("initial text does not render after button click", () => {
	render(<Greeting />);

	const buttonElement = screen.getByTestId("btn-change");
	const initial = screen.getByText("Good to see you", { exact: false });

	userEvent.click(buttonElement);    // doit être appelé après avoir récupéré la référence à l'élément "initial"
	expect(initial).not.toBeInTheDocument();
});
````

[Back to top](#test)     

</details>

## Tester les composants asynchrones

<details>
	<summary>Fonctionnement basique</summary>
	
*Async.js*
````typescript
import { useEffect, useState } from "react";

const Async = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);

  return (
    <div>
      <ul data-testid="post-list">
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Async;
````

Pour tester les composants asynchrone, il faut penser à déclarer le test comme ````async```` et attendre la réponse de l'appel http avant de tester l'existance de l'élément

*Async.test.js*
````typescript
import { render, screen } from "@testing-library/react";
import Async from "./Async";

describe("Async component", () => {
  test("renders posts if request succeeds", async () => {
    render(<Async />);

    const list = await screen.findAllByRole("listitem");
    expect(list).not.toHaveLength(0);
  });
});

````

[Back to top](#test)     

</details>

<details>
	<summary>Bonne pratique</summary>
	
Terster les composants asynchrones en exécutant des requêtes http n'est généralement pas une bonne pratique, surtout si beaucoup de tests nécessitent des appels http.

La bonne pratique consiste donc à travailler avec des *mock* pour remplacer les appels http. Ceci est rendu possible par **jest**

*ASync.test.ts*
````typescript
describe("Async component", () => {
  test("renders posts if request succeeds", async () => {
  
	// Définir le mock
    window.fetch = jest.fn();
    window.fetch.mockResolvedValueOnce({
      json: async () => [
        {
          userId: 1,
          id: 1,
          title:
            "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
          body: "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto",
        },
      ],
    });

    render(<Async />);

    const list = await screen.findAllByRole("listitem");
    expect(list).not.toHaveLength(0);
  });
});
````
[Back to top](#test)     

</details>  

[Back to top](#test)     
