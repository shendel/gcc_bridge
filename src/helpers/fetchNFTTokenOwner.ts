import NFTAbi from "../contracts/ERC721Abi.json"
import Web3 from 'web3'

import { CHAIN_INFO } from "./constants"


const fetchNFTTokenOwner = (options) => {
  const {
    chainId,
    collection,
    tokenId
  } = options
  
  return new Promise((resolve, reject) => {
    const chainInfo = CHAIN_INFO(chainId)
    if (chainInfo && chainInfo.rpcUrls) {
      try {
        const web3 = new Web3(chainInfo.rpcUrls[0])

        const contract = new web3.eth.Contract(NFTAbi, collection)
        contract.methods.ownerOf(tokenId).call().then((owner) => {
          resolve(owner)
        }).catch((err) => {
          reject(err)
        })
      } catch (err) {
        reject(err)
      }
    } else {
      reject(`NOT_SUPPORTED_CHAIN`)
    }
  })
}

export default fetchNFTTokenOwner