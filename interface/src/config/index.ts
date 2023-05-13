export const ENVIRONMENT: string = process.env.NODE_ENV
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || '1')
export const IS_CLIENT: boolean = typeof window !== 'undefined'
export const INFURA_API_KEY: string = process.env.NEXT_PUBLIC_INFURA_API_KEY || ''
export const INFURA_API_URL: string = process.env.NEXT_PUBLIC_INFURA_API_URL || ''
export const STORAGE_API_KEY = process.env.NEXT_PUBLIC_STORAGE_API_KEY || ''
export const AIRSTACK_API_KEY = process.env.NEXT_PUBLIC_AIRSTACK_API_KEY || ''
