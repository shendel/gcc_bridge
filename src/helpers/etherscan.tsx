import { GET_CHAIN_BYID } from '@/web3/chains'

export const getTransactionLink = (chainId, txHash) => {
  const chainInfo = GET_CHAIN_BYID(chainId)
  return `${chainInfo.explorer}${(chainInfo.explorer.slice(-1) == '/') ? '' : '/'}tx/${txHash}`
}

export const getAddressLink = (chainId, address) => {
  const chainInfo = GET_CHAIN_BYID(chainId)
  return `${chainInfo.explorer}${(chainInfo.explorer.slice(-1) == '/') ? '' : '/'}address/${address}`
}

export const getBlockLink = (chainId, blockNumber) => {
  const chainInfo = GET_CHAIN_BYID(chainId)
  return `${chainInfo.explorer}${(chainInfo.explorer.slice(-1) == '/') ? '' : '/'}block/${blockNumber}`
}
export const getShortAddress = (walletAddress) => {
  return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
}

export const getShortTxHash = (txHash) => {
  return `${txHash.slice(0,8)}...${txHash.slice(-8)}`
}