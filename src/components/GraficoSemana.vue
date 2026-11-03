<script setup>
import { computed } from 'vue'

const props = defineProps({
  dados: { type: Array, required: true }, // [{ dia, abertos, resolvidos }]
})

const maximo = computed(() => {
  const maior = Math.max(...props.dados.flatMap((d) => [d.abertos, d.resolvidos]), 4)
  return Math.ceil(maior / 4) * 4
})

const marcas = computed(() => [0, 1, 2, 3, 4].map((i) => (maximo.value / 4) * i))

const pct = (valor) => `${(valor / maximo.value) * 100}%`
</script>

<template>
  <div>
    <div class="legenda">
      <span><i class="cor abertos"></i> Abertos</span>
      <span><i class="cor resolvidos"></i> Resolvidos</span>
    </div>

    <div class="grafico">
      <div class="plot">
        <div
          v-for="m in marcas"
          :key="m"
          class="linha"
          :style="{ bottom: pct(m) }"
        >
          <span class="marca">{{ m }}</span>
        </div>

        <div class="colunas">
          <div v-for="d in dados" :key="d.dia" class="dia">
            <div class="barra abertos" :style="{ height: pct(d.abertos) }" :title="`Abertos: ${d.abertos}`"></div>
            <div class="barra resolvidos" :style="{ height: pct(d.resolvidos) }" :title="`Resolvidos: ${d.resolvidos}`"></div>
          </div>
        </div>
      </div>

      <div class="rotulos">
        <span v-for="d in dados" :key="d.dia">{{ d.dia }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legenda {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-bottom: 8px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.cor {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 4px;
  border-radius: 2px;
}

.abertos { background: var(--color-primary); }
.resolvidos { background: var(--color-accent); }

.grafico {
  padding-left: 32px;
}

.plot {
  position: relative;
  height: 220px;
}

.linha {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px dashed var(--color-border);
}

.marca {
  position: absolute;
  left: -32px;
  top: -8px;
  width: 24px;
  text-align: right;
  font-size: 12px;
  color: var(--color-text-muted);
}

.colunas {
  position: absolute;
  inset: 0;
  display: flex;
}

.dia {
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 4px;
}

.barra {
  width: 24px;
  border-radius: 2px 2px 0 0;
}

.rotulos {
  display: flex;
  margin-top: 8px;
}

.rotulos span {
  flex: 1;
  text-align: center;
  font-size: 13px;
  color: var(--color-text-muted);
}
</style>