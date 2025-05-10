import Web3 from 'web3'
import MulticallAbi from '../contracts/MulticallAbi.json'

import { MULTICALL_CONTRACTS } from './constants'
import { Interface as AbiInterface } from '@ethersproject/abi'

import NFT_ABI from '../contracts/ERC721Abi.json'

import { CHAIN_INFO } from "./constants"

import { callMulticallGroup } from './callMulticall'

const fetchManyNftContent = (options) => {
  const {
    chainId,
    tokensInfo,
  } = options
  return new Promise((resolve, reject) => {
    const chainInfo = CHAIN_INFO(chainId)
    if (chainInfo && chainInfo.rpcUrls) {
      try {
        const web3 = new Web3(chainInfo.rpcUrls[0])

        const multicall = new web3.eth.Contract(MulticallAbi, MULTICALL_CONTRACTS[chainId])
        const abiI = new AbiInterface(NFT_ABI)
        const usedCollections = {}
        const callsBaseExtenstions = tokensInfo.map((data) => {
          const {
            address
          } = data
          if (!usedCollections[address]) {
            usedCollections[address] = true
            return {
              group: address,
              func: `baseExtension`,
              encoder: abiI,
              target: address
            }
          } else return false
        }).filter((call) => { return call !== false })

        const calls = tokensInfo.map((data) => {
          const {
            address,
            tokenId
          } = data
          return {
            group: `${address}_${tokenId}`,
            func: `tokenURI`,
            encoder: abiI,
            args: [tokenId],
            target: address,
          }
        })
        callMulticallGroup({
          multicall,
          calls: callsBaseExtenstions,
        }).then((extenstionAnswer) => {
          callMulticallGroup({
            multicall,
            calls,
          }).then((mcAnswer) => {
            Object.keys(mcAnswer).map((key) => {
              const [ address, tokenId ] = key.split(`_`)
              if (extenstionAnswer[address] && extenstionAnswer[address].baseExtension) {
                if (mcAnswer[key].tokenURI.substr(-extenstionAnswer[address].baseExtension.length) !== extenstionAnswer[address].baseExtension) {
                  mcAnswer[key].tokenURI = `${mcAnswer[key].tokenURI}${tokenId}${extenstionAnswer[address].baseExtension}`
                } 
              }
            })
            resolve(mcAnswer)
          }).catch((err) => {
            console.log('>>> Fail fetch all info', err)
            reject(err)
          })
        }).catch((err) => {
          console.log('>>> fail fetch baseExtension', err)
        })
      } catch (err) {
        console.log('>>> err', err)
        reject(err)
      }
    } else {
      reject(`NOT_SUPPORTED_CHAIN`)
    }
  })
}

export default fetchManyNftContent