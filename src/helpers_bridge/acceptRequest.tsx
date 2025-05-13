import BridgeJson from "@/../contracts/artifacts/GCCBridge.json"
import callContractMethod from '@/helpers/callContractMethod'

const acceptRequest = (options) => {
  const {
    activeWeb3,
    address,
    requestId,
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
    method: 'approve',
    args: [
      requestId,
      ""
    ],
    calcGas,
    onTrx,
    onSuccess,
    onError,
    onFinally
  })
}


export default acceptRequest