import NftContractData from "../contracts/NFTCollection.json"
import Web3 from 'web3'
import MulticallAbi from '../contracts/MulticallAbi.json'

import { MULTICALL_CONTRACTS } from './constants'
import { Interface as AbiInterface } from '@ethersproject/abi'


import { CHAIN_INFO } from "./constants"

import { callMulticallGroup } from './callMulticall'

const fetchNFTManyCollectionInfo = (options) => {
  const {
    addressList,
    chainId,
    forAddress,
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
        const groupInfoCalls = {
          owner:            { func: 'owner' },
          totalSupply:      { func: 'totalSupply' },
          maxSupply:        { func: 'MAX_SUPPLY' },
          name:             { func: 'name' },
          contractURI :     { func: 'contractURI ' },
          hiddenMetadataUri:{ func: 'hiddenMetadataUri' },
          baseExtension:    { func: 'baseExtension' },
          zeroTokenURI:     { func: 'tokenURI', args: [0] },
          symbol:           { func: 'symbol' },
          ...((forAddress)
              ? {
                balance: { func: 'balanceOf', args: [ forAddress ] }
              } : {}
            ),
        }
        let calls = []
        addressList.forEach((collectionAddress) => {
          Object.keys(groupInfoCalls).forEach((key) => { 
            calls = [
              ...calls,
              {
                group: collectionAddress,
                target: collectionAddress,
                encoder: abiI,
                value: key,
                ...groupInfoCalls[key]
              }
            ]
          })
        })
        callMulticallGroup({
          multicall,
          calls,
        }).then((mcAnswer) => {
          resolve(mcAnswer)
        }).catch((err) => {
          console.log('>>> Fail fetch many nft meta', err)
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

export default fetchNFTManyCollectionInfo