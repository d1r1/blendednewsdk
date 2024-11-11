import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "ethers";
import fs from "fs";
import crypto from "crypto";
import path from "path";
require("dotenv").config();

const DEPLOYER_PRIVATE_KEY =
  process.env.DEPLOYER_PRIVATE_KEY ||
  "";

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts, ethers, config, network } = hre;
  const { deploy, save, getOrNull } = deployments;
  const { deployer: deployerAddress } = await getNamedAccounts();

  console.log("deployerAddress", deployerAddress);
  // ---------------------
  // Deploy WASM contract
  // ---------------------
  console.log("Deploying WASM contract...");
  const wasmBinaryPath = "./hellorust/bin/greeting.wasm"; // TODO: Update this path to your actual wasm file
  // @ts-ignore
  const provider = new ethers.JsonRpcProvider(network.config.url);

  // Create a new wallet instance to deploy the contract,
  // as using the default wallet enforces a maximum contract size limit,
  // which is not applicable in our case.
  const deployer = new ethers.Wallet(DEPLOYER_PRIVATE_KEY, provider);

  const rustaddress = await deployWasmContract(
    wasmBinaryPath,
    deployer,
    provider,
    getOrNull,
    save
  );

  if (rustaddress === null) {
    console.error("Deployment failed for Rust greeting.");
    process.exit(-1); 
  }


  // ---------------------
  // Deploy GreetingWithWorld contract
  // ---------------------
  console.log("Deploying solidity Greeting contract...");
  const fluentGreetingContractAddress = rustaddress; // Replace with the actual address if different

  const greetingWithWorld = await deploy("GreetingWithWorld", {
    from: deployerAddress,
    args: [fluentGreetingContractAddress],
    gasLimit: 10_000_000,
    log: true,
  });

  console.log(`GreetingWithWorld contract deployed at: ${greetingWithWorld.address}`);
};


async function deployWasmContract(
  wasmBinaryPath: string,
  deployer: ethers.Wallet,
  provider: ethers.JsonRpcProvider,
  getOrNull: any,
  save: any
): Promise<string | null> {
  let wasmBinary: string;

  try {
      wasmBinary = fs.readFileSync(wasmBinaryPath).toString('hex');
  } catch (err: any) {
      console.error(`Failed to read the WASM file: ${err.message}`);
      return null;  // Return null if reading the WASM file fails
  }

  const tx = {
      data: '0x' + wasmBinary,
      gasLimit: 10_000_000,
  };

  console.log('Deploying contract...');
  try {
      const txResponse = await deployer.sendTransaction(tx);
      console.log('Transaction sent:', txResponse.hash);

      // Wait for the transaction to be mined
      const receipt = await txResponse.wait();
      
      if (receipt && receipt.contractAddress) {
          // Get the contract address from the receipt
          const contractAddress = receipt.contractAddress;
          console.log(`Contract deployed at: ${contractAddress}`);
          return contractAddress; // Return the contract address
      } else {
          console.error("Failed to get a valid receipt or contract address.");
          return null;  // Return null if there's no valid receipt or contract address
      }

  } catch (err: any) {
      console.error(`Deployment failed: ${err.message}`);
      return null;  // Return null if deployment fails
  }

  // Fetch the latest block number (this will not affect return value)

}
export default func;
func.tags = ["all"];
