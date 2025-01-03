[< Back to main Menu](https://github.com/gsoulie/react-resources/blob/master/react-presentation.md)    

# Images

* [Chargement d'images internes](#chargement-d--images-internes)
* [Optimisation des images](#optimisation-des-images)
* [Image loader](#image-loader)         
* [Utilisation du composant Image](#utilisation-du-composant-image)
* [Image background](#image-background)
* [Image 404](#image-404)    
* [Problème de cache image](#problème-de-cache-image)

## Chargement d'images internes

La manière la plus simple d'utiliser une image interne (provenant de public ou assets) est la suivante :

````typescript
import myLogo from '@/assets/logo.png';

<Image src={myLogo} />
````

## Optimisation des images

Utilisez la propriété ````sizes```` plutôt que ````width```` et ````height```` lorsque l'image doit être responsive.

La valeur de ````sizes```` aura un impact significatif sur les performances des images utilisant l'attribut fill ou qui sont stylisées pour avoir une taille réactive.

La propriété sizes remplit deux fonctions importantes liées aux performances des images :

Détermination de la taille de l'image à télécharger
La valeur de sizes est utilisée par le navigateur pour déterminer quelle taille d'image télécharger, à partir du srcset généré automatiquement par next/image. Lorsque le navigateur fait ce choix, il ne connaît pas encore la taille de l'image sur la page ; il sélectionne donc une image dont la taille est égale ou supérieure à celle du viewport. La propriété sizes vous permet d'indiquer au navigateur que l'image sera en réalité plus petite que la largeur de l'écran. Si vous ne spécifiez pas une valeur pour sizes dans une image avec l'attribut fill, une valeur par défaut de 100vw (largeur complète de l'écran) est utilisée.

Modification du comportement de srcset généré automatiquement
Si aucune valeur sizes n'est spécifiée, un petit srcset est généré, adapté à une image de taille fixe (1x/2x/etc.). Si sizes est défini, un srcset plus grand est généré, adapté à une image réactive (640w/750w/etc.). Si la propriété sizes inclut des tailles telles que 50vw, qui représentent un pourcentage de la largeur du viewport, alors le srcset est réduit pour ne pas inclure de valeurs trop petites pour être nécessaires.

Par exemple, si vous savez que votre style fera en sorte qu'une image soit pleine largeur sur les appareils mobiles, en disposition à 2 colonnes sur les tablettes, et en disposition à 3 colonnes sur les écrans d'ordinateur, vous devriez inclure une propriété sizes comme suit :

````typescript
import Image from 'next/image'

export default function Page() {
  return (
    <div className="grid-element">
      <Image
        fill
        src="/example.png"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  )
}

````

## Image loader

````typescript
Afin d'éviter les erreurs 404 lors du chargement d'images dont l'url est fournie par une api, il est conseillé d'utiliser un **loader resolver**

````typescript
export const ProductPhoto = (props: {
  image: string;
  alt: string;
  height?: number | undefined;
  width?: number | undefined
}) => {
  const [imageError, setImageError] = useState(false);
  
  const imageLoader = () => {
    return `${encodeURI(props.image)}?w=${props.width}&q=${75}`;
  };
  
  return (
    <>
      {props.image && !imageError && (
        <Image
          loader={imageLoader}
          src={encodeURI(props.image) ?? ""}
          alt={""}
          fill={!props.height && !props.width ? true : undefined}
          sizes={!props.height && !props.width ? "100%" : undefined}
          height={props.height ?? undefined}
          width={props.width ?? undefined}
          className="product-tile__image"
          onError={() => setImageError(true)}
        />
      )}
      {(!props.image || imageError) && (
        <NotFoundImage small={props?.smallVersion} />
      )}
    </>
  );
};
````
````



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

````html
<div style={{ position: "relative" }}>
  <Image
      src={encodeURI(props.url)}
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

## Problème de cache image

<details>
	<summary>Problème de cache image, parfois les images affichées ne sont pas les bonnes. ceci à cause du cache</summary>

````typescript
<Link
    href={image}
    rel="preload"	// <--- ajout
    className="profession-tile-link"
    style={{ position: "relative" }}
  >
    <Image
      src={image}
      alt={`Logo`}
      fill
      sizes="100%"
      priority
      className="profession-tile__image"
    />
  </Link>
````
</details>
