require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    optimism_sepolia: {
      url: "https://sepolia.optimism.io",  // RPC for Optimism Sepolia
      accounts: [process.env.PRIVATE_KEY]  // MetaMask private key
    }
  }
};
