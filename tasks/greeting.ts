import { task } from "hardhat/config";

task("get-greeting", "Fetches the greeting from the deployed GreetingWithWorld contract")
  .addParam("contract", "The address of the deployed GreetingWithWorld contract")
  .setAction(async ({ contract }, hre) => {
    const { ethers } = hre;
    
    try {
      // Fetch the latest block number
      const blockNumber = await ethers.provider.getBlockNumber();
      console.log("Block Number:", blockNumber);
    } catch (error) {
      console.error("Error fetching block number:", error);
      process.exit(1); // Exit on failure
    }

    try {
      // Get contract instance
      const GreetingWithWorld = await ethers.getContractAt("GreetingWithWorld", contract);
      console.log("Trying to get greeting...");
      
      // Call the getGreeting method
      const greeting: string = await GreetingWithWorld.getGreeting();
      
      // Convert the BigNumber to a string for display
      console.log("Blended greeting:", greeting.toString());
    } catch (error) {
      console.error("Error calling getGreeting:", error);
      process.exit(1); // Exit on failure
    }
  });
