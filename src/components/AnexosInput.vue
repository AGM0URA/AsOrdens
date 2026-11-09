<script setup>
import { ref } from 'vue'
import { Upload, FileText, X } from 'lucide-vue-next'
import { formatarTamanho } from '../utils/chamados'

const props = defineProps({
  modelValue: { type: Array, default: () => [] },
})
const emit = defineEmits(['update:modelValue'])

const MAX_BYTES = 10 * 1024 * 1024
const EXTENSOES = ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'zip']

const inputArquivo = ref(null)
const erro = ref('')

function adicionar(evento) {
  const novos = []
  const erros = []

  for (const arquivo of evento.target.files) {
    const ext = arquivo.name.split('.').pop().toLowerCase()
    if (!EXTENSOES.includes(ext)) {
      erros.push(`${arquivo.name}: tipo não permitido`)
    } else if (arquivo.size > MAX_BYTES) {
      erros.push(`${arquivo.name}: maior que 10 MB`)
    } else {
      novos.push({
        id: crypto.randomUUID(),
        nome: arquivo.name,
        tamanho: arquivo.size,
        tipo: arquivo.type,
        url: URL.createObjectURL(arquivo),
        arquivo, // o File original, usado no upload quando o back existir
      })
    }
  }

  erro.value = erros.join(' · ')
  emit('update:modelValue', [...props.modelValue, ...novos])
  evento.target.value = '' // permite escolher o mesmo arquivo de novo
}

function remover(id) {
  emit('update:modelValue', props.modelValue.filter((a) => a.id !== id))
}

const ehImagem = (a) => a.tipo.startsWith('image/')
</script>

<template>
  <div>
    <button type="button" class="area" @click="inputArquivo.click()">
      <Upload :size="16" /> Adicionar imagens ou arquivos
    </button>
    <input
      ref="inputArquivo"
      type="file"
      multiple
      hidden
      accept=".png,.jpg,.jpeg,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip"
      @change="adicionar"
    />
    <p class="dica">PNG, JPG, PDF, Office, TXT ou ZIP · até 10 MB por arquivo</p>
    <p v-if="erro" class="erro">{{ erro }}</p>

    <ul v-if="modelValue.length" class="lista">
      <li v-for="a in modelValue" :key="a.id">
        <img v-if="ehImagem(a)" :src="a.url" alt="" class="miniatura" />
        <span v-else class="miniatura doc"><FileText :size="18" /></span>
        <div class="info">
          <span class="nome">{{ a.nome }}</span>
          <small>{{ formatarTamanho(a.tamanho) }}</small>
        </div>
        <button type="button" aria-label="Remover anexo" @click="remover(a.id)">
          <X :size="16" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.area {
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px dashed #b6c0d0;
  border-radius: var(--radius);
  background: #fafbfd;
  color: var(--color-primary);
  font-size: 14px;
  font-weight: 500;
}

.area:hover {
  background: var(--color-primary-soft);
}

.dica {
  margin-top: 6px;
  font-size: 12px;
  color: var(--color-text-muted);
}

.erro {
  margin-top: 6px;
  font-size: 13px;
  color: var(--color-danger);
}

.lista {
  list-style: none;
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
}

.miniatura {
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

.info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.nome {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
}

small {
  color: var(--color-text-muted);
  font-size: 12px;
}

li button {
  border: none;
  background: none;
  color: var(--color-text-muted);
  display: grid;
  place-items: center;
}

li button:hover {
  color: var(--color-danger);
}
</style>