<script setup>
import { ref, computed } from 'vue'
import { Trash2, Plus } from 'lucide-vue-next'
import { usuarioAtual } from '../mocks/usuario'
import { preferencias } from '../mocks/configuracoes'
import { chamados } from '../mocks/chamados'
import { categorias } from '../utils/chamados'
import { configuracoesService } from '../services/configuracoesService'

const abas = [
  { id: 'perfil', rotulo: 'Perfil' },
  { id: 'preferencias', rotulo: 'Preferências' },
  { id: 'categorias', rotulo: 'Categorias' },
]
const aba = ref('perfil')

const mensagem = ref('')
const erro = ref('')
let timer
function avisar(texto) {
  mensagem.value = texto
  erro.value = ''
  clearTimeout(timer)
  timer = setTimeout(() => (mensagem.value = ''), 2500)
}

// Trocar de aba limpa os avisos
function trocarAba(id) {
  aba.value = id
  mensagem.value = ''
  erro.value = ''
}

// ---- Perfil (copia local: só aplica ao clicar em Salvar) ----
const perfil = ref({
  email: usuarioAtual.email,
  telefone: usuarioAtual.telefone,
  disponibilidade: usuarioAtual.disponibilidade,
})

async function salvarPerfil() {
  await configuracoesService.salvarPerfil(perfil.value)
  avisar('Perfil salvo.')
}

// ---- Preferências ----
const prefs = ref({ ...preferencias })

async function salvarPreferencias() {
  await configuracoesService.salvarPreferencias(prefs.value)
  avisar('Preferências salvas.')
}

const opcoesPrefs = [
  { chave: 'notificarNovoChamado', titulo: 'Novo chamado na fila', desc: 'Avisar quando um chamado cair na fila não atribuída.' },
  { chave: 'notificarRespostaSolicitante', titulo: 'Resposta do solicitante', desc: 'Avisar quando o solicitante responder um chamado seu.' },
  { chave: 'notificarPorEmail', titulo: 'Notificações por e-mail', desc: 'Receber também uma cópia dos avisos por e-mail.' },
]

// ---- Categorias ----
const novaCategoria = ref('')

const listaCategorias = computed(() =>
  categorias.map((nome) => ({
    nome,
    emUso: chamados.filter((c) => c.categoria === nome).length,
  })),
)

async function adicionar() {
  try {
    await configuracoesService.adicionarCategoria(novaCategoria.value)
    novaCategoria.value = ''
    avisar('Categoria adicionada.')
  } catch (e) {
    mensagem.value = ''
    erro.value = e.message
  }
}

async function remover(nome) {
  try {
    await configuracoesService.removerCategoria(nome)
    avisar('Categoria removida.')
  } catch (e) {
    mensagem.value = ''
    erro.value = e.message
  }
}
</script>

