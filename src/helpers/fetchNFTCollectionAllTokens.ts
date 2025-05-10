import NftContractData from "../contracts/NFTCollection.json"
import Web3 from 'web3'
import MulticallAbi from '../contracts/MulticallAbi.json'

import { MULTICALL_CONTRACTS } from './constants'
import { Interface as AbiInterface } from '@ethersproject/abi'


import { CHAIN_INFO } from "./constants"

import { callMulticall } from './callMulticall'

const fetchNFTCollectionAllTokens = (options) => {
  const {
    chainId,
    collectionAddress,
    chunkSize,
    onFetching,
  } = {
    chunkSize: 500,
    onFetching: (cursorPos, total) => {},
    ...options
  }

  return new Promise((resolve, reject) => {
    const chainInfo = CHAIN_INFO(chainId)
    const NFTAbi = NftContractData
    if (chainInfo && chainInfo.rpcUrls) {
      try {
        const web3 = new Web3(chainInfo.rpcUrls[0])

        const multicall = new web3.eth.Contract(MulticallAbi, MULTICALL_CONTRACTS[chainId])
        const abiI = new AbiInterface(NFTAbi)
        callMulticall({
          multicall,
          target: collectionAddress,
          encoder: abiI,
          calls: {
            totalSupply:      { func: 'totalSupply' },
            maxSupply:        { func: 'MAX_SUPPLY' },
            maxSupply_2:      { func: 'maxSupply' },
            baseExtension:    { func: 'baseExtension' },
          }
        }).then((mcAnswer) => {
          let totalSupply = 0
          let maxSupply = 0
          if (mcAnswer.totalSupply) totalSupply = mcAnswer.totalSupply
          if (mcAnswer.maxSupply_2) maxSupply = mcAnswer.maxSupply_2
          if (mcAnswer.maxSupply) maxSupply = mcAnswer.maxSupply
          
          const mcCalls = {}
          for (let tokenId = 1; tokenId < (maxSupply || totalSupply); tokenId++) {
            mcCalls[`${tokenId}_tokenURI`] = { func: 'tokenURI', args: [tokenId] }
            mcCalls[`${tokenId}_ownerOf`] = { func: 'ownerOf', args: [tokenId] }
          }
          callMulticall({
            multicall,
            target: collectionAddress,
            encoder: abiI,
            calls: mcCalls,
            chunkSize,
            onFetching,
          }).then((tokenAnswer) => {
            const _ret = {}
            Object.keys(tokenAnswer).forEach((tokenId_field) => {
              if (tokenAnswer[tokenId_field] !== false) {
                const [ tokenId, field ] = tokenId_field.split(`_`)
                _ret[tokenId] = _ret[tokenId] || {}
                _ret[tokenId][field] = tokenAnswer[tokenId_field]
                _ret[tokenId].tokenId = tokenId
                if (mcAnswer.baseExtension && field == `tokenURI`) {
                  _ret[tokenId][field] = `${_ret[tokenId][field]}${tokenId}${mcAnswer.baseExtension}`
                }
              }
            })
            resolve(_ret)
          }).catch((err) => {
            reject(err)
            console.log('>>> fetchNFTCollectionAllTokens', err)
          })
        }).catch((err) => {
          console.log('>>> Fail fetch all NFT info', err)
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

export default fetchNFTCollectionAllTokens