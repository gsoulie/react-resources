## Composant

````typescript
import React, { useEffect, useState } from 'react'
import BadgeIcon from "@/assets/icons/badge.svg";
import ShopIcon from "@/assets/icons/market.svg";


const SegmentButton = () => {
  

  const [selected, setSelected] = useState("Fournisseurs");

  const handleClick = (option: any) => {
    setSelected(option);
  };

  return (
    <div className="segmented-button-container">
      <button
        className={`segmented-button ${selected === "Marques" ? "active" : ""}`}
        onClick={() => handleClick("Marques")}
      >
        Marques (94)
        {selected === "Marques" && (
          <BadgeIcon
            height={24}
            width={24}
            className="stroke-heavy"
            stroke="#ffffff"
          />
        )}
      </button>
      <button
        className={`segmented-button ${
          selected === "Fournisseurs" ? "active" : ""
        }`}
        onClick={() => handleClick("Fournisseurs")}
      >
        {selected === "Fournisseurs" && (
          <ShopIcon
            height={24}
            width={24}
            className="stroke-heavy"
            stroke="#ffffff"
          />
        )}
        Fournisseurs (550)
      </button>
    </div>
  );
}

export default SegmentButton
````

## CSS

````css
.segmented-button-container {
  display: flex;
  border: 1px solid $blue200;
  border-radius: 99px;
  overflow: hidden;
  height: 50px;
  font-size: $size-xs;
  padding: 4px;
}

.segmented-button {
  //flex: 1;
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: white;
  color: black;
  border: none;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s, color 0.3s;
  gap: $spacing-xs;
  border-radius: 99px;
  transition: .3s;
}

.segmented-button.active {
  background-color: $blue200;
  color: white;
}
````
