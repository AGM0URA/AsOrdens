<script setup>
import { ref, computed, watch } from 'vue'
import { Users, UserCheck, Inbox, Mail } from 'lucide-vue-next'
import KpiCard from '../components/KpiCard.vue'
import { equipesService } from '../services/equipesService'
import { chamados } from '../mocks/chamados'
import { useChamados } from '../composables/useChamados'

const { versao } = useChamados()
const agentes = ref([])
const carregando = ref(true)
const filtroEquipe = ref('todas')

const CAPACIDADE = 5 // chamados simultâneos considerados "carga cheia"

async function carregar() {
  agentes.value = await equipesService.listar()
  carregando.value = false
}
watch(versao, carregar, { immediate: true })

const equipes = computed(() => ['todas', ...new Set(agentes.value.map((a) => a.equipe))])

const visiveis = computed(() =>
  filtroEquipe.value === 'todas'
    ? agentes.value
    : agentes.value.filter((a) => a.equipe === filtroEquipe.value),
)

const online = computed(() => agentes.value.filter((a) => a.disponibilidade === 'online').length)
const semAgente = computed(() => chamados.filter((c) => !c.agente).length)

const rotuloDisponibilidade = { online: 'Disponível', ocupado: 'Ocupado', ausente: 'Ausente' }

const iniciais = (nome) =>
  nome.split(' ').map((p) => p[0]).slice(0, 2).join('')

const percentualCarga = (a) => Math.min(100, (a.naFila / CAPACIDADE) * 100)
const cargaAlta = (a) => a.naFila >= CAPACIDADE
</script>

<template>
  <p v-if="carregando" class="carregando">Carregando equipes...</p>

  <div v-else class="equipes">
    <div class="kpis">
      <KpiCard :valor="agentes.length" rotulo="Agentes" :icone="Users" tom="azul" />
      <KpiCard :valor="online" rotulo="Disponíveis agora" :icone="UserCheck" tom="verde" />
      <KpiCard :valor="semAgente" rotulo="Sem atendente" :icone="Inbox" tom="amarelo" />
    </div>

    <div class="filtros">
      <button
        v-for="e in equipes"
        :key="e"
        class="chip"
        :class="{ 'chip-ativo': filtroEquipe === e }"
        @click="filtroEquipe = e"
      >
        {{ e === 'todas' ? 'Todas as equipes' : e }}
      </button>
    </div>

    <div class="grade">
      <article v-for="a in visiveis" :key="a.id" class="card">
        <header>
          <span class="avatar">{{ iniciais(a.nome) }}</span>
          <div class="quem">
            <strong>{{ a.nome }}</strong>
            <small>{{ a.cargo }}</small>
          </div>
          <span class="disp" :class="`disp-${a.disponibilidade}`">
            <i></i> {{ rotuloDisponibilidade[a.disponibilidade] }}
          </span>
        </header>

        <p class="email"><Mail :size="14" /> {{ a.email }}</p>
        <p class="equipe">Equipe: <strong>{{ a.equipe }}</strong></p>

        <div class="numeros">
          <div><strong>{{ a.abertos }}</strong><span>Abertos</span></div>
          <div><strong>{{ a.emAndamento }}</strong><span>Em andamento</span></div>
          <div><strong>{{ a.resolvidos }}</strong><span>Resolvidos</span></div>
        </div>

        <div class="carga">
          <div class="carga-topo">
            <span>Carga de trabalho</span>
            <span>{{ a.naFila }}/{{ CAPACIDADE }}</span>
          </div>
          <div class="trilho">
            <div
              class="preenchido"
              :class="{ cheio: cargaAlta(a) }"
              :style="{ width: `${percentualCarga(a)}%` }"
            ></div>
          </div>
        </div>
      </article>

      <p v-if="!visiveis.length" class="vazio">Nenhum agente nessa equipe.</p>
    </div>
  </div>
</template>

<style scoped>
.carregando { color: var(--color-text-muted); }

.equipes { display: flex; flex-direction: column; gap: 16px; }

.kpis {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.filtros { display: flex; gap: 8px; flex-wrap: wrap; }

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

.grade {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.card {
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fff;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

header { display: flex; align-items: center; gap: 12px; }

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--color-primary);
  color: var(--color-accent);
  font-weight: 700;
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.quem { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.quem strong { font-size: 15px; }
small { font-size: 12px; color: var(--color-text-muted); }

.disp {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-muted);
}
.disp i { width: 8px; height: 8px; border-radius: 50%; background: #9ca3af; }
.disp-online i { background: var(--color-resolved); }
.disp-ocupado i { background: var(--color-progress); }

.email, .equipe {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--color-text-muted);
}
.equipe strong { color: var(--color-text); font-weight: 500; }

.numeros {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  padding: 12px 0;
  border-top: 1px solid var(--color-border);
  border-bottom: 1px solid var(--color-border);
  text-align: center;
}
.numeros strong { display: block; font-size: 22px; }
.numeros span { font-size: 12px; color: var(--color-text-muted); }

.carga-topo {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.trilho {
  height: 8px;
  border-radius: 4px;
  background: var(--color-sidebar);
  overflow: hidden;
}
.preenchido { height: 100%; background: var(--color-primary); border-radius: 4px; }
.preenchido.cheio { background: var(--color-danger); }

.vazio { color: var(--color-text-muted); }

@media (max-width: 800px) {
  .kpis { grid-template-columns: 1fr; }
}
</style>