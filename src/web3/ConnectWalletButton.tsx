import React, { useEffect, useState } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount, useDisconnect, useConnect } from 'wagmi'

export const ConnectWalletButton: React.FC = (props) => {
  const { isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const { connectors, connect } = useConnect();
  
  const {
    connectView,
    connectedView,
    wrongChainView,
  } = {
    connectView: (isConnecting, openConnectModal) => {
      return (
        <button disabled={isConnecting} onClick={openConnectModal}>
          Connect
        </button>
      )
    },
    connectedView: (address, ensName) => {
      return (
        <button>
          {ensName ? ensName : address}
        </button>
      )
    },
    wrongChainView: (openChainModal) => {
      return (
        <button onClick={openChainModal}>
          Unsupported network
        </button>
      )
    },
    ...props
  }
  
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => (
        <div
          {...(!mounted && {
            'aria-hidden': true,
            style: {
              opacity: 0,
              pointerEvents: 'none',
              userSelect: 'none',
            },
          })}
        >
          {(() => {
            if (!mounted || !account || !chain) {
              return connectView(isConnecting, openConnectModal)
            }

            if (chain.unsupported) {
              return wrongChainView(openChainModal)
            }

            return connectedView(account.address, account.ensName)
          })()}
        </div>
      )}
    </ConnectButton.Custom>
  );
};

export default ConnectWalletButton;
