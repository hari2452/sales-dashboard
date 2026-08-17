import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import api from "../api";

const COLORS = [
  "#60a5fa",
  "#8b5cf6",
  "#22c55e",
  "#f59e0b",
  "#ec4899",
];

function CategoryPieChart({ filters }) {
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
      console.error("Category Pie Error:", error);
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
          <p className="section-label">Revenue Share</p>
          <h2>Category Distribution</h2>
        </div>

        <span className="section-badge">
          {filters.fromDate || filters.toDate || filters.category
            ? "Filtered Data"
            : "Pie Chart"}
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
          <PieChart>
            <Pie
              data={data}
              dataKey="revenue"
              nameKey="category"
              cx="50%"
              cy="45%"
              outerRadius={105}
              innerRadius={55}
              paddingAngle={3}
              animationDuration={1200}
            >
              {data.map((entry, index) => (
                <Cell
                  key={entry.category}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

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

            <Legend
              wrapperStyle={{
                color: "#cbd5e1",
                fontSize: "13px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default CategoryPieChart;