import Web3 from 'web3'
import { BigNumber } from 'bignumber.js'

const sendEther = (options) => {
  return new Promise((resolve, reject) => {
    const {
      account,
      to,
      weiAmount
    } = options
    
    const onTrx = options.onTrx || (() => {})
    const onSuccess = options.onSuccess || (() => {})
    const onError = options.onError || (() => {})
    const onFinally = options.onFinally || (() => {})

    account.connector.getProvider().then(async (provider) => {
      const activeWallet = account.address
      const activeWeb3 = new Web3(provider)

      const gasPrice = await activeWeb3.eth.getGasPrice()

      const txData = {
        from: Web3.utils.toChecksumAddress(activeWallet),
        to: to.trim(),
        gasPrice,
        value: Web3.utils.toHex(weiAmount),
      }

      const limit = await activeWeb3.eth.estimateGas(txData)
      const multiplierForGasReserve = 1.05
      const hexLimitWithPercentForSuccess = new BigNumber(
        new BigNumber(limit).multipliedBy(multiplierForGasReserve).toFixed(0),
      ).toString(16)

      txData.gas = `0x${hexLimitWithPercentForSuccess}`

      activeWeb3.eth.sendTransaction(txData)
        .on('transactionHash', (hash) => {
          console.log('transaction hash:', hash)
          onTrx(hash)
        })
        .on('error', (error) => {
          console.log('transaction error:', error)
          onError(error)
          reject(error)
        })
        .on('receipt', (receipt) => {
          console.log('transaction receipt:', receipt)
          onSuccess(receipt)
        })
        .then((res) => {
          resolve(res)
          onFinally(res)
        })

    }).catch((err) => {
      console.log('>>> sendEther', err)
      reject(err)
    })
  })
        
}

export default sendEther