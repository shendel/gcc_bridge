import { createContext, useContext, useState, useEffect } from "react";
import fetchTargetBridge from '@/helpers_bridge/fetchTargetBridge'


const TargetBridgeContext = createContext({
  contractInfo: false,
  isFetching: false,
  isError: false,
  fetchBridgeInfo: () => {}
});

export const useTargetBridge = () => {
  return useContext(TargetBridgeContext);
};


// Провайдер контекста
export default function TargetBridgeProvider(props) {
  const {
    chainId,
    contractAddress,
    children
  } = props
  
  const [ isFetching, setIsFetching ] = useState(true)
  const [ isError, setIsError ] = useState(false)
  const [ isNeedFetch, setIsNeedFetch ] = useState(true)
  const [ contractInfo, setContractInfo ] = useState(false)
 
  useEffect(() => {
    if (chainId && contractAddress && isNeedFetch) {
      console.log('>>> Fetching')
      setIsFetching(true)
      fetchTargetBridge({
        chainId,
        address: contractAddress,
      }).then((answer) => {
        console.log('>>> Target info', answer)
        setIsError(false)
        setIsFetching(false)
        setIsNeedFetch(false)
        setContractInfo(answer)
      }).catch((err) => {
        console.log('>>> failFetch', err)
        setIsFetching(false)
        setIsError(true)
        setIsNeedFetch(false)
      })
    }
  }, [ chainId, contractAddress, isNeedFetch ])
  
  const fetchInfo = () => {
    setIsNeedFetch(true)
  }
  return (
    <TargetBridgeContext.Provider value={{
      contractInfo,
      isError,
      isFetching,
      fetchInfo,
    }}>
      {children}
    </TargetBridgeContext.Provider>
  );
}

