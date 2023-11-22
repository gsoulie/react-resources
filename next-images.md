[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Images

* [Utilisation du composant Image](#utilisation-du-composant-image)
* [Image background](#image-background)     

## Utilisation du composant Image

<details>
  <summary>
    Composant next/Image
  </summary>

L'utilisation du composant ````<Image>```` de Next impose de renseigner une ````height```` et une ````width````. Cependant, lors de l'utilisation d'images dynamiques (provenant d'une url), nous n'avons pas forcément accès à ces informations.
Si l'on souhaite donc faire en sorte que l'image s'adapte à son conteneur, il faut renseigner les propriétés ````fill```` et ````sizes=100%```` du composant image, et créer une classe css spécifique.

Afin d'éviter un warning de type 

````
Image with src "<image-source-url>" has "fill" and parent element with invalid "position". Provided "static" should be one of absolute,fixed,relative.
````

Il faut aussi configurer la div parent comme ayant une position relative.

````
<div style={{ position: "relative" }}>
  <Image
      src={props.url}
      alt={""}
      fill
      sizes="100%"
      className="product-tile__image"
      onError={() => setImageError(true)}
    />
</div>
````

*css*

````css
.product-tile__image {
  object-fit: contain;
  position: relative !important;
}
````

</details>

## Image background

<details>
  <summary>Parfois il peut être compliqué d'afficher une image svg de fond dans une div, depuis un layout.tsx</summary>

````typescript
const styles = {
	headerImage: {"backgroundImage": "url(/" + process.env.URL_PATH_PREFIX + "/images/myBackground.svg)"}
}

return (
	<html>
		<body>
			<div style={styles.headerImage}>
)
````
</details>

## Image 404

<details>
  <summary>Gérer une image placeholder si l'url est null ou retourne une erreur 404</summary>


````typescript
import BrokenImage from "@/assets/icons/noimage.svg";

const ProductPhoto = (props: { image: string, alt: string }) => {
  
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="product-tile__wrapper__product-image"
      style={{ position: "relative" }}
    >
      {(props.image && !imageError) && (
        <Image
          src={props.image ?? ""}
          alt={""}
          fill
          sizes="100%"
          className="product-tile__image"
          onError={() => setImageError(true)}
        />
      )}
      {(!props.image || imageError) && (
        <div className="brokenImage-wrapper">
          <BrokenImage stroke="#c2c3c7" height="64px" width="64px" />
          <span className="small-text">{Texts.global.noImage}</span>
        </div>
      )}
    </div>
  );
}
````

</details>
