// @ts-nocheck
import { configureChains } from 'wagmi';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import NETWORKS from '@/constants/NETWORKS'

import { mainnet } from 'wagmi/chains'

const GET_ALL_CHAINS = () => {
  return Object.keys(NETWORKS).map((chainName) => {
    return {
      id: NETWORKS[chainName].chainId,
      network: chainName,
      name: NETWORKS[chainName].name,
      nativeCurrency: NETWORKS[chainName].nativeCurrency,
      explorer: NETWORKS[chainName].explorer,
      contracts: {
        ensUniversalResolver: false
      },
      rpcUrls: {
        default: {
          http: [
            NETWORKS[chainName].rpc
          ]
        },
        public: {
          http: [
            NETWORKS[chainName].rpc
          ]
        }
      },
    }
  })
}

export const GET_CHAIN_BYID = (chainId) => {
  const info = Object
    .keys(NETWORKS)
    .filter((chainName) => {
      return NETWORKS[chainName].chainId == chainId
    })
    .map((chainName) => {
      return {
        id: NETWORKS[chainName].chainId,
        network: chainName,
        name: NETWORKS[chainName].name,
        nativeCurrency: NETWORKS[chainName].nativeCurrency,
        explorer: NETWORKS[chainName].explorer,
        contracts: {
          ensUniversalResolver: (NETWORKS[chainName].ensUniversalResolver) ? {
            address: NETWORKS[chainName].ensUniversalResolver,
          } : false
        },
        rpcUrls: {
          default: {
            http: [
              NETWORKS[chainName].rpc
            ]
          },
          public: {
            http: [
              NETWORKS[chainName].rpc
            ]
          }
        },
      }
    })
  return info[0] || false
}

const GET_CHAIN = (chainName) => {
  return {
    id: NETWORKS[chainName].chainId,
    network: chainName,
    name: NETWORKS[chainName].name,
    nativeCurrency: NETWORKS[chainName].nativeCurrency,
    rpcUrls: {
      default: {
        http: [
          NETWORKS[chainName].rpc
        ]
      },
      public: {
        http: [
          NETWORKS[chainName].rpc
        ]
      }
    },
  }
}

export const GET_TX_LINK = (chainId, hash) => {
  return NETWORKS[chainId].explorer + '/tx/' + hash
}

export const GET_CHAIN_RPC = (chainId) => {
  const chainData = Object.keys(NETWORKS).filter((chainName) => {
    return `${NETWORKS[chainName].chainId}` == `${chainId}`
  })
  if (chainData.length) return NETWORKS[chainData[0]].rpc
}
export const GET_CHAIN_MULTICALL = (chainId) => {
  const chainData = Object.keys(NETWORKS).filter((chainName) => {
    return `${NETWORKS[chainName].chainId}` == `${chainId}`
  })
  if (chainData.length) return NETWORKS[chainData[0]].multicall
}

export const getChainsConfig = (chainIds) => {
  const networks = (chainIds == undefined)
    ? GET_ALL_CHAINS()
    : (chainIds instanceof Array)
      ? chainIds.map((chainId) => { return GET_CHAIN_BYID(chainId) })
      : [GET_CHAIN_BYID(chainIds)]
console.log('>>> networks', networks)
  return configureChains(
    networks,
    [
      jsonRpcProvider({
        rpc: (chain) => ({
          http: GET_CHAIN_RPC(chain.id),
        }),
      }),
    ],
  )
}
