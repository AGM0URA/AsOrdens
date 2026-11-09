<script setup>
import { ref, computed, watch } from 'vue'
import { Search, Funnel, ArrowUp, ArrowDown, Minus } from 'lucide-vue-next'
import { statusLabel, prioridadeLabel, formatarData } from '../utils/chamados'
import { useChamados } from '../composables/useChamados'



const { abrirDetalhe } = useChamados()

const props = defineProps({
  chamados: { type: Array, required: true },
})

const POR_PAGINA = 10

const filtroStatus = ref('todos')
const filtroPrioridade = ref('todas')
const busca = ref('')
const ordenarPor = ref('id')
const direcao = ref('desc')
const pagina = ref(1)

const opcoesStatus = [
  { valor: 'todos', rotulo: 'Todos' },
  { valor: 'aberto', rotulo: 'Aberto' },
  { valor: 'em_andamento', rotulo: 'Em andamento' },
  { valor: 'resolvido', rotulo: 'Resolvido' },
  { valor: 'fechado', rotulo: 'Fechado' },
]

const opcoesPrioridade = [
  { valor: 'todas', rotulo: 'Todas' },
  { valor: 'alta', rotulo: 'Alta' },
  { valor: 'media', rotulo: 'Média' },
  { valor: 'baixa', rotulo: 'Baixa' },
]

const colunas = [
  { chave: 'id', rotulo: 'ID' },
  { chave: 'titulo', rotulo: 'Título' },
  { chave: 'solicitante', rotulo: 'Solicitante' },
  { chave: 'categoria', rotulo: 'Categoria' },
  { chave: 'prioridade', rotulo: 'Prioridade' },
  { chave: 'status', rotulo: 'Status' },
  { chave: 'agente', rotulo: 'Agente' },
  { chave: 'atualizadoEm', rotulo: 'Atualizado' },
]

const pesoPrioridade = { alta: 3, media: 2, baixa: 1 }

const filtrados = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  return props.chamados.filter((c) => {
    const okStatus = filtroStatus.value === 'todos' || c.status === filtroStatus.value
    const okPrioridade =
      filtroPrioridade.value === 'todas' || c.prioridade === filtroPrioridade.value
    const okBusca =
      !termo ||
      [c.id, c.titulo, c.solicitante, c.categoria, c.agente ?? ''].some((campo) =>
        campo.toLowerCase().includes(termo),
      )
    return okStatus && okPrioridade && okBusca
  })
})

function valorOrdenacao(chamado, chave) {
  if (chave === 'prioridade') return pesoPrioridade[chamado.prioridade]
  return chamado[chave] ?? ''
}

const ordenados = computed(() => {
  const fator = direcao.value === 'asc' ? 1 : -1
  return [...filtrados.value].sort((a, b) => {
    const va = valorOrdenacao(a, ordenarPor.value)
    const vb = valorOrdenacao(b, ordenarPor.value)
    if (typeof va === 'number') return (va - vb) * fator
    return String(va).localeCompare(String(vb), 'pt-BR', { numeric: true }) * fator
  })
})

const totalPaginas = computed(() => Math.max(1, Math.ceil(ordenados.value.length / POR_PAGINA)))

const paginados = computed(() => {
  const inicio = (pagina.value - 1) * POR_PAGINA
  return ordenados.value.slice(inicio, inicio + POR_PAGINA)
})

function ordenar(chave) {
  if (ordenarPor.value === chave) {
    direcao.value = direcao.value === 'asc' ? 'desc' : 'asc'
  } else {
    ordenarPor.value = chave
    direcao.value = 'asc'
  }
}

// ao mudar qualquer filtro, volta pra primeira página
watch([filtroStatus, filtroPrioridade, busca], () => {
  pagina.value = 1
})
</script>

