import { useEffect, useState } from "react";
import { getProducts } from "./Services/api";
import ProductCard from "./components/ProductCard";

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const [category, setCategory] = useState("");

    const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        setProducts([]);
        setNextCursor(null);
        setHasMore(true);

        loadProducts();
    }, [category]);

    async function loadProducts(cursor = null) {
        try {
            if (cursor) {
                setLoadingMore(true);
            } else {
                setLoading(true);
            }

            const data = await getProducts({
                cursor,
                category: category || null,
            });

            if (cursor) {
                setProducts((prev) => [...prev, ...data.products]);
            } else {
                setProducts(data.products);
            }

            setNextCursor(data.nextCursor);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    async function loadMoreProducts() {
        console.log("Button Clicked");

        if (!hasMore || loadingMore) return;

        await loadProducts(nextCursor);
    }


    if (loading) {
        return (
            <div className="container">
                <h2 style={{ textAlign: "center" }}>
                    Loading Products...
                </h2>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="header">
                <h1>CodeVector Product Browser</h1>

                <div className="filter-section">
                    <label htmlFor="category">
                        Category:
                    </label>

                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Books">Books</option>
                        <option value="Clothing">Clothing</option>
                        <option value="Sports">Sports</option>
                        <option value="Stationery">Stationery</option>
                        <option value="Medical">Medical</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Automobile">Automobile</option>
                    </select>
                </div>

                <p>
                    Showing <strong>{products.length}</strong> Products
                </p>
            </div>

            <div className="products-grid">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

            <div className="load-more-container">
                {hasMore ? (
                    <button
                        className="load-more-btn"
                        onClick={loadMoreProducts}
                        disabled={loadingMore}
                    >
                        {loadingMore ? "Loading..." : "Load More"}
                    </button>
                ) : (
                    <p className="end-message">
                        You've reached the end of the products.
                    </p>
                )}
            </div>
        </div>
    );
}

export default App;