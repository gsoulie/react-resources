[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Checkbox

* [Mettre à jour dynamiquement l'état d'une checkbox](#mettre-à-jour-dynamiquement-l--état-d--une-checkbox)     
* [Combo multi custom](#combo-multi-custom)    

## Mettre à jour dynamiquement l'état d'une checkbox

<details>
  <summary>Utilisation de la propriété checked</summary>

Très important, afin de pouvoir mettre à jour dynamiquement l'état d'une case à cocher depuis un composant parent, 
il faut utiliser la propriété ````checked```` et **non** pas ````defaultChecked````

````typescript
export type ComboMultiItemType = {
  id: string,
  checked?: boolean,
  label: string,
  handleCheck: (checked: boolean) => void
}

export const ComboMultiItem = (props: ComboMultiItemType) => {

  const handleClick = (ev: any) => {
    const checked = ev.target.checked;
    props?.handleCheck(checked);
  };

  return (
    <div className="checkbox-item">
      <Form>
        <Form.Check
          id={props.id}
          type="checkbox"
          checked={props.checked}
          onChange={handleClick}
          label={props.label}
        />
      </Form>
    </div>
  );
}
````
</details>

## Combo multi custom

https://github.com/gsoulie/react-resources/tree/main/react-checkbox-multi
