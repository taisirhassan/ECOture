import React from "react";

const ProductCard = (props) => {
  return (
    <div className="product-card">
      <img src={props.imageurl} alt="Image not found" />
      <h2>{props.name}</h2>
      <div className="product-details">
        <p className="product-company">Nike</p>
        <p className="product-materials">100% cotton</p>
      </div>
    </div>
  );
};

export default ProductCard;
