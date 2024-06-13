"use client";

import React, { useState } from "react";
import "./PopoverButton.scss";
import { Popover } from "./Popover";

export const PopoverButton = () => {
  const [show, setShow] = useState(false);

  //let menuPositionX = 0;
  // if (typeof window !== "undefined") {
  //   const cartButtonElt = document.getElementById("cartMenuBtn");
  //   if (cartButtonElt) {
  //     menuPositionX =
  //       cartButtonElt?.getBoundingClientRect().x -
  //       500 +
  //       cartButtonElt?.getBoundingClientRect().width;
  //   }
  // }

  const handleMouseEnter = () => {
    setShow(true);
  };

  const handleMouseLeave = () => {
    setShow(false);
  };

  return (
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
  );
};
