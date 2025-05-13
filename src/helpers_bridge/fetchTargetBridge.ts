import TargetBridgeJson from "@/../contracts/artifacts/GCCTargetBridge.json"
import Web3 from 'web3'
import { Interface as AbiInterface } from '@ethersproject/abi'
import { GET_CHAIN_RPC } from '@/web3/chains'
import getMultiCall from '@/web3/getMultiCall'

import { callMulticall } from '@/helpers/callMulticall'
import Web3ObjectToArray from "@/helpers/Web3ObjectToArray"
import { fromWei } from '@/helpers/wei'

const fetchTargetBridge = (options) => {
  const {
    address,
    chainId,
  } = {
    ...options
  }
  return new Promise((resolve, reject) => {
    const chainRpc = GET_CHAIN_RPC(chainId)
    const BridgeAbi = TargetBridgeJson.abi
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
            bridgeRate:                 { func: 'getBridgeRate' },
            tokenDecimals:              { func: 'getDecimals' },
            tokenSymbol:                { func: 'getSymbol' },
            tokenAddress:               { func: 'token' },
            oracleBalance:              { func: 'getOracleBalance' },
            oracleAllowance:            { func: 'getOracleAllowance' }
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

export default fetchTargetBridge