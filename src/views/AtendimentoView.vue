<script setup>
import { ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Pencil, Send, FileText } from 'lucide-vue-next'
import StatusBadge from '../components/StatusBadge.vue'
import AnexosInput from '../components/AnexosInput.vue'
import { useChamados } from '../composables/useChamados'
import { chamadosService } from '../services/chamadosService'
import { statusLabel, prioridadeLabel, formatarData, formatarTamanho } from '../utils/chamados'

const route = useRoute()
const router = useRouter()
const { versao, abrirEdicao, atualizarListas } = useChamados()

const chamado = ref(null)
const texto = ref('')
const anexos = ref([])
const enviando = ref(false)
const listaMensagens = ref(null)

async function carregar() {
  chamado.value = await chamadosService.buscar(route.params.id)
}
watch(() => route.params.id, carregar, { immediate: true })
watch(versao, carregar)

function rolarParaFim() {
  nextTick(() => {
    if (listaMensagens.value) listaMensagens.value.scrollTop = listaMensagens.value.scrollHeight
  })
}

async function enviar() {
  if (enviando.value || (!texto.value.trim() && !anexos.value.length)) return
  enviando.value = true
  await chamadosService.enviarMensagem(chamado.value.id, {
    texto: texto.value.trim(),
    anexos: anexos.value,
  })
  texto.value = ''
  anexos.value = []
  enviando.value = false
  atualizarListas()
  rolarParaFim()
}

async function mudarStatus(evento) {
  await chamadosService.alterarStatus(chamado.value.id, evento.target.value)
  atualizarListas()
}

const ehImagem = (a) => a.tipo.startsWith('image/')
</script>

<template>
  <p v-if="!chamado" class="carregando">Carregando atendimento...</p>

  <div v-else class="atendimento">
    <div class="barra">
      <button class="btn btn-secundario" @click="router.push('/minha-fila')">
        <ArrowLeft :size="15" /> Minha fila
      </button>
      <button class="btn btn-secundario" @click="abrirEdicao(chamado)">
        <Pencil :size="15" /> Editar chamado
      </button>
    </div>

    <div class="colunas">
      <section class="conversa">
        <header class="conversa-topo">
          <span class="id">{{ chamado.id }}</span>
          <h2>{{ chamado.titulo }}</h2>
        </header>

        <div ref="listaMensagens" class="mensagens">
          <!-- pedido original do solicitante -->
          <article class="msg msg-solicitante">
            <p class="autor">{{ chamado.solicitante }} · solicitante</p>
            <div class="balao">
              <p>{{ chamado.descricao || 'Sem descrição.' }}</p>
              <ul v-if="chamado.anexos?.length" class="anexos">
                <li v-for="a in chamado.anexos" :key="a.id">
                  <a :href="a.url" target="_blank"><FileText :size="14" /> {{ a.nome }}</a>
                </li>
              </ul>
            </div>
            <small>{{ formatarData(chamado.atualizadoEm) }}</small>
          </article>

          <article
            v-for="m in chamado.mensagens ?? []"
            :key="m.id"
            class="msg"
            :class="m.autor === 'agente' ? 'msg-agente' : 'msg-solicitante'"
          >
            <p class="autor">{{ m.nome }} · {{ m.autor === 'agente' ? 'agente' : 'solicitante' }}</p>
            <div class="balao">
              <p v-if="m.texto">{{ m.texto }}</p>
              <ul v-if="m.anexos?.length" class="anexos">
                <li v-for="a in m.anexos" :key="a.id">
                  <a :href="a.url" target="_blank">
                    <img v-if="ehImagem(a)" :src="a.url" alt="" />
                    <template v-else><FileText :size="14" /> {{ a.nome }}</template>
                    <small>{{ formatarTamanho(a.tamanho) }}</small>
                  </a>
                </li>
              </ul>
            </div>
            <small>{{ formatarData(m.enviadoEm) }}</small>
          </article>
        </div>

        <form class="resposta" @submit.prevent="enviar">
          <textarea
            v-model="texto"
            rows="3"
            placeholder="Responder ao solicitante... (Ctrl + Enter para enviar)"
            @keydown.ctrl.enter.prevent="enviar"
          ></textarea>
          <AnexosInput v-model="anexos" />
          <button type="submit" class="btn btn-primario" :disabled="enviando || (!texto.trim() && !anexos.length)">
            <Send :size="15" /> {{ enviando ? 'Enviando...' : 'Enviar resposta' }}
          </button>
        </form>
      </section>

      <aside class="info">
        <h3>Detalhes</h3>
        <dl>
          <div>
            <dt>Status</dt>
            <dd>
              <StatusBadge :status="chamado.status" />
              <select :value="chamado.status" @change="mudarStatus">
                <option v-for="(rotulo, valor) in statusLabel" :key="valor" :value="valor">
                  {{ rotulo }}
                </option>
              </select>
            </dd>
          </div>
          <div><dt>Atendente</dt><dd>{{ chamado.agente ?? '—' }}</dd></div>
          <div><dt>Solicitante</dt><dd>{{ chamado.solicitante }}</dd></div>
          <div><dt>Categoria</dt><dd>{{ chamado.categoria }}</dd></div>
          <div><dt>Prioridade</dt><dd>{{ prioridadeLabel[chamado.prioridade] }}</dd></div>
          <div><dt>Atualizado</dt><dd>{{ formatarData(chamado.atualizadoEm) }}</dd></div>
        </dl>
      </aside>
    </div>
  </div>
