<script setup>
import { onMounted, onUnmounted } from 'vue'
import { X } from 'lucide-vue-next'

defineProps({
  titulo: { type: String, required: true },
  largura: { type: String, default: '560px' },
})
const emit = defineEmits(['fechar'])

function aoTeclar(e) {
  if (e.key === 'Escape') emit('fechar')
}
onMounted(() => document.addEventListener('keydown', aoTeclar))
onUnmounted(() => document.removeEventListener('keydown', aoTeclar))
</script>

<template>
  <Teleport to="body">
    <div class="fundo" @mousedown.self="emit('fechar')">
      <div class="modal" :style="{ maxWidth: largura }" role="dialog" aria-modal="true">
        <header>
          <h2>{{ titulo }}</h2>
          <button class="fechar" aria-label="Fechar" @click="emit('fechar')">
            <X :size="18" />
          </button>
        </header>
        <div class="corpo"><slot /></div>
        <footer v-if="$slots.rodape"><slot name="rodape" /></footer>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.fundo {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(15, 23, 42, 0.5);
  display: grid;
  place-items: center;
  padding: 24px;
}

.modal {
  width: 100%;
  max-height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.25);
}

header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid var(--color-border);
}

h2 {
  font-size: 17px;
  font-weight: 600;
}

.fechar {
  border: none;
  background: none;
  color: var(--color-text-muted);
  display: grid;
  place-items: center;
}

.corpo {
  padding: 20px 24px;
  overflow-y: auto;
}

footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid var(--color-border);
}
</style>