import BridgeJson from "@/../contracts/artifacts/GCCBridge.json"
import callContractMethod from '@/helpers/callContractMethod'

const bridgeTokens = (options) => {
  const {
    activeWeb3,
    address,
    amountWei,
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
    method: 'initBridge',
    args: [
      amountWei,
    ],
    calcGas,
    onTrx,
    onSuccess,
    onError,
    onFinally
  })
}


export default bridgeTokens