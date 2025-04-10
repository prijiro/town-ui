// src/lib/wallet.ts
import { createPublicClient, createWalletClient, http } from 'viem'
import { baseSepolia } from 'viem/chains'

export const walletClient = createWalletClient({
  chain: baseSepolia,
  transport: http(import.meta.env.VITE_RPC_URL_BASE_SEPOLIA)
})
export const publicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(import.meta.env.VITE_RPC_URL_BASE_SEPOLIA)
})

