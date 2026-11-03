<script setup>
import { computed } from 'vue'
import {
  Compass, Plus, ChartColumn, Inbox, CircleAlert, Clock,
  CircleCheck, ClipboardList, Users, Settings, ChevronDown,
} from 'lucide-vue-next'
import { chamados } from '../mocks/chamados'
import { usuarioAtual } from '../mocks/usuario'

defineEmits(['novo-chamado'])

const totalAbertos = computed(() => chamados.filter((c) => c.status === 'aberto').length)
const totalAndamento = computed(() => chamados.filter((c) => c.status === 'em_andamento').length)

const iniciais = usuarioAtual.nome
  .split(' ')
  .map((p) => p[0])
  .slice(0, 2)
  .join('')

const menuChamados = computed(() => [
  { to: '/', label: 'Dashboard', icon: ChartColumn },
  { to: '/fila', label: 'Fila não atribuída', icon: Inbox },
  { to: '/abertos', label: 'Abertos', icon: CircleAlert, badge: totalAbertos.value },
  { to: '/em-andamento', label: 'Em andamento', icon: Clock, badge: totalAndamento.value },
  { to: '/resolvidos', label: 'Resolvidos', icon: CircleCheck },
  { to: '/chamados', label: 'Todos os chamados', icon: ClipboardList },
])

const menuGerenciar = [
  { to: '/equipes', label: 'Equipes', icon: Users },
  { to: '/relatorios', label: 'Relatórios', icon: ChartColumn },
  { to: '/configuracoes', label: 'Configurações', icon: Settings },
]
</script>

<template>
  <aside class="sidebar">
    <div class="marca">
      <span class="marca-icone"><Compass :size="18" /></span>
      <span class="marca-nome">Às Ordens</span>
    </div>

    <button class="btn-novo" @click="$emit('novo-chamado')">
      <Plus :size="16" /> Novo chamado
    </button>

    <nav>
      <p class="secao">Chamados</p>
      <RouterLink
        v-for="item in menuChamados"
        :key="item.to"
        :to="item.to"
        class="item"
        active-class=""
        exact-active-class="ativo"
      >
        <component :is="item.icon" :size="18" />
        <span class="item-label">{{ item.label }}</span>
        <span v-if="item.badge" class="badge">{{ item.badge }}</span>
      </RouterLink>

      <p class="secao">Gerenciar</p>
      <RouterLink
        v-for="item in menuGerenciar"
        :key="item.to"
        :to="item.to"
        class="item"
        active-class=""
        exact-active-class="ativo"
      >
        <component :is="item.icon" :size="18" />
        <span class="item-label">{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="usuario">
      <span class="avatar">{{ iniciais }}</span>
      <div class="usuario-info">
        <strong>{{ usuarioAtual.nome }}</strong>
        <small>{{ usuarioAtual.cargo }}</small>
      </div>
      <ChevronDown :size="16" class="usuario-seta" />
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  background: var(--color-sidebar);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  flex-shrink: 0;
}

.marca {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 20px;
  border-bottom: 1px solid var(--color-border);
}

.marca-icone {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-primary);
  color: var(--color-accent);
  display: grid;
  place-items: center;
}

.marca-nome {
  font-weight: 600;
  font-size: 16px;
}

.btn-novo {
  margin: 16px 16px 8px;
  height: 42px;
  border: none;
  border-radius: var(--radius);
  background: var(--color-primary);
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-novo:hover {
  background: var(--color-primary-hover);
}

nav {
  flex: 1;
  padding: 0 12px;
  overflow-y: auto;
}

.secao {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  padding: 18px 10px 8px;
}

.item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  margin-bottom: 2px;
  border: 1px solid transparent;
  border-radius: var(--radius);
  color: var(--color-text);
  text-decoration: none;
  font-size: 15px;
}

.item:hover {
  background: rgba(255, 255, 255, 0.6);
}

.item.ativo {
  background: #fff;
  border-color: var(--color-border);
  box-shadow: 0 1px 3px rgba(15, 23, 42, 0.08);
  color: var(--color-primary);
  font-weight: 600;
}

.item-label {
  flex: 1;
}

.badge {
  min-width: 24px;
  height: 22px;
  padding: 0 7px;
  border-radius: 11px;
  background: #d5dce8;
  color: #475569;
  font-size: 12px;
  font-weight: 600;
  display: grid;
  place-items: center;
}

.item.ativo .badge {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.usuario {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-top: 1px solid var(--color-border);
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.usuario-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  line-height: 1.3;
}

.usuario-info strong {
  font-size: 14px;
  font-weight: 600;
}

.usuario-info small {
  color: var(--color-text-muted);
  font-size: 12px;
}

.usuario-seta {
  color: var(--color-text-muted);
}
</style>