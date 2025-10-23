// src/services/api.js
// FastAPI URL
const API_URL = "http://localhost:5000/api"; 

export async function createEvent(eventData) {
  const response = await fetch(`${API_URL}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(eventData),
  });
  return response.json();
}

export async function purchaseTicket(ticketData) {
  const response = await fetch(`${API_URL}/tickets/purchase`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ticketData),
  });
  return response.json();
}
