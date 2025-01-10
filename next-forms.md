[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Formulaires


## Formulaire et server action

### useActionState

Il est conseillé d'utiliser une server action pour réaliser la validation des formulaires. En effet, il est plus robuste d'effectuer
la validation des champs côté server (i.e. il est possible via la console chrome dev de supprimer les attributs "required" d'un formulaire).

Au lieu d'utiliser des gestionnaires d'événements traditionnels comme onSubmit et de gérer l'état de chargement et les erreurs manuellement, useActionState te fournit une fonction d'action que tu peux directement passer à ton élément de formulaire. Ce hook gère ensuite automatiquement l'état de l'action (en cours, terminée, erreur) et met à jour l'état de ton composant en conséquence.

Ensuite, cela permet via l'utilisation du hook ````useActionState```` de gérer les erreurs, état pending etc...

> Remarque : le hook ````useFormState```` a été renommé **useActionState** depuis React 19



**Le hook useActionState prend trois arguments :**

* *action* : C'est la fonction qui sera exécutée lorsque le formulaire est soumis. Cette fonction est généralement une Server Action, c'est-à-dire une fonction asynchrone qui s'exécute sur le serveur. Elle reçoit deux arguments :
	* *previousState* : L'état précédent du composant.
	* *formData* : Les données du formulaire sous forme d'objet FormData.
* *initialState* : La valeur initiale de l'état du composant.
* *permalink* (optionnel et moins courant): Un identifiant unique pour l'action, utile dans des cas avancés de préchargement ou de mise en cache.


**Valeurs retournées par useActionState :**

````useActionState```` retourne un tableau contenant trois valeurs :

* *state* : L'état actuel du composant. Il est initialisé avec initialState et est mis à jour avec la valeur de retour de la fonction action.
* *action* : Une nouvelle fonction que tu dois passer à l'attribut action de ton élément <form>. C'est cette fonction qui déclenchera l'exécution de la Server Action.
* *isPending* : Un booléen qui indique si l'action est en cours d'exécution (par exemple, pendant l'envoi du formulaire au serveur).


Pour utiliser un formulaire avec les server actions, il faut remplacer le ````onSubmit```` par ````action````



*Exemple basique*

````typescript
'use client'; // Important : pour utiliser useActionState dans un composant client

import { useActionState } from 'react';

async function myServerAction(prevState, formData) {
  'use server'; // Indique que cette fonction s'exécute sur le serveur

  // Ici, tu peux effectuer des opérations côté serveur, comme enregistrer des données dans une base de données
  const name = formData.get('name');
  if (!name){
      return {error: "Le nom est obligatoire"}
  }
  return { message: `Bonjour ${name} !` };
}

function MyForm() {
  const [state, formAction, isPending] = useActionState(myServerAction, { message: null, error:null });

  return (
    <form action={formAction}>
      <label htmlFor="name">Nom :</label>
      <input type="text" id="name" name="name" />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Envoi en cours...' : 'Envoyer'}
      </button>
      {state.message && <p style={{color:'green'}}>{state.message}</p>}
      {state.error && <p style={{color:'red'}}>{state.error}</p>}
    </form>
  );
}
````


## Formulaire avec Yup et React form

<details>
  <summary>Exemple global</summary>

````typescript
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const POSTAL_CODE_REGEX = /^(?:[0-8]\d|9[0-8])\d{3}$/g;

// definition du schéma
const schema = yup.object().shape({
  addressLine1: yup.string().trim().required("Le champ adresse ligne 1 est requis").default(""),
  addressLine2: yup.string().default(""),
  addressLine3: yup.string().default(""),
  postalCode: yup.string().matches(POSTAL_CODE_REGEX, "Le code postal n'est pas au bon format"),
  city: yup.string(),
});

export const AddressForm = (props: { address: AddressDTO }) => {
  const { address } = props;
  
  // states de contrôle des états du formulaire
  const { address } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [isEditable, setIsEditable] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Binding React form avec le schéma Yup et les données initiale
 const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: async () =>
      schema.cast({
        addressLine1: address?.numero,
        addressLine2: address?.nomRue,
        addressLine3: address?.complement,
        postalCode: address?.codePostal,
        city: address?.ville,
      }),
    mode: "onSubmit",
  });

// pré-remplissage formulaire si mode édition par exemple
  useEffect(() => {
    if (address) {
      setValue("addressLine1", address.numero ?? '');
      setValue("addressLine2", address.nomRue ?? '');
      setValue("addressLine3", address.complement ?? '');
      setValue("postalCode", address.codePostal.toString() ?? '');
      setValue("city", address.ville ?? '');
    }
    setIsLoading(false);
  }, [setValue, address]);
  
  const onSubmit = (data: any) => {
    console.log(data);
    setIsSaving(true);
  };

  const onCancel = () => {
    setIsEditable(false);
    props.handleCancel();
  }
  
  return (
    <>
      <form className="d-grid gap-3" onSubmit={handleSubmit(onSubmit)}>
        <div className="d-grid gap-3">
          <Input
            type="text"
            name="addressLine1"
            label={Texts.user.address.inputs.address1}
            errors={errors}
            register={register}
          />
          <Input
            type="text"
            name="addressLine2"
            label={Texts.user.address.inputs.address2}
            errors={errors}
            register={register}
          />
          <Input
            type="text"
            name="addressLine3"
            label={Texts.user.address.inputs.address3}
            errors={errors}
            register={register}
          />
          <Row>
            <Col>
              <Input
                type="text"
                name="postalCode"
                label={Texts.user.address.inputs.postalCode}
                errors={errors}
                register={register}
              />
            </Col>
            <Col>
              <Input
                type="text"
                name="city"
                label={Texts.user.address.inputs.city}
                errors={errors}
                register={register}
              />
            </Col>
          </Row>
          <Button
            variant="primary"
            type="submit"
          >
           Enregistrer
          </Button>
          <Button variant="light" type="button" onClick={onCancel}>
            Annuler
          </Button>
        </div>
      </form>
    </>
  );
}
````

> IMPORTANT : le nom des champs bindés et le nom des champs Input **doit** être le même que les noms des champs du schema yup
  
</details>


## Paramétrage du schema yup

<details>
  <summary>Configuration des champs du schéma</summary>

````typescript
const POSTAL_CODE_REGEX = /^(?:[0-8]\d|9[0-8])\d{3}$/g;

// definition du schéma
const schema = yup.object().shape({
  addressLine1: yup.string().trim().required("Le champ adresse ligne 1 est requis").default(""),
  addressLine2: yup.string().default(""),
  addressLine3: yup.string().default(""),
  postalCode: yup.string().matches(POSTAL_CODE_REGEX, "Le code postal n'est pas au bon format"),
  phone: yup.string().matches(PHONE_CODE_REGEX, { message: "Le code postal n'est pas au bon format", excludeEmptyString: true }),  // <-- ne pas activer le contrôle sir le champ est vide (sinon rend le champ obligatoire)
  city: yup.string(),
});

````
 
</details>

