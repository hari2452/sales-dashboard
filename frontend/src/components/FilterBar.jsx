function FilterBar({
  fromDate,
  toDate,
  category,
  setFromDate,
  setToDate,
  setCategory,
  resetFilters,
}) {
  const handleFromDateChange = (e) => {
    const selectedDate = e.target.value;

    setFromDate(selectedDate);

    // Clear To Date if it becomes earlier than From Date
    if (toDate && selectedDate > toDate) {
      setToDate("");
    }
  };

  return (
    <div className="filter-bar">
      <div className="filter-heading">
        <p className="section-label">Dashboard Controls</p>
        <h3>Filter Analytics</h3>
      </div>

      <div className="filter-controls">

        {/* FROM DATE */}
        <div className="filter-group">
          <label>From Date</label>

          <input
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
          />
        </div>


        {/* TO DATE */}
        <div className="filter-group">
          <label>To Date</label>

          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>


        {/* CATEGORY */}
        <div className="filter-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothing">Clothing</option>
            <option value="Food">Food</option>
            <option value="Books">Books</option>
            <option value="Sports">Sports</option>
          </select>
        </div>


        {/* RESET */}
        <button
          type="button"
          className="reset-button"
          onClick={resetFilters}
        >
          Reset Filters
        </button>

      </div>
    </div>
  );
}

export default FilterBar;