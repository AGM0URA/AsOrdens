<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Bell, Inbox } from 'lucide-vue-next'
import { chamados } from '../mocks/chamados'
import { usuarioAtual } from '../mocks/usuario'

const route = useRoute()

const dataHoje = computed(() => {
  const texto = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  return `Hoje, ${texto}`
})

const minhaFila = computed(
  () =>
    chamados.filter(
      (c) =>
        c.agente === usuarioAtual.nome &&
        ['aberto', 'em_andamento'].includes(c.status),
    ).length,
)
</script>

<template>
  <header class="topbar">
    <div>
      <h1>{{ route.meta.title }}</h1>
      <p>{{ dataHoje }}</p>
    </div>

    <div class="acoes">
      <button class="sino" aria-label="Notificações">
        <Bell :size="18" />
        <span class="ponto"></span>
      </button>
      <RouterLink to="/minha-fila" class="btn-fila">
        <Inbox :size="16" />
        Fila
        <span class="contador">{{ minhaFila }}</span>
      </RouterLink>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg);
}

h1 {
  font-size: 20px;
  font-weight: 600;
  line-height: 1.2;
}

p {
  margin-top: 2px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.acoes {
  display: flex;
  align-items: center;
  gap: 14px;
}

.sino {
  position: relative;
  border: none;
  background: none;
  color: var(--color-text-muted);
  display: grid;
  place-items: center;
}

.ponto {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-accent);
}

.btn-fila {
  height: 40px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fff;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  text-decoration: none;
}

.contador {
  min-width: 22px;
  height: 22px;
  border-radius: 11px;
  background: var(--color-primary);
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  display: grid;
  place-items: center;
}
</style>