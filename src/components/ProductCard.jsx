import "./../styles/ProductCard.css";

function ProductCard({ product }) {
    return (
        <div className="product-card">
            <h2>{product.name}</h2>

            <span className="category">
                {product.category}
            </span>

            <h3>₹ {Number(product.price).toFixed(2)}</h3>

            <p>
                Created:
                {" "}
                {new Date(product.created_at).toLocaleDateString()}
            </p>

            <p>
                Updated:
                {" "}
                {new Date(product.updated_at).toLocaleString()}
            </p>
        </div>
    );
}

export default ProductCard;