[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# LocalStorage

Utilisation classique de ````window.localStorage````

````tsx
import { useState, useEffect } from 'react'

function App() {
  const [titleVisible, showTitle] = useState(true);

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
      <button onClick={() => {
        showTitle(!titleVisible);
        window.localStorage.setItem('REACT-TITLE', JSON.stringify(titleVisible))
      }}>Hide title</button>
}
````
