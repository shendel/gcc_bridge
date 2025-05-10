import { useState, useEffect, createContext, useContext } from 'react'
import { GET_CHAIN_RPC } from './chains'
import Web3 from 'web3'
import {
  getEthLikeWallet,
  getRandomMnemonicWords,
  mnemonicIsValid,
  convertMnemonicToValid
} from './mnemonic'

import fetchBalance from '@/helpers/fetchBalance'
import * as TgSdk from '@telegram-apps/sdk';

import {
  BROWSER_SEED_LS_NAME,
  BROWSER_SEED_LS_BACKUP_READY,
} from '@/config'

const STORAGE_SEED_KEY = BROWSER_SEED_LS_NAME || `NEXTGEN_BROWSER_SEED`

const authBrowserWeb3 = (chainId, ownMnemonic = false) => {
  const rpc = GET_CHAIN_RPC(chainId)
  const web3 = new Web3(rpc)
  
  let mnemonic = localStorage.getItem(STORAGE_SEED_KEY)
  if (!mnemonic) {
    
    mnemonic = getRandomMnemonicWords()
    
    localStorage.setItem(STORAGE_SEED_KEY, mnemonic)

  }
  
  const wallet = getEthLikeWallet({ mnemonic })
  const account = web3.eth.accounts.privateKeyToAccount( wallet.privateKey )
  web3.eth.accounts.wallet.add( account.privateKey )
  
  console.log('[BrowserWallet] >>>> ', wallet)
  return {
    web3,
    mnemonic,
    account: wallet.address
  }
}

const BrowserWeb3Context = createContext({
  browserWeb3: false,
  browserAccount: false,
  browserMnemonic: ``,
  browserBackupReady: false,
  balance: 0,
  isBalanceFetched: false,
  isBalanceFetching: true,
  switchAccount: () => {},
  browserChainId: false,
  switchNetwork: () => {},
  isSwitchingNetwork: false,
})

export const useBrowserWeb3 = () => {
  return useContext(BrowserWeb3Context)
}

export default function BrowserWeb3Provider(props) {
  const {
    children,
    chainId
  } = props
  const {
    chainIds
  } = {
    chainIds: [ chainId ],
    ...props
  }
  
  const [ browserWeb3, setBrowserWeb3 ] = useState(false)
  const [ browserAccount, setBrowserAccount ] = useState(false)
  const [ browserMnemonic, setBrowserMnemonic ] = useState(``)
  const [ browserBackupReady, setBrowserBackupReady ] = useState(false)
  
  const [ browserChainId, setBrowserChainId ] = useState(chainId)
  const [ activeChainId, setActiveChainId ] = useState(chainId)
  
  const [ tgMnemonic, setTgMnemonic ] = useState(false)
  
  const [ balance, setBalance ] = useState(0)
  const [ isBalanceFetched, setIsBalanceFetched ] = useState(false)
  const [ isBalanceFetching, setIsBalanceFetching ] = useState(true)

  
  
  /* balance */
  useEffect(() => {
    if (browserAccount && activeChainId) {
      setIsBalanceFetched(false)
      setIsBalanceFetching(true)
      setBrowserChainId(activeChainId)
      fetchBalance({
        address: browserAccount,
        chainId: activeChainId,
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
  }, [ browserAccount, activeChainId ])
  /* ---- */

  useEffect(() => {
    const { web3, account, mnemonic } = authBrowserWeb3(activeChainId)
    setBrowserWeb3(web3)
    setBrowserAccount(account)
    setBrowserMnemonic(mnemonic)
    setBrowserChainId(activeChainId)
  }, [ activeChainId ])

  useEffect(() => {
    if (tgMnemonic) {
      switchAccount(tgMnemonic)
    }
  }, [ tgMnemonic ])
  
  if (TgSdk.isMiniAppSupported() && TgSdk.isCloudStorageSupported()) {
    TgSdk.getCloudStorageItem(STORAGE_SEED_KEY).then((tgSeed) => {
      if (tgSeed) {
        setTgMnemonic(tgSeed)
      } else {
        if (browserMnemonic) {
          TgSdk.setCloudStorageItem(STORAGE_SEED_KEY, browserMnemonic)
        }
      }
    }).catch((err) => { /* browser dev */ })
  }
  
  const switchAccount = (newMnemonic) => {
    if (mnemonicIsValid(newMnemonic)) {
      console.log('>>> do switch account', newMnemonic)
      localStorage.setItem(STORAGE_SEED_KEY, convertMnemonicToValid(newMnemonic))
      const { web3, account, mnemonic } = authBrowserWeb3(browserChainId)
      setBrowserWeb3(web3)
      setBrowserAccount(account)
      setBrowserMnemonic(mnemonic)
      if (TgSdk.isMiniAppSupported() && TgSdk.isCloudStorageSupported()) {
        TgSdk.setCloudStorageItem(STORAGE_SEED_KEY, newMnemonic).catch((err) => { /* browser */ })
      }
      return true
    }
    return false
  }

  const switchNetwork = (newChainId) => {
    setActiveChainId(newChainId)
  }
  
  return (
    <BrowserWeb3Context.Provider
      value={{
        browserWeb3,
        browserMnemonic,
        browserAccount,
        balance,
        isBalanceFetched,
        isBalanceFetching,
        switchAccount,
        browserChainId,
        isSwitchingNetwork: false,
        switchNetwork,
      }}
    >
      {children}
    </BrowserWeb3Context.Provider>
  )
}