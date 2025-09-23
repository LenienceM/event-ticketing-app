from fastapi import FastAPI
from pydantic import BaseModel
from web3 import Web3 
import os
from dotenv import load_dotenv
import psycopg2

# Load variables from .env file
load_dotenv()

# Read them
DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST") 
DB_PORT = os.getenv("DB_PORT")


conn = psycopg2.connect(
    dbname=DB_NAME,
    user=DB_USER,
    password=DB_PASSWORD,
    host=DB_HOST,
    port=DB_PORT
)
cur = conn.cursor()

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

# Initialize FastAPI
app = FastAPI()

# Request body schema
class TicketPurchase(BaseModel):
    txHash: str
    eventId: int

@app.post("/api/tickets/purchase")
def purchase_ticket(purchase: TicketPurchase):
    # Connect to Ethereum node (Optimism Sepolia testnet)
    w3 = Web3(Web3.HTTPProvider("https://sepolia.optimism.io"))

    # Fetch transaction receipt
    receipt = w3.eth.get_transaction_receipt(purchase.txHash)

    # Insert into Postgres
    cur.execute(
        "INSERT INTO tickets (event_id, tx_hash, buyer) VALUES (%s, %s, %s)",
        (purchase.eventId, purchase.txHash, receipt["from"])
    )
    conn.commit()

    return {"status": "ok", "buyer": receipt["from"]}
