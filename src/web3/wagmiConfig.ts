// @ts-ignore
import getConfig from 'next/config'
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  injectedWallet,
  metaMaskWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { createConfig } from 'wagmi';
import { WalletConnectConnector } from "@wagmi/connectors/walletConnect"
import { getChainsConfig } from './chains';
import { MAINNET_CHAIN_ID } from '@/config'

export const getWagmiConfig = (chainIds, autoConnect) => {
  const { chains, publicClient } = getChainsConfig(chainIds)
  const { publicRuntimeConfig } = getConfig()
  const { NEXT_PUBLIC_PROJECT_ID } = publicRuntimeConfig
  
  const connectors = connectorsForWallets([
    {
      groupName: 'Popular',
      wallets: [
        injectedWallet({ chains }),
        metaMaskWallet({
          projectId: NEXT_PUBLIC_PROJECT_ID || "a23677c4af3139b4eccb52981f76ad94",
          chains,
          shimDisconnect: true,
        })
      ],
    }
  ]);

  return {
    chains,
    wagmiConfig: createConfig({
      publicClient,
      connectors: [
        ...connectors(),
        new WalletConnectConnector({
          options: {
            projectId: NEXT_PUBLIC_PROJECT_ID || "a23677c4af3139b4eccb52981f76ad94",
            chains,
          }
        }),
      ],
      // turn off autoConnect in development
      autoConnect,
      contracts: {
        ensUniversalResolver: null, // Явно отключаем контракт
      },
    })
  }
}
