<script setup>
import AppSidebar from '../components/AppSidebar.vue'
import AppTopbar from '../components/AppTopbar.vue'
import ChamadoFormModal from '../components/ChamadoFormModal.vue'
import ChamadoDetalheModal from '../components/ChamadoDetalheModal.vue'
import { useChamados } from '../composables/useChamados'

const { formAberto, detalheId, abrirNovo } = useChamados()
</script>

<template>
  <div class="app">
    <AppSidebar @novo-chamado="abrirNovo" />
    <div class="conteudo">
      <AppTopbar />
      <main class="pagina">
        <RouterView />
      </main>
    </div>

    <ChamadoFormModal v-if="formAberto" />
    <ChamadoDetalheModal v-if="detalheId" />
  </div>
</template>

<style scoped>
.app {
  display: flex;
  min-height: 100vh;
}

.conteudo {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.pagina {
  flex: 1;
  padding: 24px;
}
</style>