import React from 'react'

const ProductsCard = () => {
    return (
        <div className="product-card">
            <img src={product.imageurl} alt="Image not found"/>
            <h2>{product.name}</h2>
            <div className = "product-details">
                <p className="product-company">Nike</p>
                <p className="product-materials">100% cotton</p>
            </div>
        </div>
    )
}

export default ProductsCard;