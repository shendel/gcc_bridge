import BridgeJson from "@/../contracts/artifacts/GCCBridge.json"
import callContractMethod from '@/helpers/callContractMethod'

const rejectRequest = (options) => {
  const {
    activeWeb3,
    address,
    requestId,
    rejectAction,
    rejectReason,
    calcGas,
    onTrx = (txHash) => {},
    onSuccess = () => {},
    onError = () => {},
    onFinally = () => {}
  } = options
  
  const contract = new activeWeb3.eth.Contract(BridgeJson.abi, address)
  
  return callContractMethod({
    activeWeb3,
    contract,
    method: 'reject',
    args: [
      requestId,
      rejectAction,
      rejectReason,
    ],
    calcGas,
    onTrx,
    onSuccess,
    onError,
    onFinally
  })
}


export default rejectRequest