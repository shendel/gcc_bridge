import BridgeJson from "@/../contracts/artifacts/GCCBridge.json"
import TargetBridgeJson from "@/../contracts/artifacts/GCCTargetBridge.json"
import Web3 from 'web3'
import { Interface as AbiInterface } from '@ethersproject/abi'
import { GET_CHAIN_RPC } from '@/web3/chains'
import getMultiCall from '@/web3/getMultiCall'

import { callMulticall } from '@/helpers/callMulticall'
import Web3ObjectToArray from "@/helpers/Web3ObjectToArray"
import { fromWei } from '@/helpers/wei'

const fetchQuery = (options) => {
  const {
    address,
    chainId,
    targetChainId,
    targetChainAddress,
    offset,
    limit
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
            requests: {
              func: 'getRequests', args: [ offset, limit ], asArray: true
            },
          }
        }).then((mcAnswer) => {
          const { requests } = mcAnswer
          const ids = requests.map(({ id }) => {
            return id
          })
          const targetMulticall = getMultiCall(targetChainId)
          const targetAbitI = new AbiInterface(TargetBridgeJson.abi)
          console.log('>>> ids',ids, targetChainAddress)
          callMulticall({
            multicall: targetMulticall,
            target: targetChainAddress,
            encoder: targetAbitI,
            calls: {
              info: {
                func: 'getRequestsById', args: [ ids ], asArray: true 
              }
            }
          }).then(({ info }) => {
            console.log('>>> TARGET INFO', info)
            const infoById = {}
            info.map((inf) => {
              infoById[inf.id] = inf
            })
            resolve({
              chainId,
              address,
              requests: requests.map((request) => {
                return {
                  ...request,
                  target: infoById[request.id]
                }
              })
            })
          }).catch((err) => {
            console.log('fail fetch target info', err)
            reject(err)
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

export default fetchQuery