</template>

<style scoped>
.carregando { color: var(--color-text-muted); }

.barra {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}

.colunas {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 16px;
  align-items: start;
}

.conversa,
.info {
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fff;
}

.conversa-topo {
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
}

.id {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-open);
}

h2 { font-size: 18px; font-weight: 600; margin-top: 2px; }

.mensagens {
  height: 420px;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: var(--color-zebra);
}

.msg { max-width: 75%; display: flex; flex-direction: column; gap: 4px; }
.msg-agente { align-self: flex-end; align-items: flex-end; }
.msg-solicitante { align-self: flex-start; }

.autor, small { font-size: 12px; color: var(--color-text-muted); }

.balao {
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
}

.msg-solicitante .balao { background: #fff; border: 1px solid var(--color-border); }
.msg-agente .balao { background: var(--color-primary); color: #fff; }

.anexos { list-style: none; margin-top: 8px; display: flex; flex-direction: column; gap: 6px; }
.anexos a { display: inline-flex; align-items: center; gap: 6px; color: inherit; font-size: 13px; }
.anexos img { max-width: 200px; border-radius: 6px; }

.resposta {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
}

textarea, select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  font-family: inherit;
  font-size: 14px;
}

textarea { resize: vertical; }
textarea:focus, select:focus { outline: none; border-color: var(--color-primary); }

.info { padding: 20px; }
.info h3 {
  margin-bottom: 16px;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
dl { display: flex; flex-direction: column; gap: 14px; }
dt { font-size: 12px; color: var(--color-text-muted); }
dd { margin-top: 4px; font-size: 14px; font-weight: 500; display: flex; flex-direction: column; gap: 8px; align-items: flex-start; }

.btn {
  height: 40px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: var(--radius);
  font-size: 14px;
  font-weight: 600;
}
.btn-secundario { border: 1px solid var(--color-border); background: #fff; color: var(--color-text); }
.btn-primario { align-self: flex-end; border: none; background: var(--color-primary); color: #fff; }
.btn-primario:hover:not(:disabled) { background: var(--color-primary-hover); }
.btn-primario:disabled { opacity: 0.45; cursor: not-allowed; }

@media (max-width: 1000px) {
  .colunas { grid-template-columns: 1fr; }
}
</style>