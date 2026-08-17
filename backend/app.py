from flask import Flask, jsonify, request
from flask_cors import CORS
import mysql.connector


app = Flask(__name__)
CORS(app)


# ==========================================
# DATABASE CONNECTION
# ==========================================

def get_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="hariharan",
        database="sales_analytics"
    )


# ==========================================
# FILTER HELPER
# ==========================================

def build_filters():

    from_date = request.args.get("from")
    to_date = request.args.get("to")
    category = request.args.get("category")

    conditions = []
    params = []

    if from_date:
        conditions.append("s.sold_on >= %s")
        params.append(from_date)

    if to_date:
        conditions.append("s.sold_on <= %s")
        params.append(to_date)

    if category:
        conditions.append("c.name = %s")
        params.append(category)

    if conditions:
        where_clause = " WHERE " + " AND ".join(conditions)
    else:
        where_clause = ""

    return where_clause, params


# ==========================================
# TEST API
# ==========================================

@app.route("/api/test", methods=["GET"])
def test_api():

    return jsonify({
        "success": True,
        "message": "Sales Analytics API is working"
    })


# ==========================================
# KPI API
# ==========================================

@app.route("/api/kpis", methods=["GET"])
def get_kpis():

    db = None
    cursor = None

    try:

        db = get_db()
        cursor = db.cursor(dictionary=True)

        where_clause, params = build_filters()

        base_join = """
            FROM sales s
            JOIN products p
            ON s.product_id = p.id
            JOIN categories c
            ON p.category_id = c.id
        """

        # TOTAL REVENUE
        cursor.execute(
            f"""
            SELECT
                COALESCE(SUM(s.total_amount), 0)
                AS total_revenue

            {base_join}

            {where_clause}
            """,
            tuple(params)
        )

        total_revenue = cursor.fetchone()["total_revenue"]


        # TOTAL ORDERS
        cursor.execute(
            f"""
            SELECT
                COUNT(*) AS total_orders

            {base_join}

            {where_clause}
            """,
            tuple(params)
        )

        total_orders = cursor.fetchone()["total_orders"]


        # AVERAGE ORDER VALUE
        cursor.execute(
            f"""
            SELECT
                COALESCE(
                    AVG(s.total_amount),
                    0
                ) AS average_order_value

            {base_join}

            {where_clause}
            """,
            tuple(params)
        )

        average_order_value = cursor.fetchone()[
            "average_order_value"
        ]


        # BEST SELLING PRODUCT
        cursor.execute(
            f"""
            SELECT
                p.name,
                SUM(s.quantity) AS units_sold

            {base_join}

            {where_clause}

            GROUP BY
                p.id,
                p.name

            ORDER BY
                units_sold DESC

            LIMIT 1
            """,
            tuple(params)
        )

        best_product = cursor.fetchone()


        return jsonify({
            "success": True,
            "data": {
                "total_revenue":
                    float(total_revenue),

                "total_orders":
                    int(total_orders),

                "average_order_value":
                    float(average_order_value),

                "best_selling_product": {
                    "name":
                        best_product["name"]
                        if best_product
                        else "No Data",

                    "units_sold":
                        int(best_product["units_sold"])
                        if best_product
                        else 0
                }
            }
        })


    except Exception as error:

        print("KPI ERROR:", error)

        return jsonify({
            "success": False,
            "message": "Unable to fetch KPI data",
            "error": str(error)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()


# ==========================================
# MONTHLY SALES API
# ==========================================

@app.route("/api/sales/monthly", methods=["GET"])
def monthly_sales():

    db = None
    cursor = None

    try:

        db = get_db()
        cursor = db.cursor(dictionary=True)

        from_date = request.args.get("from")
        to_date = request.args.get("to")
        category = request.args.get("category")

        conditions = []
        params = []

        # FROM DATE FILTER
        if from_date:
            conditions.append(
                "s.sold_on >= %s"
            )
            params.append(from_date)

        # TO DATE FILTER
        if to_date:
            conditions.append(
                "s.sold_on <= %s"
            )
            params.append(to_date)

        # CATEGORY FILTER
        if category:
            conditions.append(
                "c.name = %s"
            )
            params.append(category)

        # DEFAULT = LAST 12 MONTHS
        if not from_date and not to_date:
            conditions.append(
                """
                s.sold_on >=
                DATE_SUB(
                    CURDATE(),
                    INTERVAL 12 MONTH
                )
                """
            )

        if conditions:

            where_clause = (
                " WHERE "
                + " AND ".join(conditions)
            )

        else:

            where_clause = ""


        # ----------------------------------
        # NO DATE_FORMAT USED HERE
        # ----------------------------------

        query = f"""
            SELECT
                YEAR(s.sold_on) AS sale_year,
                MONTH(s.sold_on) AS sale_month,
                SUM(s.total_amount) AS revenue

            FROM sales s

            JOIN products p
                ON s.product_id = p.id

            JOIN categories c
                ON p.category_id = c.id

            {where_clause}

            GROUP BY
                YEAR(s.sold_on),
                MONTH(s.sold_on)

            ORDER BY
                YEAR(s.sold_on),
                MONTH(s.sold_on)
        """

        cursor.execute(
            query,
            tuple(params)
        )

        rows = cursor.fetchall()


        # Month names for chart labels
        month_names = {
            1: "Jan",
            2: "Feb",
            3: "Mar",
            4: "Apr",
            5: "May",
            6: "Jun",
            7: "Jul",
            8: "Aug",
            9: "Sep",
            10: "Oct",
            11: "Nov",
            12: "Dec"
        }


        data = []

        for row in rows:

            month_number = int(
                row["sale_month"]
            )

            year = int(
                row["sale_year"]
            )

            month_label = (
                f"{month_names[month_number]} "
                f"{year}"
            )

            data.append({
                "month": month_label,
                "revenue":
                    float(row["revenue"])
            })


        return jsonify({
            "success": True,
            "data": data
        })


    except Exception as error:

        print(
            "MONTHLY SALES ERROR:",
            error
        )

        return jsonify({
            "success": False,
            "message":
                "Unable to fetch monthly sales",
            "error": str(error)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()


# ==========================================
# SALES BY CATEGORY API
# ==========================================

@app.route(
    "/api/sales/by-category",
    methods=["GET"]
)
def sales_by_category():

    db = None
    cursor = None

    try:

        db = get_db()
        cursor = db.cursor(
            dictionary=True
        )

        where_clause, params = (
            build_filters()
        )

        cursor.execute(
            f"""
            SELECT
                c.name AS category,
                SUM(s.total_amount)
                AS revenue

            FROM sales s

            JOIN products p
                ON s.product_id = p.id

            JOIN categories c
                ON p.category_id = c.id

            {where_clause}

            GROUP BY
                c.id,
                c.name

            ORDER BY
                revenue DESC
            """,
            tuple(params)
        )

        rows = cursor.fetchall()

        data = []

        for row in rows:

            data.append({
                "category":
                    row["category"],

                "revenue":
                    float(row["revenue"])
            })


        return jsonify({
            "success": True,
            "data": data
        })


    except Exception as error:

        print(
            "CATEGORY SALES ERROR:",
            error
        )

        return jsonify({
            "success": False,
            "message":
                "Unable to fetch category sales",
            "error": str(error)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()


# ==========================================
# SALES BY REGION API
# ==========================================

@app.route(
    "/api/sales/by-region",
    methods=["GET"]
)
def sales_by_region():

    db = None
    cursor = None

    try:

        db = get_db()
        cursor = db.cursor(
            dictionary=True
        )

        where_clause, params = (
            build_filters()
        )

        cursor.execute(
            f"""
            SELECT
                s.region,
                SUM(s.total_amount)
                AS revenue

            FROM sales s

            JOIN products p
                ON s.product_id = p.id

            JOIN categories c
                ON p.category_id = c.id

            {where_clause}

            GROUP BY
                s.region

            ORDER BY
                revenue DESC
            """,
            tuple(params)
        )

        rows = cursor.fetchall()

        data = []

        for row in rows:

            data.append({
                "region":
                    row["region"],

                "revenue":
                    float(row["revenue"])
            })


        return jsonify({
            "success": True,
            "data": data
        })


    except Exception as error:

        print(
            "REGION SALES ERROR:",
            error
        )

        return jsonify({
            "success": False,
            "message":
                "Unable to fetch regional sales",
            "error": str(error)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()


# ==========================================
# TOP PRODUCTS API
# ==========================================

@app.route(
    "/api/sales/top-products",
    methods=["GET"]
)
def top_products():

    db = None
    cursor = None

    try:

        db = get_db()
        cursor = db.cursor(
            dictionary=True
        )

        where_clause, params = (
            build_filters()
        )

        cursor.execute(
            f"""
            SELECT
                p.name AS product,
                c.name AS category,
                SUM(s.quantity)
                    AS units_sold,
                SUM(s.total_amount)
                    AS revenue

            FROM sales s

            JOIN products p
                ON s.product_id = p.id

            JOIN categories c
                ON p.category_id = c.id

            {where_clause}

            GROUP BY
                p.id,
                p.name,
                c.id,
                c.name

            ORDER BY
                revenue DESC

            LIMIT 5
            """,
            tuple(params)
        )

        rows = cursor.fetchall()

        data = []

        for row in rows:

            data.append({
                "product":
                    row["product"],

                "category":
                    row["category"],

                "units_sold":
                    int(row["units_sold"]),

                "revenue":
                    float(row["revenue"])
            })


        return jsonify({
            "success": True,
            "data": data
        })


    except Exception as error:

        print(
            "TOP PRODUCTS ERROR:",
            error
        )

        return jsonify({
            "success": False,
            "message":
                "Unable to fetch top products",
            "error": str(error)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()


# ==========================================
# FILTER SUMMARY API
# ==========================================

@app.route(
    "/api/sales/filter",
    methods=["GET"]
)
def filtered_sales():

    db = None
    cursor = None

    try:

        db = get_db()
        cursor = db.cursor(
            dictionary=True
        )

        where_clause, params = (
            build_filters()
        )

        cursor.execute(
            f"""
            SELECT
                COUNT(*)
                    AS total_orders,

                COALESCE(
                    SUM(s.quantity),
                    0
                ) AS total_units,

                COALESCE(
                    SUM(s.total_amount),
                    0
                ) AS total_revenue,

                COALESCE(
                    AVG(s.total_amount),
                    0
                ) AS average_order_value

            FROM sales s

            JOIN products p
                ON s.product_id = p.id

            JOIN categories c
                ON p.category_id = c.id

            {where_clause}
            """,
            tuple(params)
        )

        result = cursor.fetchone()


        return jsonify({
            "success": True,

            "data": {

                "total_orders":
                    int(
                        result[
                            "total_orders"
                        ]
                    ),

                "total_units":
                    int(
                        result[
                            "total_units"
                        ]
                    ),

                "total_revenue":
                    float(
                        result[
                            "total_revenue"
                        ]
                    ),

                "average_order_value":
                    float(
                        result[
                            "average_order_value"
                        ]
                    )
            }
        })


    except Exception as error:

        print(
            "FILTER ERROR:",
            error
        )

        return jsonify({
            "success": False,
            "message":
                "Unable to fetch filtered sales",
            "error": str(error)
        }), 500


    finally:

        if cursor:
            cursor.close()

        if db:
            db.close()


# ==========================================
# START FLASK SERVER
# ==========================================

if __name__ == "__main__":
    app.run(debug=True)