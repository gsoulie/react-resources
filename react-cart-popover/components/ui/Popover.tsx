import React from "react";
import "./Popover.scss";

export const Popover = (props: { handleModaleMouseLeave: () => void }) => {
  return (
    <div className="cart-popover" onMouseLeave={props.handleModaleMouseLeave}>
      <span className="cart-popover__small-header mb-3">My cart</span>

      <div className="cart-popover__main-wrapper">content</div>
    </div>
  );
};
