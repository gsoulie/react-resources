[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Firebase

* [Firestore Database](#firestore-database)     


## Firestore Database

### Installation et configuration

#### Création du projet Firebase

Depuis la console Firebase, créer un nouveau projet, puis aller dans la rubrique *Firestore Database* et créer une nouvelle base de données.

Pour les tests, on modifiera les *Règles* de la manière suivante :

````
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
    	allow read, write
    }
  }
}
````

#### Initialisation dans le projet React

````
npm i firebase
````

Récupérer la configuration depuis firebase 

````
const firebaseConfig = {
  apiKey: "AIzaxxxxxxxxxxxxxxxxxxxxxx",
  authDomain: "xxxxxxxxx.firebaseapp.com",
  projectId: "xxxx-99999",
  storageBucket: "xxxx-99999.appspot.com",
  messagingSenderId: "99999999999",
  appId: "9:99999999:web:999999999999999"
};
````

<img src="https://img.shields.io/badge/Important-DD0031.svg?logo=LOGO"> : Lors de la mise en production, évite de stocker les clés d'api dans l'application, même si elles se trouvent dans le fichier *.env*. Il est préférable d'héberger la configuration sur le serveur (ou en utilisant Next en stockant les valeurs dans les staticsProps) car le fichier*.env* n'est pas sécurisé et accessible une fois l'application déployée

**Pour l'exemple**, nous allons stocker les clés dans un fichier *.env*

*.env*

````
VITE_API_KEY = "AIzaSxxxxxxxxxxxxxxxxxxxxxxxxxxx"
VITE_API_AUTH_DOMAIN = "sxxxxxxxxxxx-9999.firebaseapp.com"
VITE_API_PROJECT_ID = "xxxxxxxx-9999"
VITE_API_STORAGE_BUCKET = "xxxxxxxx-99999.appspot.com"
VITE_API_MESSAGING_SENDER_ID = "999999999999"
VITE_API_APP_ID = "9999999999:web:9999999999999"
VITE_TABLE = "test_data"
````

#### Service de configuration

Créer un répertoire *src/firebase* dans lequel on créé un fichier *firebase.ts*

````typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_API_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_API_PROJECT_ID,
  storageBucket: import.meta.env.VITE_API_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_API_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_API_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
````

#### Test de la base

Pour tester la connexion et le fonctionnement, nous allons créer un fichier *handlesubmit.ts*

````typescript
import { addDoc, getDocs, collection } from "@firebase/firestore";
import { firestore } from "./firebase";

export const handleSubmit = (table: string, testdata: any) => {
  const ref = collection(firestore, table); // Firebase creates this automatically
  console.log('firestore ref', ref);

  let data = {
    testData: testdata,
  };
  console.log('data', data);


  try {
    addDoc(ref, data);
  } catch (err) {
    console.log(err);
  }
};

export const fetchFirestoreData = async (table: string) => {
  const ref = await getDocs(collection(firestore, table));
  const result: any[] = [];

  try {
    ref.forEach(d => {
      result.push({
        id: d.id,
        ...d.data()
      })
    });
  } catch (err) {
    console.log(err);
  }

  return result;
}
````

On créer ensuite un formulaire simple permettant de tester l'ajout de données dans la base de données Firestore :

*app.tsx*

````typescript
import { useEffect, useState } from "react";
import "./App.css";
import { handleSubmit, fetchFirestoreData } from "./firebase/handlesubmit";

function App() {
  const [data, setData] = useState<any[]>([]);

  const submitHandler = (e: any) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = formData.get("dataref");
    handleSubmit(import.meta.env.VITE_TABLE, data);
    form.reset();
    fetchData();
  };

  const fetchData = async () => {
    const res = await fetchFirestoreData(import.meta.env.VITE_TABLE);
    setData([...res]);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="App">
      <form onSubmit={submitHandler}>
        <input type="text" name="dataref" id="dataref" />
        <button type="submit">Save</button>
      </form>
      {data.map((item) => (
        <div key={item.id}>{item.testData}</div>
      ))}
    </div>
  );
}

export default App;

````

[Back to top](#firebase)      
