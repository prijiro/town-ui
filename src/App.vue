<script setup lang="ts">
import { ref } from 'vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { mockProjects } from '@/data/projects'
import { useAccount, useConnect } from 'wagmi'
import { metaMask } from '@wagmi/connectors'

const address = ref<string | null>(null)

const connectWallet = async () => {
  const accounts = await walletClient.requestAddresses()
  address.value = accounts[0]
}
const projects = ref(mockProjects)
</script>

<template>
  <div class="min-h-screen bg-zinc-900 text-white p-6">
    <router-view />
    <!-- <div>
      <button
        @click="connectWallet"
        class="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Connect Wallet
      </button>
      <p v-if="address">Connected: {{ address }}</p>
    </div> -->
  </div>
</template>
