require("@nomiclabs/hardhat-waffle")
const fs = require("fs")
const privatekey = fs.readFileSync(".secret").toString()
const projectId = "2JGl6IKfp6lyaFINajbbbOqVAmh"

module.exports = {
  networks: {
    hardhat: {
      chainId: 1337
    },
    mumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [privatekey]
    },
    mainnet: {
      url: `https://polygon-mumbai.infura.io/v3/${projectId}`,
      accounts: [privatekey]
    },
  },
  solidity: "0.8.17",
};