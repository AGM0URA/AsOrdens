<script setup>
import AppSidebar from '../components/AppSidebar.vue'
import AppTopbar from '../components/AppTopbar.vue'

function abrirNovoChamado() {
  // TODO: abrir o modal de Novo chamado (próximos passos)
  console.log('abrir modal de novo chamado')
}
</script>

<template>
  <div class="app">
    <AppSidebar @novo-chamado="abrirNovoChamado" />
    <div class="conteudo">
      <AppTopbar />
      <main class="pagina">
        <RouterView />
      </main>
    </div>
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