import mysql.connector
import random
from datetime import date, timedelta


# Connect to MySQL
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="hariharan",
    database="sales_analytics"
)

cursor = db.cursor()


# --------------------------------
# Clear old data
# --------------------------------

cursor.execute("DELETE FROM sales")
cursor.execute("DELETE FROM products")
cursor.execute("DELETE FROM categories")

db.commit()


# --------------------------------
# Insert Categories
# --------------------------------

categories = [
    "Electronics",
    "Clothing",
    "Food",
    "Books",
    "Sports"
]

category_ids = {}

for category in categories:

    cursor.execute(
        "INSERT INTO categories (name) VALUES (%s)",
        (category,)
    )

    category_ids[category] = cursor.lastrowid

db.commit()


# --------------------------------
# Insert Products
# --------------------------------

products = [
    ("Laptop", "Electronics", 55000),
    ("Smartphone", "Electronics", 30000),
    ("Headphones", "Electronics", 2500),

    ("T-Shirt", "Clothing", 700),
    ("Jeans", "Clothing", 1500),
    ("Jacket", "Clothing", 2500),

    ("Coffee", "Food", 300),
    ("Chocolate", "Food", 150),
    ("Dry Fruits", "Food", 600),

    ("Python Book", "Books", 650),
    ("React Book", "Books", 750),
    ("Business Book", "Books", 500),

    ("Football", "Sports", 1200),
    ("Cricket Bat", "Sports", 3000),
    ("Yoga Mat", "Sports", 900)
]

product_ids = []

for name, category, price in products:

    category_id = category_ids[category]

    cursor.execute(
        """
        INSERT INTO products
        (name, category_id, price)
        VALUES (%s, %s, %s)
        """,
        (name, category_id, price)
    )

    product_ids.append({
        "id": cursor.lastrowid,
        "name": name,
        "price": price
    })

db.commit()


# --------------------------------
# Insert 150 Sales Records
# --------------------------------

regions = ["North", "South", "East", "West"]

today = date.today()
start_date = today - timedelta(days=365)

for i in range(150):

    product = random.choice(product_ids)

    quantity = random.randint(1, 5)

    total_amount = product["price"] * quantity

    random_days = random.randint(0, 365)

    sold_on = start_date + timedelta(days=random_days)

    region = random.choice(regions)

    cursor.execute(
        """
        INSERT INTO sales
        (product_id, quantity, total_amount, sold_on, region)
        VALUES (%s, %s, %s, %s, %s)
        """,
        (
            product["id"],
            quantity,
            total_amount,
            sold_on,
            region
        )
    )

db.commit()


print("-------------------------------")
print("Database seeded successfully!")
print("-------------------------------")
print("5 categories added")
print("15 products added")
print("150 sales records added")


cursor.close()
db.close()