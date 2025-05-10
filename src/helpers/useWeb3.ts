import {
  setupWeb3,
  switchOrAddChain,
  onBlockchainChanged,
  doConnectWithMetamask,
  isMetamaskConnected,
  onWalletChanged,
  getConnectedAddress 
} from "/helpers/setupWeb3"
import { useEffect, useState } from "react"

const useWeb3 = (_chainId) => {
  const [ chainId, setChainId ] = useState(_chainId)
  const [ isWalletConnecting, setIsWalletConnecting ] = useState(false)
  const [ activeWeb3, setActiveWeb3 ] = useState(false)
  const [ activeChainId, setActiveChainId ] = useState(false)
  const [ address, setAddress ] = useState(false)
  const [ isSwitchChain, setIsSwitchChain ] = useState(false)
  
  const initOnWeb3Ready = async () => {
    if (activeWeb3 && chainId && (`${activeChainId}` == `${chainId}`)) {
      activeWeb3.eth.getAccounts().then((accounts) => {
        //setAddress(accounts[0] || false)
      }).catch((err) => {
        console.log('>>> initOnWeb3Ready', err)
      })
    } else {
      const _isConnected = await isMetamaskConnected()
      const _lsConnected = window.localStorage.getItem('WEB3_CONNECTED')
      if (_isConnected) {// && _lsConnected) {
        connectWeb3()
      } else {
        setAddress(false)
      }
    }
  }

  useEffect(() => {
    initOnWeb3Ready()
  }, [ activeWeb3 ])

  
  const onConnect = async () => {
    initOnWeb3Ready()
  }
  
  if (!_chainId) {
    useEffect(() =>{
      if (chainId) {
        initOnWeb3Ready()
      }
    }, [chainId])
  }
  onWalletChanged(onConnect)
  
  const connectWeb3 = async () => {
    doConnectWithMetamask({
      onBeforeConnect: () => { setIsWalletConnecting(true) },
      onSetActiveChain: setActiveChainId,
      onConnected: async (cId, web3) => {
        window.localStorage.setItem('WEB3_CONNECTED', true)
        setIsWalletConnecting(false)
        setActiveWeb3((`${cId}` == `${chainId}`) ? web3 : false)
        setAddress(await getConnectedAddress())
        //initOnWeb3Ready()
      },
      onError: (err) => {
        setIsWalletConnecting(false)
      },
    })
  }
  
  onBlockchainChanged((chainData) => {
    initOnWeb3Ready()
  })
  
  const isConnected = () => {
    const _lsConnected = window.localStorage.getItem('WEB3_CONNECTED')
    return address !== false// && _lsConnected
  }
  

  const switchChainId = (newChainId) => {
    setIsSwitchChain(true)
    switchOrAddChain(newChainId || chainId).then((isSwitched) => {
      setIsSwitchChain(false)
    })
  }
  
  const disconnectWallet = () => {
    window.localStorage.removeItem('WEB3_CONNECTED')
    setAddress(false)
    setActiveChainId(false)
    setActiveWeb3(false)
  }

  const [ isSwitchAccount, setIsSwitchAccount ] = useState(false)
  const switchAccount = () => {
    setIsSwitchAccount(true)
    window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {}
        }
      ]
    }).then(() => {
      setIsSwitchAccount(false)
    }).catch((err) => {
      setIsSwitchAccount(false)
    })
  }
  
  return {
    isWalletConnecting,
    isConnected,
    isSwitchChain,
    address,
    activeChainId,
    activeWeb3,
    connectWeb3,
    switchChainId,
    setChainId,
    switchAccount,
    isSwitchAccount,
    disconnectWallet
  }
}


export default useWeb3