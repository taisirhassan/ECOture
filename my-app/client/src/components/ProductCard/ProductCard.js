import React from "react";

const ProductCard = (props) => {
  return (
    <div className="product-card">
      <img src={props.image} alt="Image not found" />
      <h2>{props.name}</h2>
      <div className="product-details">
        <p className="product-company">H&M</p>
        <p className="product-company">Product Materials:</p>
        {Array.from(props.materials.entries()).map(([key, value]) => (
        <li key={key}>
          {key}: {value}%
        </li>
      ))}
      <p className="score">{}</p>
      </div>
    </div>
  );
};

export default ProductCard;
