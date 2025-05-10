import TokenAbi from 'human-standard-token-abi'
import Web3 from 'web3'
import { calcSendArgWithFee } from "@/helpers/calcSendArgWithFee"
import { BigNumber } from 'bignumber.js'

const sendERC20 = (options) => {
  return new Promise((resolve, reject) => {
    const {
      account,
      tokenAddress,
      to,
      weiAmount
    } = options
    const onTrx = options.onTrx || (() => {})
    const onSuccess = options.onSuccess || (() => {})
    const onError = options.onError || (() => {})
    const onFinally = options.onFinally || (() => {})

    account.connector.getProvider().then(async (provider) => {
      const method = 'transfer'
      const args = [to, weiAmount]
      const activeWallet = account.address
      const activeWeb3 = new Web3(provider)
      const contract = new activeWeb3.eth.Contract(TokenAbi, tokenAddress)

      const sendArgs = await calcSendArgWithFee(
        activeWallet,
        contract,
        method,
        args,
        0
      )
      const gasPrice = await activeWeb3.eth.getGasPrice()
      sendArgs.gasPrice = gasPrice

      contract.methods[method](...(args || []))
        .send(sendArgs)
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
      console.log('>>> sendERC20', err)
      reject(err)
    })
  })
        
}


export default sendERC20