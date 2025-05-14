import BridgeJson from "@/../contracts/artifacts/GCCBridge.json"
import TargetBridgeJson from "@/../contracts/artifacts/GCCTargetBridge.json"
import Web3 from 'web3'
import { Interface as AbiInterface } from '@ethersproject/abi'
import { GET_CHAIN_RPC } from '@/web3/chains'
import getMultiCall, { getMultiCallAddress, getMultiCallInterface }from '@/web3/getMultiCall'

import { callMulticall } from '@/helpers/callMulticall'
import Web3ObjectToArray from "@/helpers/Web3ObjectToArray"
import { fromWei } from '@/helpers/wei'

const fetchRequest = (options) => {
  const {
    requestId,
    address,
    chainId,
    targetChainId,
    targetChainAddress,
  } = {
    ...options
  }
  return new Promise((resolve, reject) => {
    const BridgeAbi = BridgeJson.abi
    const TargetBridgeAbi = TargetBridgeJson.abi

    const multicall = getMultiCall(chainId)
    const abiI = new AbiInterface(BridgeAbi)

    const targetMulticall = getMultiCall(targetChainId)
    const targetAbiI = new AbiInterface(TargetBridgeAbi)
      
    callMulticall({
      multicall,
      target: address,
      encoder: abiI,
      calls: {
        sourceRequest: {
          func: 'getRequest', args: [ requestId ]
        },
        sourceTimestamp: {
          func: 'getCurrentBlockTimestamp', target: getMultiCallAddress(chainId), encoder: getMultiCallInterface()
        }
      }
    }).then((mcAnswer) => {
      callMulticall({
        multicall: targetMulticall,
        target: targetChainAddress,
        encoder:targetAbiI,
        calls: {
          targetRequest: {
            func: 'getRequest', args: [ requestId ]
          },
          targetTimestamp: {
            func: 'getCurrentBlockTimestamp', target: getMultiCallAddress(targetChainId), encoder: getMultiCallInterface()
          }
        }
      }).then((targetAnswer) => {
        resolve({
          chainId,
          address,
          ...mcAnswer,
          ...targetAnswer
        })
      }).catch((err) => {
        console.log('>>> fail fetch', err)
        reject(err)
      })
    }).catch((err) => {
      console.log('>>> Fail fetch all info', err)
      reject(err)
    })
  })
}

export default fetchRequest