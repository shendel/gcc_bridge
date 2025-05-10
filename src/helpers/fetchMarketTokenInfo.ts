import MarketContractData from "../contracts/source/artifacts/Marketplace.json"
import Web3 from 'web3'
import MulticallAbi from '../contracts/MulticallAbi.json'

import { MULTICALL_CONTRACTS } from './constants'
import { Interface as AbiInterface } from '@ethersproject/abi'


import { CHAIN_INFO } from "./constants"

import { callMulticall } from './callMulticall'

// @To-Do - use new method
const fetchMarketTokenInfo = (options) => {
  const {
    marketAddress,
    chainId,
    collectionAddress,
    tokenId,
  } = {
    ...options
  }
  return new Promise((resolve, reject) => {
    const chainInfo = CHAIN_INFO(chainId)
    const MarketContractAbi = MarketContractData.abi
    if (chainInfo && chainInfo.rpcUrls) {
      try {
        const web3 = new Web3(chainInfo.rpcUrls[0])

        const multicall = new web3.eth.Contract(MulticallAbi, MULTICALL_CONTRACTS[chainId])
        const abiI = new AbiInterface(MarketContractAbi)
        callMulticall({
          multicall,
          target: marketAddress,
          encoder: abiI,
          calls: {
            tokensAtSale:     { func: 'getTokensAtSale', args: [0, 0] },
            allowedERC20:     { func: 'getAllowedERC20' },
          }
        }).then((mcAnswer) => {
          let tokenInfo = false
          if (mcAnswer?.tokensAtSale) {
            Object.keys(mcAnswer.tokensAtSale).forEach((key) => {
              if (
                (mcAnswer.tokensAtSale[key].tokenId.toString() === tokenId.toString())
                &&
                (mcAnswer.tokensAtSale[key].collection.toString().toLowerCase() === collectionAddress.toString().toLowerCase())
              ) {
                tokenInfo = mcAnswer.tokensAtSale[key]
                return false
              }
            })
          }

          resolve({
            tokenInfo,
            allowedERC20: mcAnswer.allowedERC20
          })
        }).catch((err) => {
          console.log('>>> Fail fetch all info', err)
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

export default fetchMarketTokenInfo