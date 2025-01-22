import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

// 水龙头：
// https://cloud.google.com/application/web3/faucet/ethereum/sepolia

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337
    },
    sepolia: {
      url: process.env.SEPOLIA_URL || '',
      chainId: Number(process.env.SEPOLIA_CHAIN_ID) || 11155111,
      accounts: [process.env.SEPOLIA_PRIVATE_KEY || '']
    }
  }
};

export default config;
