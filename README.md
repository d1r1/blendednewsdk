# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.ts
```

## ComposableHelloWorld

In order to use this, create a .env DEPLOYER_PRIVATE_KEY = "Your private key here"

```shell
npm install
cd hellorust
make
cd ..
npm compile 
pnpm deploy (npx hardhat compile)
```

## How to run?

1. Create `.env` file in the root directory and add the following:

```
DEPLOYER_PRIVATE_KEY="Your private key here"
```

2. Build wasm contract

```shell
cd hellorust
make
cd ..
```

3. Compile the contract

```shell
npx hardhat compile
```

4. Deploy the contract

```shell
npx hardhat deploy --network localhost

# or

npx hardhat deploy --network dev
```

5. Interact with the contract

```shell
# SOLIDITY_CONTRACT_ADDRESS - was returned after the deploy command
npx hardhat get-greeting  --contract <SOLIDITY_CONTRACT_ADDRESS> --network localhost
```
