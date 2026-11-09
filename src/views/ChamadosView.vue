<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ChamadosTabela from '../components/ChamadosTabela.vue'
import { chamadosService } from '../services/chamadosService'
import { useChamados } from '../composables/useChamados'

const route = useRoute()
const { versao } = useChamados()
const chamados = ref([])
const carregando = ref(true)

async function carregar() {
  chamados.value = await chamadosService.listar(route.meta.filtro)
  carregando.value = false
}

// trocou de rota: mostra "carregando" e busca de novo
watch(
  () => route.path,
  () => {
    carregando.value = true
    carregar()
  },
  { immediate: true },
)

// criou ou editou algo: recarrega sem perder filtros e busca da tabela
watch(versao, carregar)
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