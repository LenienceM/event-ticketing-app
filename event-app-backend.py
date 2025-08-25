import os
from dotenv import load_dotenv
import psycopg2

# Load variables from .env file
load_dotenv()

# Read them
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")  # default if not set
DB_PORT = os.getenv("DB_PORT", "5432")

# Use in your connection
conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)
cur = conn.cursor()

# Create event
def create_event(name, venue, capacity,date, description):
    cur.execute(
        """
        INSERT INTO events (name, venue, capacity, date, description)
        VALUES (%s, %s, %s, %s, %s) RETURNING id;
        """,
        (name, venue,capacity, date, description)
    )
    event_id = cur.fetchone()[0]
    conn.commit()
    print(f"Event created with ID: {event_id}")

# Example usage
#create_event("Blockchain Summit", "Cape Town Convention Center", "100","2025-09-10 10:00:00", "Web3 & Layer 2 ticketing showcase")






