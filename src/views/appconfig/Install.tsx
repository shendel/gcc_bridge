
import { useEffect, useState, Component } from "react"

import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import StakingForm from '@/components/StakingForm'
import StakingInfoBlock from '@/components/StakingInfoBlock'
import ConnectWalletButton from '@/components/ConnectWalletButton'
import LoadingPlaceholder from "@/components/LoadingPlaceholder";
import InstallAppForm from "@/components/appconfig/InstallAppForm";
import SetupAppForm from '@/components/appconfig/SetupAppForm'

import { useStorageProvider } from '@/storage/StorageProvider'

export default function AppConfigInstall(props) {
  const {
    children
  } = props
  const {
    isInstalled,
    isOwner,
    storageIsLoading,
    storageData
  } = useStorageProvider()

  if (storageIsLoading) {
    return (
      <div className="bg-opacity-50 fixed inset-0 flex justify-center items-center bg-white z-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    )
  }
  if (isInstalled) {
    return (
      <>{children}</>
    )
  }
  return (
    <>
      <InstallAppForm />
    </>
  )
}
