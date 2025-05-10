import { useEffect, useState } from "react"
import { getWagmiConfig } from '@/web3/wagmiConfig'
import { WagmiConfig } from 'wagmi'
import {
  RainbowKitProvider,
  darkTheme,
  lightTheme,
  midnightTheme,
} from '@rainbow-me/rainbowkit'

import '@rainbow-me/rainbowkit/styles.css'

export default function Web3Connector(props) {
  const {
    children,
    chainIds,
    autoConnect
  } = props
  
  const { chains, wagmiConfig } = getWagmiConfig(chainIds, autoConnect)

  return (
    <>
      <WagmiConfig config={wagmiConfig}>
        <RainbowKitProvider disableENS={true} chains={chains} theme={true ? darkTheme() : lightTheme()}>
          {children}
        </RainbowKitProvider>
      </WagmiConfig>
    </>
  )
}