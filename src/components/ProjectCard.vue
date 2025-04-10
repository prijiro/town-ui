<script setup lang="ts">
import type { Project } from '@/types/project'

defineProps<{
  project: Project
}>()
</script>

<template>
  <div class="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
    <h2 class="text-xl font-semibold mb-1">{{ project.name }}</h2>
    <p class="text-sm text-zinc-400 mb-2">{{ project.symbol }}</p>

    <div v-if="project.status === 'created'" class="text-sm space-y-1">
      <p><span class="text-zinc-400">Townie:</span> {{ project.townie }}</p>
      <p><span class="text-zinc-400">Bazaar:</span> {{ project.bazaar }}</p>
    </div>

    <div v-else class="text-zinc-500 italic">Not created yet.</div>
  </div>
</template>
