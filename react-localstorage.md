[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# LocalStorage

Utilisation classique de ````window.localStorage````

````tsx
import { useState, useEffect } from 'react'

function App() {
  const [titleVisible, showTitle] = useState(true);

   // Joué uniquement à l'initialisation
   useEffect(() => {
    const titleIsVisible = window.localStorage.getItem('REACT-TITLE');
    
    if (titleIsVisible !== null) {
      showTitle(JSON.parse(titleIsVisible));
    }
  }, []) 

  // ATTENTION joué à chaque modification de la vue (click sur bouton hide / show)
  useEffect(() => {
    window.localStorage.setItem('REACT-TITLE', JSON.stringify(titleVisible));
  }, [titleVisible]) 


  return (
    <div className='main-container'>
      {titleVisible && (
        <div>
          <h2>Title visible</h2>
        </div>
      )}
      <button onClick={() => { showTitle(false); }}>Hide title</button>
      
      <button onClick={() => { showTitle(true); }}>Show title</button>
}
````
