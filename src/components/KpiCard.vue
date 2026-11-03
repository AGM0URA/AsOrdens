<script setup>
defineProps({
  valor: { type: Number, required: true },
  rotulo: { type: String, required: true },
  icone: { type: Object, required: true },
  tom: { type: String, default: 'azul' }, 
})
</script>

<template>
  <div class="kpi">
    <span class="kpi-icone" :class="`tom-${tom}`">
      <component :is="icone" :size="18" />
    </span>
    <div>
      <strong>{{ valor }}</strong>
      <span class="kpi-rotulo">{{ rotulo }}</span>
    </div>
  </div>
</template>

<style scoped>
.kpi {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fff;
}

.kpi-icone {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: grid;
  place-items: center;
}

.tom-azul { background: #eff6ff; color: var(--color-open); }
.tom-amarelo { background: #fefce8; color: var(--color-progress); }
.tom-verde { background: #f0fdf4; color: var(--color-resolved); }
.tom-vermelho { background: #fef2f2; color: var(--color-danger); }

strong {
  display: block;
  font-size: 28px;
  line-height: 1.1;
}

.kpi-rotulo {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}
</style>