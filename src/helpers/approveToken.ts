import TokenAbi from 'human-standard-token-abi'
import Web3 from 'web3'
import { calcSendArgWithFee } from "@/helpers/calcSendArgWithFee"
import { BigNumber } from 'bignumber.js'

const approveToken = (options) => {
  return new Promise(async (resolve, reject) => {
    const {
      activeWallet,
      activeWeb3,
      tokenAddress,
      approveFor,
      weiAmount,
      calcGas,
    } = options
    console.log('>>>> approveToken', options)

    const onTrx = options.onTrx || (() => {})
    const onSuccess = options.onSuccess || (() => {})
    const onError = options.onError || (() => {})
    const onFinally = options.onFinally || (() => {})

    const contract = new activeWeb3.eth.Contract(TokenAbi, tokenAddress)

    const sendArgs = await calcSendArgWithFee(
      activeWallet,
      contract,
      'approve',
      [ approveFor, weiAmount ]
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

    console.log('>>> on approve timeout', activeWeb3.eth.transactionBlockTimeout)
    contract.methods['approve'](...([ approveFor, weiAmount ]))
      .send(sendArgs)
      .on('transactionHash', (hash) => {
        console.log('ON TX', hash)
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
      }).catch( (err) => {
        console.error(err)
        if(err.message.includes('not mined within')) {
          console.log('>>> NOT MINTED IN 50 BLOCKS - WAIT MINT!!!')
          const handle = setInterval(() => {
            activeWeb3.eth.getTransactionReceipt(txHash).then((resp) => {
              if(resp != null && resp.blockNumber > 0) {
                clearInterval(handle)
                resolve(resp)
                onSuccess(resp)
              }
            })
          }, 1000)
          console.log('>>> Minted ready')
        } else {
          reject(err)
        }
      }).finally(() => {
        console.log('>>> Finally')
      })
  })
}


export default approveToken