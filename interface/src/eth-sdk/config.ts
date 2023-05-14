import { defineConfig } from '@dethcrypto/eth-sdk'

export default defineConfig({
  rpc: {
    polygonMumbai: 'https://polygon-testnet.public.blastapi.io'
  },
  contracts: {
    // polygon: {
    //   Transparenza: '0xD81dE4BCEf43840a2883e5730d014630eA6b7c4A',
    // },
    polygonMumbai: {
      Transparenza: '0x85e8daec6ac680965404bd947c7d2967887fdf23'
    }
  }
})
