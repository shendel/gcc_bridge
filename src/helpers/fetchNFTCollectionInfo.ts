import NftContractData from "../contracts/NFTCollection.json"
import Web3 from 'web3'
import MulticallAbi from '../contracts/MulticallAbi.json'

import { MULTICALL_CONTRACTS } from './constants'
import { Interface as AbiInterface } from '@ethersproject/abi'


import { CHAIN_INFO } from "./constants"

import { callMulticall } from './callMulticall'


const fetchNFTCollectionInfo = (options) => {
  const {
    address,
    forAddress,
    chainId
  } = {
    forAddress: false,
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
          target: address,
          encoder: abiI,
          calls: {
            owner:            { func: 'owner' },
            ...((forAddress)
              ? {
                balance: { func: 'balanceOf', args: [ forAddress ] }
              } : {}
            ),
            totalSupply:      { func: 'totalSupply', _isBigNumber: true },
            maxSupply:        { func: 'MAX_SUPPLY', _isBigNumber: true },
            name:             { func: 'name' },
            contractURI :     { func: 'contractURI ' },
            hiddenMetadataUri:{ func: 'hiddenMetadataUri' },
            baseExtension:    { func: 'baseExtension' },
            zeroTokenURI:     { func: 'tokenURI', args: [0] },
            symbol:           { func: 'symbol' },
          }
        }).then((mcAnswer) => {
          resolve(mcAnswer)
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

export default fetchNFTCollectionInfo