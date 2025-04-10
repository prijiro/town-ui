<script setup lang="ts">
import { ref } from 'vue'
import ProjectCard from '@/components/ProjectCard.vue'
import { mockProjects } from '@/data/projects'

const projects = ref(mockProjects)
</script>

<template>
  <div class="min-h-screen bg-zinc-900 text-white p-6">
    <h1 class="text-3xl font-bold mb-4">🧱 Town Projects</h1>
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <RouterLink
        v-for="project in projects"
        :key="project.id"
        :to="`/project/${project.id}`"
        class="block"
      >
        <ProjectCard :project="project" />
      </RouterLink>
    </div>
  </div>
</template>
