import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import api from "../api";

function RevenueLineChart({ filters }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMonthlySales();
  }, [filters.fromDate, filters.toDate, filters.category]);

  const fetchMonthlySales = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/sales/monthly", {
        params: {
          from: filters.fromDate || undefined,
          to: filters.toDate || undefined,
          category: filters.category || undefined,
        },
      });

      setData(response.data.data || []);
    } catch (error) {
      console.error("Monthly Sales Error:", error);
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
          <p className="section-label">Revenue Trend</p>
          <h2>Revenue Over Time</h2>
        </div>

        <span className="section-badge">
          {filters.fromDate || filters.toDate || filters.category
            ? "Filtered Data"
            : "Last 12 Months"}
        </span>
      </div>

      {loading ? (
        <div className="chart-loading">
          Loading monthly revenue...
        </div>
      ) : data.length === 0 ? (
        <div className="chart-loading">
          No sales data available for the selected filters.
        </div>
      ) : (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart
              data={data}
              margin={{
                top: 20,
                right: 25,
                left: 10,
                bottom: 10,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.08)"
              />

              <XAxis
                dataKey="month"
                tick={{
                  fill: "#94a3b8",
                  fontSize: 12,
                }}
                axisLine={{
                  stroke: "rgba(255,255,255,0.12)",
                }}
                tickLine={false}
              />

              <YAxis
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

              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#60a5fa"
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: "#8b5cf6",
                  strokeWidth: 0,
                }}
                activeDot={{
                  r: 7,
                }}
                animationDuration={1200}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default RevenueLineChart;