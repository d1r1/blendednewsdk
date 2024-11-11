import { task } from "hardhat/config";

task("get-rustgreeting", "Fetches the greeting from the deployed GreetingWithWorld contract")
  .addParam("contract", "The address of the deployed GreetingWithWorld contract")
  .setAction(async ({ contract }, hre) => {
    const { ethers } = hre;

    try {
      // Get contract instance
      const GreetingWithWorld = await ethers.getContractAt("GreetingWithWorld", contract);
      console.log("Trying to get greeting...");

      // Call the getrustGreeting method
      const greeting = await GreetingWithWorld.getrustGreeting();
      console.log("Rust greeting from getrustGreeting:", greeting);

      // Log the type of 'greeting'
      console.log("Type of greeting:", typeof greeting);

      // Log the length of the greeting string
      console.log("Length of greeting:", greeting.length);

      // Check if the greeting contains only spaces or is empty
      if (greeting.trim() === "") {
        console.log("Greeting is effectively empty (whitespace or invisible characters).");
      } else {
        console.log("Greeting contains visible characters.");
      }

      // If it's a string, log it as is or in hexadecimal format to see the raw content
      console.log("Raw greeting in hexadecimal format:", [...greeting].map(c => c.charCodeAt(0).toString(16)).join(" "));
      
    } catch (error) {
      console.error("Error calling rust greeting:", error);
      process.exit(1); // Exit on failure
    }
  });
