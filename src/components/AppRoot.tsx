import { useState, useEffect } from 'react'

import Web3Connector from '@/web3/Web3Connector'
import InjectedWeb3Provider from '@/web3/InjectedWeb3Provider'

import ConfirmationModal from "./ConfirmationModal";
import NotificationProvider from "@/contexts/NotificationContext"

import NETWORKS from '@/constants/NETWORKS'
import {
  MAINNET_CHAIN_ID,
} from '@/config'

const allChainIds = Object.keys(NETWORKS).map((slug) => {
  return NETWORKS[slug].chainId
})

export default function AppRoot(props) {
  const {
    children,
  } = props

  const chainId = MAINNET_CHAIN_ID
  const chainIds = [MAINNET_CHAIN_ID]

  const [ workChainId, setWorkChainId ] = useState(chainId)
  const [ allowedChainIds, setAllowedChainIds ] = useState(chainIds)


  return (
    <>
      <NotificationProvider>
        <Web3Connector chainIds={allowedChainIds} autoConnect={true}>
          <InjectedWeb3Provider chainId={workChainId} chainIds={allowedChainIds}>
            <ConfirmationModal>
              {children}
            </ConfirmationModal>
          </InjectedWeb3Provider>
        </Web3Connector>
      </NotificationProvider>
    </>
  )
}