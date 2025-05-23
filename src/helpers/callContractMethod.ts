import Web3 from 'web3'
import { calcSendArgWithFee } from "./calcSendArgWithFee"
import { BigNumber } from 'bignumber.js'

const callContractMethod = (options) => {
  return new Promise((resolve, reject) => {
    const {
      activeWeb3,
      contract,
      method,
      args,
      weiAmount,
      calcGas,
    } = options
    const onTrx = options.onTrx || (() => {})
    const onSuccess = options.onSuccess || (() => {})
    const onError = options.onError || (() => {})
    const onFinally = options.onFinally || (() => {})
console.log('>>> callContractMethod', activeWeb3, contract, method, args)
    activeWeb3.eth.getAccounts().then(async (accounts) => {
      if (accounts.length>0) {
        const activeWallet = accounts[0]
        const sendArgs = await calcSendArgWithFee(
          activeWallet,
          contract,
          method,
          args || [],
          weiAmount
        )
        const gasPrice = await activeWeb3.eth.getGasPrice()
        if (calcGas) {
          resolve({
            gas: new BigNumber(sendArgs.gas).multipliedBy(gasPrice).toFixed()
          })
          return
        }
        sendArgs.gasPrice = gasPrice

        let txHash
        contract.methods[method](...(args || []))
          .send(sendArgs)
          .on('transactionHash', (hash) => {
            txHash = hash
            onTrx(hash)
          })
          .on('error', (error) => {
            console.log('>> ERROR', error)
            if (!error.toString().includes('not mined within')) {
              console.log('>>> on error', error)
              onError(error)
              reject(error)
            } else {
              console.log('>>> wail wait')
            }
          })
          .on('receipt', (receipt) => {
            onSuccess(receipt)
          })
          .then((res) => {
            resolve(res)
            onFinally(res)
          }).catch((err) => {
            if(err.message.includes('not mined within 50 blocks')) {
              const handle = setInterval(() => {
                activeWeb3.eth.getTransactionReceipt(txHash).then((resp) => {
                  // @to-do - process logs
                  if(resp != null && resp.blockNumber > 0) {
                    clearInterval(handle)
                    resolve(resp)
                    onSuccess(resp)
                  }
                })
              }, 1000)
            } else {
              reject(err)
            }
          })
      } else {
        reject('NO_ACTIVE_ACCOUNT')
      }
    }).catch((err) => {
      console.log('>>> callContractMethod', err)
      reject(err)
    })
  })
        
}


export default callContractMethod