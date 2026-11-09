<script setup>
import { ref, computed } from 'vue'
import BaseModal from './BaseModal.vue'
import AnexosInput from './AnexosInput.vue'
import { useChamados } from '../composables/useChamados'
import { chamadosService } from '../services/chamadosService'
import { categorias } from '../utils/chamados'

const { chamadoEmEdicao, fecharForm, atualizarListas, abrirDetalhe } = useChamados()

const edicao = chamadoEmEdicao.value // null = criando um novo

const form = ref({
  titulo: edicao?.titulo ?? '',
  solicitante: edicao?.solicitante ?? '',
  categoria: edicao?.categoria ?? categorias[0],
  prioridade: edicao?.prioridade ?? 'baixa',
  descricao: edicao?.descricao ?? '',
  anexos: [...(edicao?.anexos ?? [])],
})

const salvando = ref(false)
const valido = computed(() => form.value.titulo.trim() && form.value.solicitante.trim())

async function salvar() {
  if (!valido.value || salvando.value) return
  salvando.value = true

  const dados = {
    ...form.value,
    titulo: form.value.titulo.trim(),
    solicitante: form.value.solicitante.trim(),
  }

  if (edicao) {
    await chamadosService.atualizar(edicao.id, dados)
    atualizarListas()
    fecharForm()
    abrirDetalhe(edicao.id) // volta pro detalhe do chamado editado
  } else {
    await chamadosService.criar(dados)
    atualizarListas()
    fecharForm()
  }
}
</script>

<template>
  <BaseModal :titulo="edicao ? `Editar ${edicao.id}` : 'Novo chamado'" @fechar="fecharForm">
    <form id="form-chamado" @submit.prevent="salvar">
      <label class="campo">
        <span>Título</span>
        <input v-model="form.titulo" type="text" placeholder="Descreva o problema brevemente" />
      </label>

      <label class="campo">
        <span>Solicitante</span>
        <input v-model="form.solicitante" type="text" placeholder="Nome do solicitante" />
      </label>

      <div class="duas-colunas">
        <label class="campo">
          <span>Categoria</span>
          <select v-model="form.categoria">
            <option v-for="c in categorias" :key="c" :value="c">{{ c }}</option>
          </select>
        </label>

        <label class="campo">
          <span>Prioridade</span>
          <select v-model="form.prioridade">
            <option value="baixa">Baixa</option>
            <option value="media">Média</option>
            <option value="alta">Alta</option>
          </select>
        </label>
      </div>

      <label class="campo">
        <span>Descrição</span>
        <textarea v-model="form.descricao" rows="4" placeholder="Detalhe o problema..."></textarea>
      </label>

      <div class="campo">
        <span>Anexos</span>
        <AnexosInput v-model="form.anexos" />
      </div>
    </form>

    <template #rodape>
      <button type="button" class="btn btn-secundario" @click="fecharForm">Cancelar</button>
      <button type="submit" form="form-chamado" class="btn btn-primario" :disabled="!valido || salvando">
        {{ salvando ? 'Salvando...' : edicao ? 'Salvar alterações' : 'Criar chamado' }}
      </button>
    </template>
  </BaseModal>
</template>

<style scoped>
.campo {
  display: block;
  margin-bottom: 16px;
}

.campo > span {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

input,
select,
textarea {
  width: 100%;
  padding: 11px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius);
  background: #fff;
  font-family: inherit;
  font-size: 14px;
  color: var(--color-text);
}

textarea {
  resize: vertical;
}

input:focus,
select:focus,
textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.duas-colunas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.btn {
  height: 40px;
  padding: 0 18px;
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

.btn-primario:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.btn-primario:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}
</style>