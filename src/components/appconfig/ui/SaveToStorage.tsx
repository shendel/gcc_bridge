import { useState, useEffect } from "react"
import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import Button from '@/components/appconfig/ui/Button'
import { GET_CHAIN_BYID } from '@/web3/chains'
import { getStorageInfo } from '@/storage/'
import { useStorageProvider } from '@/storage/StorageProvider'

export default function SaveToStorage(props) {
  const {
    onClick = () => {},
    children,
  } = props
  
  const {
    switchNetwork,
    injectedChainId,
    isSwitchingNetwork
  } = useInjectedWeb3()
  const {
    isStorageSave,
  } = useStorageProvider()

  const {
    storageChainId
  } = getStorageInfo()
  const storageChainInfo = GET_CHAIN_BYID(storageChainId)
  const handleClick = () => {
    if (storageChainId != injectedChainId) {
      switchNetwork(storageChainId)
    } else {
      onClick()
    }
  }
  return (
    <Button
      onClick={handleClick}
      fullWidth={true}
      isBold={true}
      color={`green`} 
      isLoading={isStorageSave}
    >
      {(storageChainId != injectedChainId) ? (
        `Switch chain to "${storageChainInfo.name}" for save app config`
      ) : (
        <>{children || `Save app config to storage`}</>
      )}
    </Button>
  )
}