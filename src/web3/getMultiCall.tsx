import { GET_CHAIN_RPC, GET_CHAIN_MULTICALL } from './chains'
import Web3 from 'web3'
import MulticallAbi from '@/abi/MulticallAbi.json'
import { Interface as AbiInterface } from '@ethersproject/abi'

export function getMultiCallAddress(chainId) {
  return GET_CHAIN_MULTICALL(chainId)
}
export function getMultiCallInterface() {
  return new AbiInterface(MulticallAbi)
}
export default function getMultiCall(chainId) {
  const rpc = GET_CHAIN_RPC(chainId)
  const address = GET_CHAIN_MULTICALL(chainId)
  const web3 = new Web3(rpc)
  const multicall = new web3.eth.Contract(MulticallAbi, address)
  
  return multicall
}