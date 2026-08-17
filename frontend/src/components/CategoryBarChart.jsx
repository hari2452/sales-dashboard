import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "../api";

function CategoryBarChart({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategorySales();
  }, [filters.fromDate, filters.toDate, filters.category]);

  const fetchCategorySales = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/sales/by-category", {
        params: {
          from: filters.fromDate || undefined,
          to: filters.toDate || undefined,
          category: filters.category || undefined,
        },
      });

      setData(response.data.data || []);
    } catch (error) {
      console.error("Category Bar Error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  return (
    <div className="dashboard-card chart-card">
      <div className="section-header">
        <div>
          <p className="section-label">Category Analysis</p>
          <h2>Revenue by Category</h2>
        </div>

        <span className="section-badge">
          {filters.fromDate || filters.toDate || filters.category
            ? "Filtered Data"
            : "Bar Chart"}
        </span>
      </div>

      {loading ? (
        <div className="chart-loading">
          Loading category data...
        </div>
      ) : data.length === 0 ? (
        <div className="chart-loading">
          No category data available for the selected filters.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={330}>
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: 10,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
            />

            <XAxis
              dataKey="category"
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={{
                stroke: "rgba(255,255,255,0.12)",
              }}
            />

            <YAxis
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) =>
                `₹${(value / 1000).toFixed(0)}K`
              }
            />

            <Tooltip
              formatter={(value) => [
                formatCurrency(value),
                "Revenue",
              ]}
              contentStyle={{
                background: "#111827",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                color: "#fff",
              }}
            />

            <Bar
              dataKey="revenue"
              fill="#60a5fa"
              radius={[10, 10, 0, 0]}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default CategoryBarChart;