<template>
  <div class="config">
    <div class="abas">
      <button
        v-for="a in abas"
        :key="a.id"
        class="aba"
        :class="{ 'aba-ativa': aba === a.id }"
        @click="trocarAba(a.id)"
      >
        {{ a.rotulo }}
      </button>
    </div>

    <section class="card">
      <!-- PERFIL -->
      <form v-if="aba === 'perfil'" @submit.prevent="salvarPerfil">
        <h2>Perfil</h2>

        <label class="campo">
          <span>Nome</span>
          <input :value="usuarioAtual.nome" type="text" disabled />
          <small>O nome é gerenciado pelo administrador.</small>
        </label>

        <label class="campo">
          <span>Cargo</span>
          <input :value="usuarioAtual.cargo" type="text" disabled />
        </label>

        <label class="campo">
          <span>E-mail</span>
          <input v-model="perfil.email" type="email" />
        </label>

        <label class="campo">
          <span>Telefone</span>
          <input v-model="perfil.telefone" type="tel" placeholder="(82) 90000-0000" />
        </label>

        <label class="campo">
          <span>Disponibilidade</span>
          <select v-model="perfil.disponibilidade">
            <option value="online">Disponível</option>
            <option value="ocupado">Ocupado</option>
            <option value="ausente">Ausente</option>
          </select>
        </label>

        <button type="submit" class="btn-primario">Salvar perfil</button>
      </form>

      <!-- PREFERÊNCIAS -->
      <form v-else-if="aba === 'preferencias'" @submit.prevent="salvarPreferencias">
        <h2>Notificações</h2>

        <label v-for="o in opcoesPrefs" :key="o.chave" class="opcao">
          <div>
            <strong>{{ o.titulo }}</strong>
            <small>{{ o.desc }}</small>
          </div>
          <input v-model="prefs[o.chave]" type="checkbox" class="toggle" />
        </label>

        <button type="submit" class="btn-primario">Salvar preferências</button>
      </form>

      <!-- CATEGORIAS -->
      <div v-else>
        <h2>Categorias de chamado</h2>

        <form class="nova" @submit.prevent="adicionar">
          <input v-model="novaCategoria" type="text" placeholder="Nome da nova categoria" />
          <button type="submit" class="btn-primario"><Plus :size="15" /> Adicionar</button>
        </form>

        <ul class="categorias">
          <li v-for="c in listaCategorias" :key="c.nome">
            <span class="nome">{{ c.nome }}</span>
            <small>{{ c.emUso }} chamado(s)</small>
            <button type="button" aria-label="Remover categoria" @click="remover(c.nome)">
              <Trash2 :size="16" />
            </button>
          </li>
        </ul>
      </div>

      <p v-if="mensagem" class="aviso ok">{{ mensagem }}</p>
      <p v-if="erro" class="aviso erro">{{ erro }}</p>
    </section>
  </div>
</template>

<style scoped>
.config { max-width: 640px; display: flex; flex-direction: column; gap: 16px; }

.abas { display: flex; gap: 4px; border-bottom: 1px solid var(--color-border); }

.aba {
  padding: 10px 16px;
  border: none;
  border-bottom: 2px solid transparent;
  background: none;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-muted);
}
.aba:hover { color: var(--color-text); }
.aba-ativa { color: var(--color-primary); border-bottom-color: var(--color-accent); }

.card {
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fff;
}

h2 {
  margin-bottom: 20px;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.campo { display: block; margin-bottom: 16px; }
.campo > span {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

input[type='text'], input[type='email'], input[type='tel'], select {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fff;
  font-family: inherit;
  font-size: 14px;
  color: var(--color-text);
}
input:focus, select:focus { outline: none; border-color: var(--color-primary); }
input:disabled { background: var(--color-zebra); color: var(--color-text-muted); }

small { display: block; margin-top: 4px; font-size: 12px; color: var(--color-text-muted); }

.btn-primario {
  height: 40px;
  padding: 0 18px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: var(--radius);
  background: var(--color-primary);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}
.btn-primario:hover { background: var(--color-primary-hover); }

/* Preferências */
.opcao {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 14px 0;
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
}
.opcao:last-of-type { margin-bottom: 20px; }
.opcao strong { font-size: 14px; font-weight: 500; }

.toggle {
  appearance: none;
  flex-shrink: 0;
  width: 42px;
  height: 24px;
  border-radius: 12px;
  background: #cbd5e1;
  position: relative;
  cursor: pointer;
  transition: background 0.15s;
}
.toggle::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #fff;
  transition: transform 0.15s;
}
.toggle:checked { background: var(--color-primary); }
.toggle:checked::after { transform: translateX(18px); }

/* Categorias */
.nova { display: flex; gap: 10px; margin-bottom: 16px; }

.categorias { list-style: none; display: flex; flex-direction: column; gap: 8px; }
.categorias li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}
.categorias .nome { flex: 1; font-size: 14px; font-weight: 500; }
.categorias small { margin: 0; }
.categorias button {
  border: none;
  background: none;
  color: var(--color-text-muted);
  display: grid;
  place-items: center;
}
.categorias button:hover { color: var(--color-danger); }

.aviso { margin-top: 16px; font-size: 13px; }
.ok { color: var(--color-resolved); }
.erro { color: var(--color-danger); }
</style>