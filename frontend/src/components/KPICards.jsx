import { useEffect, useState } from "react";
import api from "../api";

function KPICards({ filters }) {
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
  }, [filters.fromDate, filters.toDate, filters.category]);

  const fetchKPIs = async () => {
    try {
      setLoading(true);

      const response = await api.get("/api/kpis", {
        params: {
          from: filters.fromDate || undefined,
          to: filters.toDate || undefined,
          category: filters.category || undefined,
        },
      });

      setKpis(response.data.data);
    } catch (error) {
      console.error("KPI Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="kpi-grid">
        <div className="kpi-card">
          <p>Loading KPI data...</p>
        </div>
      </div>
    );
  }

  if (!kpis) {
    return (
      <div className="kpi-grid">
        <div className="kpi-card">
          <p>No KPI data available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <p>Total Revenue</p>

        <h2>
          ₹{Number(kpis.total_revenue).toLocaleString("en-IN")}
        </h2>
      </div>

      <div className="kpi-card">
        <p>Total Orders</p>

        <h2>{kpis.total_orders}</h2>
      </div>

      <div className="kpi-card">
        <p>Average Order Value</p>

        <h2>
          ₹{Number(kpis.average_order_value).toLocaleString("en-IN")}
        </h2>
      </div>

      <div className="kpi-card">
        <p>Best Selling Product</p>

        <h2>{kpis.best_selling_product?.name || "No Data"}</h2>

        <span>
          {kpis.best_selling_product?.units_sold || 0} units sold
        </span>
      </div>
    </div>
  );
}

export default KPICards;