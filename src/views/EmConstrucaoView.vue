<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <p class="aviso">Tela "{{ route.meta.title }}" em construção.</p>
</template>

<style scoped>
.aviso {
  color: var(--color-text-muted);
}
</style>