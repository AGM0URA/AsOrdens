<script setup>
import { ref, watch } from 'vue'
import { Pencil, FileText } from 'lucide-vue-next'
import BaseModal from './BaseModal.vue'
import StatusBadge from './StatusBadge.vue'
import { useChamados } from '../composables/useChamados'
import { chamadosService } from '../services/chamadosService'
import { prioridadeLabel, formatarData, formatarTamanho } from '../utils/chamados'
import { useRouter } from 'vue-router'

const { detalheId, versao, fecharDetalhe, abrirEdicao } = useChamados()
const chamado = ref(null)

async function carregar() {
  chamado.value = detalheId.value ? await chamadosService.buscar(detalheId.value) : null
}

watch([detalheId, versao], carregar, { immediate: true })

function editar() {
  const atual = chamado.value
  fecharDetalhe()
  abrirEdicao(atual)
  
}

const router = useRouter()
const { atualizarListas } = useChamados()

async function puxar() {
  const id = chamado.value.id
  try {
    await chamadosService.puxar(id)
  } catch (e) {
    alert(e.message)
    return
  }
  atualizarListas()
  fecharDetalhe()
  router.push(`/atendimento/${id}`)
}

function atender() {
  const id = chamado.value.id
  fecharDetalhe()
  router.push(`/atendimento/${id}`)
}
</script>

<template>
  <BaseModal v-if="chamado" :titulo="chamado.id" largura="640px" @fechar="fecharDetalhe">
    <div class="topo">
      <h3>{{ chamado.titulo }}</h3>
      <StatusBadge :status="chamado.status" />
    </div>

    <dl class="grade">
      <div><dt>Solicitante</dt><dd>{{ chamado.solicitante }}</dd></div>
      <div><dt>Agente</dt><dd>{{ chamado.agente ?? '—' }}</dd></div>
      <div><dt>Categoria</dt><dd>{{ chamado.categoria }}</dd></div>
      <div><dt>Prioridade</dt><dd>{{ prioridadeLabel[chamado.prioridade] }}</dd></div>
      <div><dt>Atualizado em</dt><dd>{{ formatarData(chamado.atualizadoEm) }}</dd></div>
    </dl>

    <h4>Descrição</h4>
    <p class="descricao">{{ chamado.descricao || 'Sem descrição.' }}</p>

    <template v-if="chamado.anexos?.length">
      <h4>Anexos</h4>
      <ul class="anexos">
        <li v-for="a in chamado.anexos" :key="a.id">
          <a :href="a.url" :download="a.nome" target="_blank">
            <img v-if="a.tipo.startsWith('image/')" :src="a.url" alt="" />
            <span v-else class="doc"><FileText :size="18" /></span>
            <span class="nome">{{ a.nome }}</span>
            <small>{{ formatarTamanho(a.tamanho) }}</small>
          </a>
        </li>
      </ul>
    </template>

    <template #rodape>
      <button class="btn btn-secundario" @click="fecharDetalhe">Fechar</button>
      <button class="btn btn-secundario" @click="editar"><Pencil :size="15" /> Editar chamado</button>
      <button v-if="!chamado.agente" class="btn btn-primario" @click="puxar">Puxar e atender</button>
      <button v-else class="btn btn-primario" @click="atender">Abrir atendimento</button>
    </template>
  </BaseModal>
</template>

<style scoped>
.topo {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
}

h3 {
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}

h4 {
  margin: 20px 0 8px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.grade {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px 24px;
  padding: 16px;
  border-radius: var(--radius);
  background: var(--color-zebra);
}

dt {
  font-size: 12px;
  color: var(--color-text-muted);
}

dd {
  margin-top: 2px;
  font-size: 14px;
  font-weight: 500;
}

.descricao {
  line-height: 1.6;
  white-space: pre-wrap;
}

.anexos {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.anexos a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  color: var(--color-text);
  text-decoration: none;
}

.anexos a:hover {
  background: var(--color-zebra);
}

.anexos img,
.doc {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  object-fit: cover;
}

.doc {
  display: grid;
  place-items: center;
  background: var(--color-sidebar);
  color: var(--color-text-muted);
}

.nome {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

small {
  color: var(--color-text-muted);
}

.btn {
  height: 40px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 600;
}

.btn-secundario {
  border: 1px solid var(--color-border);
  background: #fff;
  color: var(--color-text);
}

.btn-primario {
  border: none;
  background: var(--color-primary);
  color: #fff;
}

.btn-primario:hover {
  background: var(--color-primary-hover);
}
</style>