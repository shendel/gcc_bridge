import getMultiCall from '@/web3/getMultiCall'

const fetchBalance = ({ address, chainId } = options) => {
  return new Promise((resolve, reject) => {
    const multicall = getMultiCall(chainId)

    multicall.methods.getEthBalance(address).call().then((balance) => {
      resolve(balance)
    }).catch((err) => {
      reject(err)
    })
  })
}

export default fetchBalance