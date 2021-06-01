const HDWalletProvider = require('@truffle/hdwallet-provider');
const fs = require('fs');
const {INFURA_API_KEY, mnemonic} = require("./.secret.json");

module.exports = {
  contracts_build_directory: './frontend/src/contracts',
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard BSC port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`),
      network_id: 4,
      // confirmations: 2,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${INFURA_API_KEY}`),
      network_id: 3,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
      // confirmations: 2,
    },
    kovan: {
      provider: () => new HDWalletProvider(process.env.MNENOMIC, "https://kovan.infura.io/v3/" + process.env.INFURA_API_KEY),
      network_id: 42,
      networkCheckTimeout: 1000000,
      timeoutBlocks: 200,
    },
    bsc: {
      provider: () => new HDWalletProvider(mnemonic, `https://data-seed-prebsc-1-s1.binance.org:8545`),
      network_id: 97,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    mainnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://bsc-dataseed1.binance.org`),
      network_id: 56,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
  },

  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "^0.8.0", // A version or constraint - Ex. "^0.5.0"
    }
  }
}