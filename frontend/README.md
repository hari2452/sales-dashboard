
# 📊 Sales Analytics Dashboard

## Task 11 – Full Stack Project

A full-stack **Sales Analytics Dashboard** built using **React, Flask, MySQL, Axios, and Recharts**.

The dashboard converts raw sales data stored in MySQL into meaningful visual insights such as KPI cards, line charts, bar charts, pie charts, regional analysis, and top-selling products.

---

## 🚀 Technologies Used

### Frontend
- React
- JavaScript
- CSS
- Axios
- Recharts
- Vite

### Backend
- Python
- Flask
- Flask-CORS
- MySQL Connector

### Database
- MySQL

### Testing
- Postman

---

## 🎯 Project Features

The dashboard includes:

- Total Revenue KPI
- Total Orders KPI
- Average Order Value KPI
- Best Selling Product KPI
- Monthly Revenue Line Chart
- Revenue by Category Bar Chart
- Category Distribution Pie Chart
- Revenue by Region Horizontal Bar Chart
- Top 5 Products Table
- From Date Filter
- To Date Filter
- Category Filter
- Reset Filters
- Responsive Dashboard Design
- Animated Recharts Charts

---

## 📁 Project Structure

```text
sales-dashboard/
│
├── backend/
│   ├── app.py
│   └── seed.py
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── FilterBar.jsx
    │   │   ├── KPICards.jsx
    │   │   ├── RevenueLineChart.jsx
    │   │   ├── CategoryBarChart.jsx
    │   │   ├── CategoryPieChart.jsx
    │   │   ├── RegionBarChart.jsx
    │   │   └── TopProductsTable.jsx
    │   │
    │   ├── api.js
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    └── package.json
```

---

## 🗄️ Database Structure

The project uses three main MySQL tables.

### Categories

Stores product categories such as:

- Electronics
- Clothing
- Food
- Books
- Sports

### Products

Stores:

- Product name
- Category
- Price

### Sales

Stores:

- Product
- Quantity
- Total amount
- Sold date
- Region

The available regions are:

- North
- South
- East
- West

---

## 🌱 Database Seeding

The `seed.py` file is used to insert sample data programmatically into MySQL.

The database contains:

- 5 categories
- 15+ products
- 100+ sales records
- Sales across multiple months
- North, South, East and West regions

This avoids manually inserting every sales record.

---

## 🔄 Application Data Flow

```text
MySQL Database
       ↓
Flask Backend
       ↓
REST API
       ↓
Axios
       ↓
React Components
       ↓
Recharts
       ↓
Sales Dashboard
```

MySQL stores the sales information.

Flask reads and processes the data from MySQL and exposes REST APIs.

React calls the Flask APIs using Axios.

The API response is stored in React state and passed to Recharts to display the information visually.

---

## 🔗 API Endpoints

### KPI Data

```http
GET /api/kpis
```

Returns:

- Total Revenue
- Total Orders
- Average Order Value
- Best Selling Product

---

### Monthly Revenue

```http
GET /api/sales/monthly
```

Returns monthly revenue data used by the Line Chart.

---

### Revenue by Category

```http
GET /api/sales/by-category
```

Used by:

- Category Bar Chart
- Category Pie Chart

---

### Revenue by Region

```http
GET /api/sales/by-region
```

Used by the Horizontal Bar Chart.

---

### Top Products

```http
GET /api/sales/top-products
```

Returns the Top 5 products based on total revenue.

---

### Filtered Sales

```http
GET /api/sales/filter
```

Supports query parameters:

```text
?from=
?to=
?category=
```

Example:

```text
/api/sales/filter?category=Electronics
```

---

# 📈 Data Visualisation

## Line Chart

The Line Chart displays revenue over time.

It is useful for identifying whether revenue is increasing or decreasing from month to month.

**Line Chart = Trends over time**

---

## Bar Chart

The Bar Chart compares revenue between product categories.

For example:

```text
Electronics
Clothing
Food
Books
Sports
```

**Bar Chart = Compare categories**

---

## Pie Chart

The Pie Chart displays how total revenue is distributed between different categories.

**Pie Chart = Distribution / proportion**

---

## Horizontal Bar Chart

The Horizontal Bar Chart compares sales revenue between:

```text
North
South
East
West
```

This makes regional performance easy to compare.

---

# 🧮 Monthly Revenue SQL

The main SQL concept for calculating monthly revenue is:

```sql
SELECT
    DATE_FORMAT(sold_on, '%b %Y') AS month,
    SUM(total_amount) AS revenue
FROM sales
GROUP BY YEAR(sold_on), MONTH(sold_on)
ORDER BY YEAR(sold_on), MONTH(sold_on);
```

### DATE_FORMAT

`DATE_FORMAT` converts a database date into a readable month and year.

Example:

```text
2026-08-16
     ↓
Aug 2026
```

### GROUP BY

`GROUP BY` groups sales records belonging to the same month.

### SUM

```sql
SUM(total_amount)
```

adds all sales amounts together to calculate the revenue for each month.

> In the final backend implementation, the year and month can also be retrieved separately from MySQL and converted into the display label in Python. The analytics concept remains grouping sales by year/month and summing revenue.

---

# 🔍 How Filtering Works

The filter state is stored in `App.jsx`.

```jsx
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [category, setCategory] = useState("");
```

The filters are passed to dashboard components using props.

Example:

```jsx
<RevenueLineChart filters={filters} />
```

Each component watches for filter changes using `useEffect`.

```jsx
useEffect(() => {
  fetchMonthlySales();
}, [
  filters.fromDate,
  filters.toDate,
  filters.category
]);
```

