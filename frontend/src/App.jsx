import { useState } from "react";

import Navbar from "./components/Navbar";
import FilterBar from "./components/FilterBar";
import KPICards from "./components/KPICards";
import RevenueLineChart from "./components/RevenueLineChart";
import CategoryBarChart from "./components/CategoryBarChart";
import CategoryPieChart from "./components/CategoryPieChart";
import RegionBarChart from "./components/RegionBarChart";
import TopProductsTable from "./components/TopProductsTable";

function App() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [category, setCategory] = useState("");

  const resetFilters = () => {
    setFromDate("");
    setToDate("");
    setCategory("");
  };

  const filters = {
    fromDate,
    toDate,
    category,
  };

  return (
    <div>
      <Navbar />

      <main>
        <FilterBar
          fromDate={fromDate}
          toDate={toDate}
          category={category}
          setFromDate={setFromDate}
          setToDate={setToDate}
          setCategory={setCategory}
          resetFilters={resetFilters}
        />

        <KPICards filters={filters} />

        <RevenueLineChart filters={filters} />

        <div className="two-column-grid">
          <CategoryBarChart filters={filters} />
          <CategoryPieChart filters={filters} />
        </div>

        <RegionBarChart filters={filters} />

        <TopProductsTable filters={filters} />
      </main>
    </div>
  );
}

export default App;