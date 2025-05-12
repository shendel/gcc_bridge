
import { useEffect, useState, Component } from "react"

import { useInjectedWeb3 } from '@/web3/InjectedWeb3Provider'
import ConnectWalletButton from '@/components/ConnectWalletButton'
import Tabs from '@/components/appconfig/ui/Tabs'

import Form from '@/components/bridge/Form/'

export default function Home(props) {
  const {
    gotoPage,
  } = props
  
  const {
    isConnected,
    injectedAccount
  } = useInjectedWeb3()

  
  return (
    <>
      {!injectedAccount && (
        <ConnectWalletButton />
      )}
      <Form />
    </>
  )
}
