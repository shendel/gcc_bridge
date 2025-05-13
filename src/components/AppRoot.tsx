import { useState, useEffect } from 'react'

import Web3Connector from '@/web3/Web3Connector'
import InjectedWeb3Provider from '@/web3/InjectedWeb3Provider'

import ConfirmationModal from "./ConfirmationModal";
import NotificationProvider from "@/contexts/NotificationContext"
import MainnetBridgeProvider from '@/contexts/MainnetBridgeContext'
import TargetBridgeProvider from '@/contexts/TargetBridgeContext'

import NETWORKS from '@/constants/NETWORKS'
import {
  MAINNET_CHAIN_ID,
  MAINNET_CONTRACT,
  TARGET_CHAIN_ID,
  TARGET_CHAIN_CONTRACT
} from '@/config'

const allChainIds = Object.keys(NETWORKS).map((slug) => {
  return NETWORKS[slug].chainId
})

export default function AppRoot(props) {
  const {
    children,
  } = props

  const chainId = MAINNET_CHAIN_ID
  const chainIds = [MAINNET_CHAIN_ID, TARGET_CHAIN_ID]

  const [ workChainId, setWorkChainId ] = useState(chainId)
  const [ allowedChainIds, setAllowedChainIds ] = useState(chainIds)


  return (
    <>
      <NotificationProvider>
        <Web3Connector chainIds={allowedChainIds} autoConnect={true}>
          <InjectedWeb3Provider chainId={workChainId} chainIds={allowedChainIds}>
            <MainnetBridgeProvider chainId={MAINNET_CHAIN_ID} contractAddress={MAINNET_CONTRACT}>
              <TargetBridgeProvider chainId={TARGET_CHAIN_ID} contractAddress={TARGET_CHAIN_CONTRACT}>
                <ConfirmationModal>
                  {children}
                </ConfirmationModal>
              </TargetBridgeProvider>
            </MainnetBridgeProvider>
          </InjectedWeb3Provider>
        </Web3Connector>
      </NotificationProvider>
    </>
  )
}