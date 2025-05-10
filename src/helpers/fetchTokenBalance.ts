import TokenAbi from 'human-standard-token-abi'
import { toWei, fromWei } from "./wei"
import { GET_CHAIN_RPC } from '@/web3/chains'
import Web3 from 'web3'

const fetchTokenBalance = (options) => {
  const {
    wallet, tokenAddress, chainId
  } = options
  return new Promise((resolve, reject) => {
    const rpc = GET_CHAIN_RPC(chainId)
    const web3 = new Web3(rpc)
    
    const contract = new web3.eth.Contract(TokenAbi, tokenAddress)
    contract.methods.symbol().call().then((symbol) => {
      contract.methods.decimals().call().then((decimals) => {
        contract.methods.balanceOf(wallet).call().then((balance) => {
          const normalized = fromWei(balance, decimals)
          resolve({
            wallet,
            tokenAddress,
            chainId,
            decimals,
            wei: balance,
            normalized,
            symbol,
          })
        }).catch((err) => {
          reject(err)
        })
      }).catch((err) => {
        reject(err)
      })
    }).catch((err) => {
      reject(err)
    })
  })
}

export default fetchTokenBalance