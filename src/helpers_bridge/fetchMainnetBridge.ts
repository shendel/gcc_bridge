import BridgeJson from "@/../contracts/artifacts/GCCBridge.json"
import Web3 from 'web3'
import { Interface as AbiInterface } from '@ethersproject/abi'
import { GET_CHAIN_RPC } from '@/web3/chains'

import { callMulticall } from '@/helpers/callMulticall'
import Web3ObjectToArray from "@/helpers/Web3ObjectToArray"
import { fromWei } from '@/helpers/wei'
import getMultiCall, { getMultiCallAddress, getMultiCallInterface }from '@/web3/getMultiCall'

const fetchMainnetBridge = (options) => {
  const {
    address,
    chainId,
  } = {
    ...options
  }
  return new Promise((resolve, reject) => {
    const chainRpc = GET_CHAIN_RPC(chainId)
    const BridgeAbi = BridgeJson.abi
    if (chainRpc) {
      try {
        const web3 = new Web3(chainRpc)

        const multicall = getMultiCall(chainId)
        const abiI = new AbiInterface(BridgeAbi)

        callMulticall({
          multicall,
          target: address,
          encoder: abiI,
          calls: {
            owner:                      { func: 'owner' },
            lockedAmount:               { func: 'getLockedAmount' },
            tokenDecimals:              { func: 'getDecimals' },
            tokenSymbol:                { func: 'getSymbol' },
            tokenAddress:               { func: 'token' },
            queryLength:                { func: 'getQueryLength' },
            refundTimeout:              { func: 'getRefundTimeout' },
            timestamp: {
              func: 'getCurrentBlockTimestamp', target: getMultiCallAddress(chainId), encoder: getMultiCallInterface()
            }
          }
        }).then((mcAnswer) => {
          resolve({
            chainId,
            address,
            ...mcAnswer,
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

export default fetchMainnetBridge