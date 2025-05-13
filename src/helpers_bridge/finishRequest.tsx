import TargetBridgeJson from "@/../contracts/artifacts/GCCTargetBridge.json"
import callContractMethod from '@/helpers/callContractMethod'

const finishRequest = (options) => {
  const {
    activeWeb3,
    address,
    requestId,
    to,
    weiAmount,
    calcGas,
    onTrx = (txHash) => {},
    onSuccess = () => {},
    onError = () => {},
    onFinally = () => {}
  } = options
  
  const contract = new activeWeb3.eth.Contract(TargetBridgeJson.abi, address)
  
  return callContractMethod({
    activeWeb3,
    contract,
    method: 'bridgeIn',
    args: [
      requestId,
      to,
      weiAmount
    ],
    calcGas,
    onTrx,
    onSuccess,
    onError,
    onFinally
  })
}


export default finishRequest