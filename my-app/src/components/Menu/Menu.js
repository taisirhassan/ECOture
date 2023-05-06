import React from 'react';
import ProductCard from './ProductCard';

const Menu = ({ products }) => {
  return (
    <div className="menu">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export default Menu;
