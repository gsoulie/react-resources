# Bouton type panier avec popover au survol

## Description

Cet exemple basé sur React peut être transposé dans n'importe quel autre framework JS. La librairie tailwind css est utilisée pour la gestion des styles.

L'exemple présente une toolbar contenant une searchbar et un bouton panier. Lors du survol de ce dernier, une popover s'affiche. cette dernière ne se ferme que lorsqu'on en sort ou bien lorsque l'on sort du bouton panier.

La subtilité qui permet d'éviter de fermer la popover lors du mouseLeave sur le bouton panier est de créer une div ````::before```` sur la modale, qui vient combler le gap entre la modale et le bouton. En ajoutant un évenement mouseEnter sur la modale, 
le déplacement de la souris dans l'espace entre le bouton et la modale garde cette dernière ouverte.

````css
.cart-modal-wrapper {
  // ...

  ::before {  // <--- 
    content: "";
    top: -20px;
    left: 0;
    right: 0;
    position: absolute;
    background: transparent;
    height: 21px;
  }
}
````

````html
<>
      {show && (
        <div
          className="cart-modal-wrapper"
          onMouseEnter={handleMouseEnter}
          style={{ right: 0 }}
        >
          <Popover handleModaleMouseLeave={handleMouseLeave} />
        </div>
      )}
      <div
        id="shop-wrapper"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <button
          type="submit"
          className="bg-cyan-500 hover:bg-cyan-600 p-2 rounded"
        >
          Cart
        </button>
      </div>
    </>
````
