import { HardhatUserConfig } from "hardhat/types";
import "hardhat-deploy";
import "@nomicfoundation/hardhat-toolbox";
import "./tasks/greeting";
import "./tasks/rustgreeting";

require("dotenv").config();

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";

const config: HardhatUserConfig = {
  defaultNetwork: "localhost",
  networks: {
    localhost: {
      url: "http://0.0.0.0:8545",
      accounts: [DEPLOYER_PRIVATE_KEY],
      chainId: 1337,

    },
    dev: {
      url: "https://rpc.dev.gblend.xyz/",
      accounts: [DEPLOYER_PRIVATE_KEY],
      chainId: 20993,
    },
    hardhat: {
      chainId: 1337,
    },
  },
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;
