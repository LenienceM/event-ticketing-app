import { ethers } from "ethers";
import ticketAbi from "./blockchain/artifacts/contracts/Tickets.json"; 

const contractAddress = "0x0923A82F9FaD2E6a817890b18cc8E37971286257";

async function connectWallet() {
  if (window.ethereum) {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    console.log("Connected account:", await signer.getAddress());
    return { provider, signer };
  } else {
    alert("Please install MetaMask");
  }
}

async function buyTicket(eventId, price) {
  const { signer } = await connectWallet();
  const contract = new ethers.Contract(contractAddress, ticketAbi, signer);

  try {
    const tx = await contract.buyTicket(eventId, {
      value: ethers.parseEther(price.toString()) // send ETH
    });
    await tx.wait();
    console.log("Ticket purchased:", tx.hash);

    // Notify backend (to sync database)
    await fetch("https://localhost:5000/api/tickets/purchase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ txHash: tx.hash, eventId })
    });
  } catch (err) {
    console.error("Purchase failed:", err);
  }
}

