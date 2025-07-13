
import psycopg2
from psycopg2 import OperationalError

def test_connection():
    try:
        connection = psycopg2.connect(
            dbname="postgres",
            user="postgres",
            password="IshaN22399@",
            host="db.aedzidgkcfvilffyixng.supabase.co",
            port="5432"
        )
        cursor = connection.cursor()
        cursor.execute("SELECT version();")
        version = cursor.fetchone()
        print("✅ Connection successful!")
        print("PostgreSQL version:", version)
        cursor.close()
        connection.close()

        cursor.close()
        connection.close()
    except OperationalError as e:
        print("❌ Failed to connect to the database.")
        print(f"Error: {e}")

if __name__ == "__main__":
    test_connection()
