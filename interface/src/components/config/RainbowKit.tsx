import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import {
  argentWallet,
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  trustWallet,
  walletConnectWallet
} from '@rainbow-me/rainbowkit/wallets'
import { INFURA_API_KEY, CHAIN_ID, IS_CLIENT } from 'config'
import type { ReactNode } from 'react'
import LocalStorage from 'services/localStorage'
import { Chain } from 'types/types'
import { configureChains, createClient, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai } from 'wagmi/chains'
import { infuraProvider } from 'wagmi/providers/infura'

const needsInjectedWallet =
  IS_CLIENT && window.ethereum && !window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet

const { chains, provider, webSocketProvider } = configureChains(
  [CHAIN_ID === Chain.Polygon ? polygon : polygonMumbai],
  [
    infuraProvider({
      apiKey: INFURA_API_KEY
    })
  ]
)

const connectors = connectorsForWallets([
  {
    groupName: 'Suggested',
    wallets: [
      metaMaskWallet({ chains }),
      braveWallet({ chains, shimDisconnect: true }),
      coinbaseWallet({ appName: 'Transparenza', chains }),
      walletConnectWallet({ chains }),
      rainbowWallet({ chains }),
      ...(needsInjectedWallet ? [injectedWallet({ chains })] : [])
    ]
  },
  {
    groupName: 'Other',
    wallets: [
      ledgerWallet({ chains }),
      trustWallet({ chains, shimDisconnect: true }),
      argentWallet({ chains })
    ]
  }
])

const wagmiClient = createClient({
  autoConnect: IS_CLIENT && LocalStorage.get('shouldAutoConnect'),
  connectors,
  provider,
  webSocketProvider: IS_CLIENT ? webSocketProvider : undefined
})

export default function RainbowKit({ children }: { children: ReactNode }) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  )
}
