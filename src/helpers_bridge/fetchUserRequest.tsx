import BridgeJson from "@/../contracts/artifacts/GCCBridge.json"
import TargetBridgeJson from "@/../contracts/artifacts/GCCTargetBridge.json"
import Web3 from 'web3'
import { Interface as AbiInterface } from '@ethersproject/abi'
import { GET_CHAIN_RPC } from '@/web3/chains'
import getMultiCall, { getMultiCallAddress, getMultiCallInterface }from '@/web3/getMultiCall'

import { callMulticall } from '@/helpers/callMulticall'
import Web3ObjectToArray from "@/helpers/Web3ObjectToArray"
import { fromWei } from '@/helpers/wei'

const fetchUserRequest = (options) => {
  const {
    address,
    chainId,
    user,
    targetChainId,
    targetChainAddress,
    offset = 0,
    limit = 0
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
            totalCount: {
              func: 'getUserRequestsCount', args: [ user ]
            },
            requests: {
              func: 'getUserRequests', args: [ user, offset, limit ], asArray: true
            },
            sourceTimestamp: {
              func: 'getCurrentBlockTimestamp', target: getMultiCallAddress(chainId), encoder: getMultiCallInterface()
            }
          }
        }).then((mcAnswer) => {
          const { requests, sourceTimestamp, totalCount } = mcAnswer
          const ids = requests.map(({ id }) => {
            return id
          })
          const targetMulticall = getMultiCall(targetChainId)
          const targetAbitI = new AbiInterface(TargetBridgeJson.abi)
          callMulticall({
            multicall: targetMulticall,
            target: targetChainAddress,
            encoder: targetAbitI,
            calls: {
              info: {
                func: 'getRequestsById', args: [ ids ], asArray: true 
              },
              targetTimestamp: {
                func: 'getCurrentBlockTimestamp', target: getMultiCallAddress(targetChainId), encoder: getMultiCallInterface()
              }
            }
          }).then(({ info, targetTimestamp }) => {
            const infoById = {}
            info.map((inf) => {
              infoById[inf.id] = inf
            })
            resolve({
              chainId,
              address,
              sourceTimestamp,
              targetTimestamp,
              totalCount,
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

export default fetchUserRequest