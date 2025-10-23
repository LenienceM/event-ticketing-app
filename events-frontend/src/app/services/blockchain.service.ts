import { Injectable } from '@angular/core';
import { ethers } from 'ethers';
import ticketABI from './abi/Tickets.json';

//import ticketAbi from "./blockchain/artifacts/contracts/Tickets.json"; 

declare let window: any; // Access the MetaMask object

@Injectable({
  providedIn: 'root'
})
export class BlockchainService {
  private provider!: ethers.BrowserProvider;
  private signer!: ethers.Signer;
  private contract!: ethers.Contract;

  // 🪙 Your deployed contract address (from Hardhat/Optimism/Sepolia)
  private contractAddress = '0xYourDeployedContractAddressHere';

  async connectWallet(): Promise<string | null> {
    try {
      if (!window.ethereum) {
        alert('Please install MetaMask!');
        return null;
      }

      this.provider = new ethers.BrowserProvider(window.ethereum);
      await this.provider.send('eth_requestAccounts', []);
      this.signer = await this.provider.getSigner();

      const address = await this.signer.getAddress();

      // Connect contract instance
      this.contract = new ethers.Contract(
        this.contractAddress,
        (ticketABI as any).abi,
        this.signer
      );

      console.log('Connected wallet:', address);
      return address;
    } catch (error) {
      console.error('MetaMask connection failed:', error);
      return null;
    }
  }

  async getEvent(eventId: number) {
    try {
      const eventData = await this.contract.events(eventId);
      console.log('Event:', eventData);
      return eventData;
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  }

  async buyTicket(eventId: number, price: string) {
    try {
      const tx = await this.contract.buyTicket(eventId, {
        value: ethers.parseEther(price)
      });
      console.log('Transaction sent:', tx.hash);
      await tx.wait();
      console.log('Transaction confirmed!');
      return tx.hash;
    } catch (error) {
      console.error('Error buying ticket:', error);
      throw error;
    }
  }
}
