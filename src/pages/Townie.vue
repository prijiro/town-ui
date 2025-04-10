<script setup lang="ts">
import bazaarAbi from '@/abis/Bazaar.ts'
import erc20Abi from '@/abis/Erc20.ts'
import townhallAbi from '@/abis/Townhall.ts'
import townieAbi from '@/abis/Townie.ts'
import { TOWNHALL_ADDRESS } from '@/config/contractAddresses'
import { mockProjects } from '@/data/projects'
import { publicClient, walletClient } from '@/utils/wallet'
import {
  formatUnits,
  getContract,
  keccak256,
  parseUnits,
  stringToHex
} from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { USDC } from '../config/ContractAddresses'
const route = useRoute()
const project = ref(mockProjects.find((p) => p.id === route.params.id))

const loading = ref(false)
const error = ref<string | null>(null)

const townhallAddress = TOWNHALL_ADDRESS
console.log('Townhall address:', townhallAbi)
const townhallContract = getContract({
  address: townhallAddress,
  abi: townhallAbi,
  client: {
    public: publicClient,
    wallet: walletClient
  }
})
const account = privateKeyToAccount(import.meta.env.VITE_PK)

const createProjectToken = async () => {
  if (!project.value) return

  loading.value = true
  error.value = null

  try {
    const id = keccak256(stringToHex(project.value.id))

    const hash = await townhallContract.write.createProjectToken(
      [
        id,
        project.value.name,
        project.value.symbol,
        parseUnits('0.000001', 6), // slope
        parseUnits('0.1', 6), // base
        500, // buy tax
        1000, // sell tax
        '0xb76a3c77Bb78f32775a6bc5e261fBFD2ECc5dbCb' // treasury
      ],
      {
        account
      }
    )

    const res = await publicClient.waitForTransactionReceipt({ hash })
    console.log('Transaction receipt:', res)
    const [bazaar, townie] = await townhallContract.read.getProjectInfo([id])

    project.value.status = 'created'
    project.value.townie = townie
    project.value.bazaar = bazaar
  } catch (e: any) {
    console.error(e)
    error.value = e.message
  } finally {
    loading.value = false
  }
}
const amount = ref(10n)

async function buyTokens(amount: bigint) {
  try {
    const usdc = getContract({
      address: USDC,
      abi: erc20Abi,
      client: walletClient
    })
    const approveHash = await usdc.write.approve(
      [project.value.bazaar, parseUnits('1000', 6)],
      {
        account
      }
    )
    console.log('Approve transaction hash:', approveHash)
    const res = await publicClient.waitForTransactionReceipt({
      hash: approveHash
    })
    console.log('Approve transaction receipt:', res)
    console.log('bazaar address', project.value.bazaar)
    const bazaar = getContract({
      address: project.value.bazaar, // replace with dynamic if needed
      abi: bazaarAbi,
      client: walletClient
    })
    console.log('Bazaar amount:', amount)
    const tokens = parseUnits(amount.toString(), 6)
    console.log('Tokens:', tokens)
    const hash = await bazaar.write.buy([tokens], {
      account
    })

    console.log('Transaction hash:', hash)
    const mintReceipt = await publicClient.waitForTransactionReceipt({ hash })
    console.log('Mint transaction receipt:', mintReceipt)
    const townie = getContract({
      address: project.value.townie,
      abi: townieAbi,
      client: walletClient
    })
    const balance = await townie.read.balanceOf([account.address])
    console.log('Minted tokens:', balance)
    console.log('Balance:', formatUnits(balance, 6))
  } catch (err) {
    console.error('Buy failed', err)
  }
}

function handleBuy() {
  buyTokens(amount.value)
}

function handleSell() {
  sellTokens(amount.value)
}

async function sellTokens(value: bigint) {
  const townie = getContract({
    address: project.value.townie,
    abi: townieAbi,
    client: walletClient
  })
  const approveHash = await townie.write.approve(
    [project.value.bazaar, parseUnits('1000', 6)],
    {
      account
    }
  )
  console.log('Approve transaction hash:', approveHash)
  const res = await publicClient.waitForTransactionReceipt({
    hash: approveHash
  })
  console.log('Approve transaction receipt:', res)
  const bazaar = getContract({
    address: project.value.bazaar, // replace with dynamic if needed
    abi: bazaarAbi,
    client: walletClient
  })
  console.log('Bazaar amount:', value)
  const tokens = parseUnits(value.toString(), 6)
  console.log('Tokens:', tokens)
  const hash = await bazaar.write.sell([tokens], {
    account
  })

  console.log('Transaction hash:', hash)
}
</script>

<template>
  <div class="space-y-4">
    <h1 class="text-2xl font-bold">{{ project?.name }}</h1>
    <p class="text-sm text-zinc-400">{{ project?.symbol }}</p>

    <div v-if="project?.status === 'created'" class="text-sm space-y-1">
      <p>✅ Townie: {{ project.townie }}</p>
      <p>✅ Bazaar: {{ project.bazaar }}</p>
    </div>

    <button
      v-else
      class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      :disabled="loading"
      @click="createProjectToken"
    >
      {{ loading ? 'Creating...' : 'Create Meme Token' }}
    </button>
    <input type="number" v-model.number="amount" />
    <button @click="handleBuy">Buy</button>
    <button @click="handleSell">Sell</button>
    <p v-if="error" class="text-red-500">{{ error }}</p>
  </div>
</template>
