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
      Transparenza: '0x10367f3047481c85009fac685bcf8802e055c9c0'
    }
  }
})