When a user changes a filter:

```text
User changes filter
       ↓
React state changes
       ↓
New props are passed
       ↓
useEffect runs again
       ↓
Axios calls Flask API
       ↓
Flask filters MySQL data
       ↓
New data is returned
       ↓
Chart updates automatically
```

---

# ⚛️ React Concepts Used

## useState

`useState` stores changing data in React.

Example:

```jsx
const [data, setData] = useState([]);
```

When the state changes, React updates the UI.

---

## useEffect

`useEffect` is used to run API calls when a component loads or when filter values change.

Example:

```jsx
useEffect(() => {
  fetchData();
}, [filters.fromDate, filters.toDate, filters.category]);
```

When any value in the dependency array changes, the API is called again.

---

## Props

Props are used to pass information from one React component to another.

In this project, `App.jsx` passes the filters to all dashboard components.

---

# 🌐 Axios

Axios connects the React frontend with the Flask backend.

Example:

```jsx
const response = await api.get("/api/sales/monthly", {
  params: {
    from: filters.fromDate || undefined,
    to: filters.toDate || undefined,
    category: filters.category || undefined,
  },
});
```

---

# 📊 Recharts

Recharts is a React charting library.

It is used in this project to create:

- Line Charts
- Bar Charts
- Pie Charts
- Horizontal Bar Charts

---

## ResponsiveContainer

Example:

```jsx
<ResponsiveContainer width="100%" height={350}>
  <LineChart data={data}>
    ...
  </LineChart>
</ResponsiveContainer>
```

`ResponsiveContainer` automatically adjusts the chart according to the available screen width.

This helps the dashboard work correctly on different screen sizes.

---

# 🔗 SQL JOIN

The project uses JOIN to connect sales, products and categories.

Example:

```sql
FROM sales s

JOIN products p
ON s.product_id = p.id

JOIN categories c
ON p.category_id = c.id
```

Relationship:

```text
sales
   ↓ product_id

products
   ↓ category_id

categories
```

JOIN allows the backend to retrieve related information from multiple tables.

---

# 🧮 SQL Functions Used

### SUM

```sql
SUM(total_amount)
```

Calculates total revenue.

### COUNT

```sql
COUNT(*)
```

Calculates total number of orders.

### AVG

```sql
AVG(total_amount)
```

Calculates average order value.

### GROUP BY

Groups similar records together, such as sales belonging to the same month or category.

---

# 🌍 CORS

React and Flask run on different development ports.

Example:

```text
React → localhost:5173
Flask → localhost:5000
```

Flask-CORS allows the frontend to communicate with the backend.

```python
from flask_cors import CORS

CORS(app)
```

---

# ▶️ How to Run the Project

## 1. Start MySQL

Make sure MySQL is running and the `sales_analytics` database has been created.

---

## 2. Start Flask Backend

Open a terminal and move into the backend folder.

```bash
cd backend
```

Activate your virtual environment if you created one.

Then run:

```bash
python app.py
```

Flask should run on:

```text
http://127.0.0.1:5000
```

---

## 3. Start React Frontend

Open another terminal.

```bash
cd frontend
```

Install dependencies if needed:

```bash
npm install
```

Start React:

```bash
npm run dev
```

Vite normally provides a local address such as:

```text
http://localhost:5173
```

Open that address in the browser.

---

# 🧪 API Testing

The Flask APIs can be tested using Postman.

Important endpoints to test:

```text
GET /api/kpis

GET /api/sales/monthly

GET /api/sales/by-category

GET /api/sales/by-region

GET /api/sales/top-products

GET /api/sales/filter?category=Electronics
```

---

# 💡 Main Challenge

The main challenge was making all dashboard components update when the user changed a filter.

I solved this by:

1. Keeping the filter state in `App.jsx`.
2. Passing the filter values to components using props.
3. Adding the filter values to the `useEffect` dependency array.
4. Sending the filters to Flask using Axios query parameters.
5. Applying those filters to the MySQL queries.

This makes all charts and KPI cards update dynamically.

---

# 📚 What I Learned

From this project, I learned:

- How React communicates with Flask
- How Flask communicates with MySQL
- How to build REST APIs
- How to use Axios
- How to create charts using Recharts
- How to use `useState`
- How to use `useEffect`
- How React props work
- How to implement dashboard filters
- How to use SQL `SUM`, `AVG`, `COUNT` and `GROUP BY`
- How to use SQL JOIN
- How to create responsive data visualisations

---

# 🎤 Simple Project Explanation

> I developed a Sales Analytics Dashboard using React, Flask and MySQL. MySQL stores the sales data and Flask provides REST APIs. React calls the APIs using Axios. I used Recharts to display the data using Line, Bar and Pie charts. The dashboard also contains KPI cards and a Top 5 Products table. The filters are stored in App.jsx, and when a filter changes, useEffect calls the APIs again and updates the dashboard automatically.

---

## Quick Revision

```text
React                 = Frontend
Flask                 = Backend
MySQL                 = Database
Axios                 = API communication
Recharts              = Data visualisation
useState              = Stores changing data
useEffect             = Runs when dependencies change
Props                 = Pass data between components
SUM                   = Adds values
AVG                   = Calculates average
COUNT                 = Counts records
GROUP BY              = Groups records
JOIN                  = Connects tables
Line Chart            = Shows trends
Bar Chart             = Compares categories
Pie Chart             = Shows distribution
ResponsiveContainer   = Makes charts responsive
CORS                  = Allows frontend/backend communication
```

## ⭐ Project Flow

**MySQL stores the data → Flask processes it → Axios fetches it → React manages it → Recharts visualizes it.**