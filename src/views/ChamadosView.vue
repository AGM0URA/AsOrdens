<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ChamadosTabela from '../components/ChamadosTabela.vue'
import { chamadosService } from '../services/chamadosService'

const route = useRoute()
const chamados = ref([])
const carregando = ref(true)

watch(
  () => route.path,
  async () => {
    carregando.value = true
    chamados.value = await chamadosService.listar(route.meta.filtro)
    carregando.value = false
  },
  { immediate: true },
)
</script>

<template>
  <p v-if="carregando" class="carregando">Carregando chamados...</p>
  <ChamadosTabela v-else :key="route.path" :chamados="chamados" />
</template>

<style scoped>
.carregando {
  color: var(--color-text-muted);
}
</style>