<script setup>
import { ref, watch } from 'vue'
import { ClipboardList, CircleCheck, Clock, ArrowUp, Download } from 'lucide-vue-next'
import KpiCard from '../components/KpiCard.vue'
import GraficoSemana from '../components/GraficoSemana.vue'
import GraficoCategorias from '../components/GraficoCategorias.vue'
import { relatoriosService } from '../services/relatoriosService'
import { useChamados } from '../composables/useChamados'
import { baixarCsv } from '../utils/csv'
import { statusLabel, prioridadeLabel, formatarData } from '../utils/chamados'

const { versao } = useChamados()

const periodos = [
  { dias: 7, rotulo: 'Últimos 7 dias' },
  { dias: 30, rotulo: 'Últimos 30 dias' },
  { dias: 90, rotulo: 'Últimos 90 dias' },
]

const dias = ref(7)
const relatorio = ref(null)

async function carregar() {
  relatorio.value = await relatoriosService.gerar(dias.value)
}
watch([dias, versao], carregar, { immediate: true })

function exportar() {
  const linhas = [
    ['ID', 'Título', 'Solicitante', 'Categoria', 'Prioridade', 'Status', 'Agente', 'Atualizado em'],
    ...relatorio.value.chamados.map((c) => [
      c.id,
      c.titulo,
      c.solicitante,
      c.categoria,
      prioridadeLabel[c.prioridade],
      statusLabel[c.status],
      c.agente ?? '',
      formatarData(c.atualizadoEm),
    ]),
  ]
  baixarCsv(`relatorio-${dias.value}-dias.csv`, linhas)
}

const percentual = (a) => (a.total ? (a.concluidos / a.total) * 100 : 0)
</script>

<template>
  <p v-if="!relatorio" class="carregando">Gerando relatório...</p>

  <div v-else class="relatorios">
    <div class="barra">
      <div class="chips">
        <button
          v-for="p in periodos"
          :key="p.dias"
          class="chip"
          :class="{ 'chip-ativo': dias === p.dias }"
          @click="dias = p.dias"
        >
          {{ p.rotulo }}
        </button>
      </div>
      <button class="btn-exportar" @click="exportar">
        <Download :size="15" /> Exportar CSV
      </button>
    </div>

    <div class="kpis">
      <KpiCard :valor="relatorio.total" rotulo="Total de chamados" :icone="ClipboardList" tom="azul" />
      <KpiCard :valor="relatorio.taxaResolucao" rotulo="Taxa de resolução (%)" :icone="CircleCheck" tom="verde" />
      <KpiCard :valor="relatorio.tempoMedioHoras" rotulo="Tempo médio (horas)" :icone="Clock" tom="amarelo" />
      <KpiCard :valor="relatorio.altaPrioridade" rotulo="Alta prioridade" :icone="ArrowUp" tom="vermelho" />
    </div>

    <div class="graficos">
      <section class="card">
        <h2>Chamados no período</h2>
        <GraficoSemana :dados="relatorio.serie" />
      </section>

      <section class="card">
        <h2>Por categoria</h2>
        <GraficoCategorias :dados="relatorio.porCategoria" />
      </section>
    </div>

    <section class="card">
      <h2>Desempenho por agente</h2>
      <ul class="ranking">
        <li v-for="(a, i) in relatorio.ranking" :key="a.agente">
          <span class="posicao">{{ i + 1 }}º</span>
          <span class="nome">{{ a.agente }}</span>
          <div class="trilho">
            <div class="preenchido" :style="{ width: `${percentual(a)}%` }"></div>
          </div>
          <span class="numeros">{{ a.concluidos }} de {{ a.total }} concluídos</span>
        </li>
        <li v-if="!relatorio.ranking.length" class="vazio">Nenhum chamado atribuído no período.</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.carregando { color: var(--color-text-muted); }

.relatorios { display: flex; flex-direction: column; gap: 16px; }

.barra { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
.chips { display: flex; gap: 8px; }

.chip {
  height: 34px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fff;
  font-size: 14px;
  color: var(--color-text);
}
.chip:hover { background: var(--color-zebra); }
.chip-ativo, .chip-ativo:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.btn-exportar {
  height: 36px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fff;
  font-size: 14px;
  font-weight: 500;
}
.btn-exportar:hover { background: var(--color-zebra); }

.kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
.graficos { display: grid; grid-template-columns: 2fr 1fr; gap: 16px; }

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

.ranking { list-style: none; display: flex; flex-direction: column; gap: 14px; }

.ranking li { display: flex; align-items: center; gap: 12px; font-size: 14px; }
.posicao { width: 28px; font-weight: 600; color: var(--color-accent); }
.nome { width: 160px; font-weight: 500; }

.trilho {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: var(--color-sidebar);
  overflow: hidden;
}
.preenchido { height: 100%; border-radius: 4px; background: var(--color-resolved); }

.numeros { width: 150px; text-align: right; color: var(--color-text-muted); font-size: 13px; }
.vazio { color: var(--color-text-muted); }

@media (max-width: 1100px) {
  .kpis { grid-template-columns: repeat(2, 1fr); }
  .graficos { grid-template-columns: 1fr; }
}
</style>