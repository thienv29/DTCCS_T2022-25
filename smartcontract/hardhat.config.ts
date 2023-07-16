


// require("@nomiclabs/hardhat-ethers");

// module.exports = {
//   defaultNetwork: "goerli",
//   networks: {
//     hardhat: {
//       allowUnlimitedContractSize: true
//     },
//     goerli: {
//       url: "https://green-alien-pallet.ethereum-goerli.discover.quiknode.pro/75510ec1797c18a784f14ab8e160e47ffbc22c97/",
//       accounts: ["bf13ae02dbbd28398d057cc99859b1a4c6ebf1c9da8488c5b3d0534e1b91748e"],
//       allowUnlimitedContractSize: true
//     }
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
//   paths: {
//     sources: "./contracts",
//     tests: "./test",
//     cache: "./cache",
//     artifacts: "./artifacts"
//   },
//   mocha: {
//     timeout: 20000
//   },
//   allowUnlimitedContractSize: true
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
