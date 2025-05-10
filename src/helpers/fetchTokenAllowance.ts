import TokenAbi from 'human-standard-token-abi'
import { toWei, fromWei } from "./wei"
import { GET_CHAIN_RPC } from '@/web3/chains'
import Web3 from 'web3'

const fetchTokenAllowance = (options) => {
  const {
    from, to, tokenAddress, chainId
  } = options
  return new Promise((resolve, reject) => {
    const rpc = GET_CHAIN_RPC(chainId)
    const web3 = new Web3(rpc)
    
    const contract = new web3.eth.Contract(TokenAbi, tokenAddress)
    contract.methods.allowance(from, to).call().then((allowance) => {
      resolve({
        from,
        to,
        allowance,
        tokenAddress,
        chainId,
      })
    }).catch((err) => {
      reject(err)
    })
  })
}

export default fetchTokenAllowance