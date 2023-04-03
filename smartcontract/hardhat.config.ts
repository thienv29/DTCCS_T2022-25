// require('dotenv').config();
// require("@nomiclabs/hardhat-ethers");
// require("@nomiclabs/hardhat-etherscan");

// module.exports = {
//   defaultNetwork: "polygon_mumbai",
//   networks: {
//     hardhat: {
//     },
//     polygon_mumbai: {
//       url: "https://fragrant-twilight-isle.matic-testnet.discover.quiknode.pro/97de336ecd9e1c8706fcb05dbe9c3d2a219bbbc8/",
//       accounts: [process.env.PRIVATE_KEY]
//     }
//   },
//   etherscan: {
//     apiKey: process.env.POLYGONSCAN_API_KEY
//   },
//   solidity: {
//     version: "0.8.9",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   },
// }


require("@nomiclabs/hardhat-ethers");

module.exports = {
  defaultNetwork: "mumbai",
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com/",
      accounts: ["cee9cb0bd64f7d69407fe264c2d51cd5c24db42d5e4706d2e80dfbf0bf210406"],
      allowUnlimitedContractSize: true
    }
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  },
  allowUnlimitedContractSize: true
}
