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

function RegionBarChart({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRegionSales();
  }, [filters.fromDate, filters.toDate, filters.category]);

  const fetchRegionSales = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/sales/by-region", {
        params: {
          from: filters.fromDate || undefined,
          to: filters.toDate || undefined,
          category: filters.category || undefined,
        },
      });

      setData(response.data.data || []);
    } catch (error) {
      console.error("Region Sales Error:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value) => {
    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  return (
    <div className="dashboard-card">
      <div className="section-header">
        <div>
          <p className="section-label">Regional Performance</p>
          <h2>Revenue by Region</h2>
        </div>

        <span className="section-badge">
          {filters.fromDate || filters.toDate || filters.category
            ? "Filtered Data"
            : "Horizontal Bar"}
        </span>
      </div>

      {loading ? (
        <div className="chart-loading">
          Loading regional data...
        </div>
      ) : data.length === 0 ? (
        <div className="chart-loading">
          No regional data available for the selected filters.
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={330}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 10,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.08)"
            />

            <XAxis
              type="number"
              tick={{
                fill: "#94a3b8",
                fontSize: 12,
              }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) =>
                `₹${(value / 1000).toFixed(0)}K`
              }
            />

            <YAxis
              type="category"
              dataKey="region"
              tick={{
                fill: "#cbd5e1",
                fontSize: 13,
              }}
              axisLine={false}
              tickLine={false}
              width={70}
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
              fill="#8b5cf6"
              radius={[0, 10, 10, 0]}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default RegionBarChart;