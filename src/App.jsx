import { useEffect, useState } from "react";
import { getProducts } from "./Services/api";
import ProductCard from "./components/ProductCard";

function App() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [category, setCategory] = useState("");

    // const [nextCursor, setNextCursor] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // Cursor used to fetch each page
    // Page 1 -> null
    // Page 2 -> cursor1
    // Page 3 -> cursor2
    const [cursorHistory, setCursorHistory] = useState([null]);

    useEffect(() => {
        setProducts([]);
        setHasMore(true);

        setCurrentPage(1);
        setCursorHistory([null]);

        loadProducts(null, 1);
    }, [category]);

    async function loadProducts(cursor = null, page = currentPage) {
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

            setProducts(data.products);

            setCursorHistory((prev) => {
                const updated = [...prev];

                // Save cursor for the NEXT page only once
                if (
                    data.nextCursor &&
                    updated.length === page
                ) {
                    updated.push(data.nextCursor);
                }

                return updated;
            });
            setHasMore(data.hasMore);
        } catch (error) {
            console.error("Failed to fetch products:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }

    async function handleNext() {
        if (!hasMore || loadingMore) return;

        const nextPage = currentPage + 1;

        await loadProducts(
            cursorHistory[currentPage],
            nextPage
        );

        setCurrentPage(nextPage);
    }

    async function handlePrevious() {
        if (currentPage === 1 || loadingMore) return;

        const previousCursor =
            cursorHistory[currentPage - 2];

            const previousPage = currentPage - 1;

            await loadProducts(
                previousCursor,
                previousPage
            );
            
            setCurrentPage(previousPage);
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

                <div className="page-info">
                    <p>
                        Page <strong>{currentPage}</strong>
                    </p>

                    <p>
                        Showing <strong>{products.length}</strong> Products
                    </p>
                </div>
            </div>

            <div className="products-grid">
                {products.map((product) => (
                    <ProductCard
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

            <div className="pagination-container">

                <button
                    className="pagination-btn"
                    onClick={handlePrevious}
                    disabled={currentPage === 1 || loadingMore}
                >
                    ← Previous
                </button>

                <span className="page-number">
                    Page {currentPage}
                </span>

                <button
                    className="pagination-btn"
                    onClick={handleNext}
                    disabled={!hasMore || loadingMore}
                >
                    {loadingMore ? "Loading..." : "Next →"}
                </button>

            </div>
        </div>
    );
}

export default App;