<template>
  <section>
    <div class="filtros">
      <div class="grupo">
        <button
          v-for="op in opcoesStatus"
          :key="op.valor"
          class="chip"
          :class="{ 'chip-ativo': filtroStatus === op.valor }"
          @click="filtroStatus = op.valor"
        >
          {{ op.rotulo }}
        </button>
      </div>

      <Funnel :size="15" class="icone-filtro" />

      <div class="grupo">
        <button
          v-for="op in opcoesPrioridade"
          :key="op.valor"
          class="chip chip-suave"
          :class="{ 'chip-suave-ativo': filtroPrioridade === op.valor }"
          @click="filtroPrioridade = op.valor"
        >
          {{ op.rotulo }}
        </button>
      </div>

      <label class="busca">
        <Search :size="16" />
        <input v-model="busca" type="text" placeholder="Buscar chamados..." />
      </label>
    </div>

    <div class="tabela-box">
      <div class="rolagem">
        <table>
          <thead>
            <tr>
              <th v-for="col in colunas" :key="col.chave" @click="ordenar(col.chave)">
                {{ col.rotulo }}
                <template v-if="ordenarPor === col.chave">
                  <ArrowDown v-if="direcao === 'desc'" :size="13" />
                  <ArrowUp v-else :size="13" />
                </template>
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
           <tr v-for="c in paginados" :key="c.id" class="linha" @click="abrirDetalhe(c.id)">
              <td class="col-id">{{ c.id }}</td>
              <td class="col-titulo" :title="c.titulo">{{ c.titulo }}</td>
              <td class="col-suave">{{ c.solicitante }}</td>
              <td><span class="categoria">{{ c.categoria }}</span></td>
              <td>
                <span class="prioridade" :class="`prioridade-${c.prioridade}`">
                  <ArrowUp v-if="c.prioridade === 'alta'" :size="14" />
                  <Minus v-else-if="c.prioridade === 'media'" :size="14" />
                  <ArrowDown v-else :size="14" />
                  {{ prioridadeLabel[c.prioridade] }}
                </span>
              </td>
              <td>
                <span class="status" :class="`status-${c.status}`">
                  {{ statusLabel[c.status] }}
                </span>
              </td>
              <td class="col-suave">{{ c.agente ?? '—' }}</td>
              <td class="col-data">{{ formatarData(c.atualizadoEm) }}</td>
              <td class="col-acoes">···</td>
            </tr>
            <tr v-if="paginados.length === 0">
              <td :colspan="colunas.length + 1" class="vazio">Nenhum chamado encontrado.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <footer class="rodape">
        <span>{{ paginados.length }} de {{ filtrados.length }} chamados</span>
        <div class="paginacao">
          <button :disabled="pagina === 1" @click="pagina--">Anterior</button>
          <button
            v-for="n in totalPaginas"
            :key="n"
            :class="{ 'pag-ativa': n === pagina }"
            @click="pagina = n"
          >
            {{ n }}
          </button>
          <button :disabled="pagina === totalPaginas" @click="pagina++">Próximo</button>
        </div>
      </footer>
    </div>
  </section>
</template>

<style scoped>

.linha {
  cursor: pointer;
}

.linha:hover {
  background: var(--color-primary-soft) !important;
}

.filtros {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 16px;
}

.grupo {
  display: flex;
  gap: 8px;
}

.icone-filtro {
  color: var(--color-text-muted);
}

.chip {
  height: 34px;
  padding: 0 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fff;
  font-size: 14px;
  color: var(--color-text);
}

.chip:hover {
  background: var(--color-zebra);
}

.chip-ativo,
.chip-ativo:hover {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.chip-suave {
  color: var(--color-text-muted);
}

.chip-suave-ativo,
.chip-suave-ativo:hover {
  background: var(--color-primary-soft);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.busca {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  width: 280px;
  padding: 0 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fff;
  color: var(--color-text-muted);
}

.busca input {
  flex: 1;
  border: none;
  outline: none;
  font-family: inherit;
  font-size: 14px;
  color: var(--color-text);
  background: transparent;
}

.busca:focus-within {
  border-color: var(--color-primary);
}

.tabela-box {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fff;
  overflow: hidden;
}

.rolagem {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th {
  padding: 14px 16px;
  background: var(--color-sidebar);
  text-align: left;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  white-space: nowrap;
  cursor: pointer;
  user-select: none;
}

td {
  padding: 14px 16px;
  font-size: 14px;
  white-space: nowrap;
}

tbody tr:nth-child(even) {
  background: var(--color-zebra);
}

.col-id {
  color: var(--color-open);
  font-weight: 500;
}

.col-titulo {
  max-width: 340px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.col-suave {
  color: #4b5563;
}

.col-data {
  color: var(--color-text-muted);
}

.col-acoes {
  color: var(--color-text-muted);
  text-align: right;
}

.categoria {
  padding: 3px 8px;
  border-radius: 4px;
  background: #e8ecf2;
  font-size: 13px;
}

.prioridade {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 500;
}

.prioridade-alta {
  color: var(--color-danger);
}

.prioridade-media {
  color: #ca8a04;
}

.prioridade-baixa {
  color: var(--color-text-muted);
}

.status {
  padding: 3px 10px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}

.status-aberto {
  background: #eff6ff;
  border-color: #bfdbfe;
  color: #1d4ed8;
}

.status-em_andamento {
  background: #fefce8;
  border-color: #fde68a;
  color: #a16207;
}

.status-resolvido {
  background: #f0fdf4;
  border-color: #bbf7d0;
  color: #15803d;
}

.status-fechado {
  background: #f1f5f9;
  border-color: #e2e8f0;
  color: #475569;
}

.vazio {
  padding: 40px;
  text-align: center;
  color: var(--color-text-muted);
}

.rodape {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid var(--color-border);
  background: var(--color-zebra);
  font-size: 14px;
  color: var(--color-text-muted);
}

.paginacao {
  display: flex;
  gap: 4px;
}

.paginacao button {
  height: 30px;
  min-width: 30px;
  padding: 0 10px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: #fff;
  font-size: 13px;
  color: var(--color-text-muted);
}

.paginacao button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.paginacao .pag-ativa {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}
</style>