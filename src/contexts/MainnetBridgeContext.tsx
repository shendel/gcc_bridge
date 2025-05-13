import { createContext, useContext, useState, useEffect } from "react";
import fetchMainnetBridge from '@/helpers_bridge/fetchMainnetBridge'


const MainnetBridgeContext = createContext({
  contractInfo: false,
  isFetching: false,
  isError: false,
  fetchBridgeInfo: () => {}
});

export const useMainnetBridge = () => {
  return useContext(MainnetBridgeContext);
};


// Провайдер контекста
export default function MainnetBridgeProvider(props) {
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
      fetchMainnetBridge({
        chainId,
        address: contractAddress,
      }).then((answer) => {
        console.log('>>> Factory info', answer)
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
    <MainnetBridgeContext.Provider value={{
      contractInfo,
      isError,
      isFetching,
      fetchInfo,
    }}>
      {children}
    </MainnetBridgeContext.Provider>
  );
}

