<script setup>
import { computed } from 'vue'

const props = defineProps({
  dados: { type: Array, required: true }, // [{ categoria, total }]
})

const maximo = computed(() => Math.max(...props.dados.map((d) => d.total), 1))
</script>

<template>
  <ul class="lista">
    <li v-for="d in dados" :key="d.categoria">
      <span class="nome">{{ d.categoria }}</span>
      <div class="trilho">
        <div class="preenchido" :style="{ width: `${(d.total / maximo) * 100}%` }"></div>
      </div>
      <span class="total">{{ d.total }}</span>
    </li>
  </ul>
</template>

<style scoped>
.lista {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
}

.nome { width: 80px; }

.trilho {
  flex: 1;
  height: 8px;
  border-radius: 4px;
  background: var(--color-sidebar);
  overflow: hidden;
}

.preenchido {
  height: 100%;
  border-radius: 4px;
  background: var(--color-primary);
}

.total {
  width: 28px;
  text-align: right;
  color: var(--color-text-muted);
}
</style>