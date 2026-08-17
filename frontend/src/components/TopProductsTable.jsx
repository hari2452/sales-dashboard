import { useEffect, useState } from "react";
import api from "../api";

function TopProductsTable({ filters }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopProducts();
  }, [filters.fromDate, filters.toDate, filters.category]);

  const fetchTopProducts = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/sales/top-products", {
        params: {
          from: filters.fromDate || undefined,
          to: filters.toDate || undefined,
          category: filters.category || undefined,
        },
      });

      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Top Products Error:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <div className="dashboard-card">
        <div className="chart-loading">
          Loading top products...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card">
      <div className="section-header">
        <div>
          <p className="section-label">Leaderboard</p>
          <h2>Top 5 Products</h2>
        </div>

        <span className="section-badge">
          {filters.fromDate || filters.toDate || filters.category
            ? "Filtered Data"
            : "By Revenue"}
        </span>
      </div>

      {products.length === 0 ? (
        <div className="chart-loading">
          No product data available for the selected filters.
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="products-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Product</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Total Revenue</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product, index) => (
                <tr key={`${product.product}-${index}`}>
                  <td>
                    <span
                      className={`rank-badge rank-${index + 1}`}
                    >
                      #{index + 1}
                    </span>
                  </td>

                  <td>
                    <div className="product-name">
                      {product.product}
                    </div>
                  </td>

                  <td>
                    <span className="category-pill">
                      {product.category}
                    </span>
                  </td>

                  <td>
                    {product.units_sold}
                  </td>

                  <td className="revenue-value">
                    {formatCurrency(product.revenue)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default TopProductsTable;