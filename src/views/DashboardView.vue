<script setup>
import { ref, onMounted,watch } from 'vue'
import { CircleAlert, Clock, CircleCheck, ArrowUp } from 'lucide-vue-next'
import KpiCard from '../components/KpiCard.vue'
import GraficoSemana from '../components/GraficoSemana.vue'
import GraficoCategorias from '../components/GraficoCategorias.vue'
import ChamadosTabela from '../components/ChamadosTabela.vue'
import { dashboardService } from '../services/dashboardService' 
import { useChamados } from '../composables/useChamados'

const resumo = ref(null)

onMounted(async () => {
  resumo.value = await dashboardService.resumo()
})

const { versao } = useChamados()
watch(versao, async () => {
  resumo.value = await dashboardService.resumo()
})

</script>

<template>
  <p v-if="!resumo" class="carregando">Carregando dashboard...</p>

  <div v-else class="dashboard">
    <div class="kpis">
      <KpiCard :valor="resumo.kpis.abertos" rotulo="Chamados abertos" :icone="CircleAlert" tom="azul" />
      <KpiCard :valor="resumo.kpis.emAndamento" rotulo="Em andamento" :icone="Clock" tom="amarelo" />
      <KpiCard :valor="resumo.kpis.resolvidos" rotulo="Resolvidos" :icone="CircleCheck" tom="verde" />
      <KpiCard :valor="resumo.kpis.altaPrioridade" rotulo="Alta prioridade" :icone="ArrowUp" tom="vermelho" />
    </div>

    <div class="graficos">
      <section class="card">
        <h2>Chamados por dia — semana atual</h2>
        <GraficoSemana :dados="resumo.porDia" />
      </section>

      <section class="card">
        <h2>Por categoria</h2>
        <GraficoCategorias :dados="resumo.porCategoria" />
      </section>
    </div>

    <section class="card">
      <h2>Chamados recentes</h2>
      <ChamadosTabela :chamados="resumo.recentes" />
    </section>
  </div>
</template>

<style scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.kpis {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.graficos {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

.card {
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fff;
}

h2 {
  margin-bottom: 16px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.carregando {
  color: var(--color-text-muted);
}

@media (max-width: 1100px) {
  .kpis { grid-template-columns: repeat(2, 1fr); }
  .graficos { grid-template-columns: 1fr; }
}
</style>