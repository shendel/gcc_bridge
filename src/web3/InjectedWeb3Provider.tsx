import { useState, useEffect, createContext, useContext } from 'react'
import Web3 from 'web3'
import { useAccount } from 'wagmi'
import { useNetwork, useSwitchNetwork } from 'wagmi'
import fetchBalance from '@/helpers/fetchBalance'


const InjectedWeb3Context = createContext({
  injectedWeb3: false,
  injectedAccount: false,
  injectedChainId: false,
  balance: 0,
  isBalanceFetched: false,
  isBalanceFetching: true,
  isConnected: true,
  switchNetwork: () => {},
  switchAccount: () => {},
  isSwitchingNetwork: false,
})

export const useInjectedWeb3 = () => {
  return useContext(InjectedWeb3Context)
}

export default function InjectedWeb3Provider(props) {
  const {
    children,
    chainId,
    chainIds
  } = props
  
  const [ injectedWeb3, setInjectedWeb3 ] = useState(false)
  const [ injectedAccount, setInjectedAccount ] = useState(false)

  const [ balance, setBalance ] = useState(0)
  const [ isBalanceFetched, setIsBalanceFetched ] = useState(false)
  const [ isBalanceFetching, setIsBalanceFetching ] = useState(true)
  
  const [ isConnected, setIsConnected ] = useState(true)
  
  const { address } = useAccount()
  const account = useAccount()
  const network = useNetwork()
  const switchN = useSwitchNetwork()
  const { isLoading, pendingChainId, switchNetwork: _switchNetwork } = useSwitchNetwork()
  
  const switchNetwork = (chainId) => {
    _switchNetwork(chainId)
    console.log(_switchNetwork)
    console.log(pendingChainId, isLoading)
  }
  const switchAccount = () => {}

  const isSwitchingNetwork = (!!isLoading || !!pendingChainId)
  
  const {
    chain
  } = useNetwork()
  const activeChainId = chain?.id
  const [ activeConnector, setActiveConnector ] = useState(false)
  
  useEffect(() => {
    if (activeConnector) {
      activeConnector.getProvider().then(async (provider) => {
        const web3 = new Web3(provider)
        setInjectedWeb3(web3)
      })
    }
  }, [ activeConnector ])

  /* balance */
  useEffect(() => {
    if (address && chainId) {
      setIsBalanceFetched(false)
      setIsBalanceFetching(true)
      
      fetchBalance({
        address,
        chainId,
      }).then((balance) => {
        setBalance(balance)
        setIsBalanceFetched(true)
        setIsBalanceFetching(false)
      }).catch((err) => {
        setIsBalanceFetched(false)
        setIsBalanceFetching(false)
        console.log('>> InjectedWeb3Provider', err)
      })
    }
  }, [ address, chainId ])
  /* ---- */

  useEffect(() => {
    if (account && account.connector) {
      setInjectedAccount(account.address)
      setActiveConnector(account.connector)
    } else {
      setInjectedAccount(false)
      setActiveConnector(false)
    }
  }, [ chainId, account ])

  return (
    <InjectedWeb3Context.Provider
      value={{
        injectedWeb3,
        injectedAccount,
        injectedChainId: activeChainId,
        balance,
        isBalanceFetched,
        isBalanceFetching,
        isConnected,
        isSwitchingNetwork,
        switchAccount,
        switchNetwork,
      }
    }>
      {children}
    </InjectedWeb3Context.Provider>
  )
}