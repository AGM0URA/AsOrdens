import { ref } from 'vue'

// Estado fora da função: é compartilhado por todos os componentes
const formAberto = ref(false)
const chamadoEmEdicao = ref(null)
const detalheId = ref(null)
const versao = ref(0) // sobe 1 a cada alteração; as telas escutam pra recarregar

export function useChamados() {
  return {
    formAberto,
    chamadoEmEdicao,
    detalheId,
    versao,
    abrirNovo() {
      chamadoEmEdicao.value = null
      formAberto.value = true
    },
    abrirEdicao(chamado) {
      chamadoEmEdicao.value = chamado
      formAberto.value = true
    },
    fecharForm() {
      formAberto.value = false
    },
    abrirDetalhe(id) {
      detalheId.value = id
    },
    fecharDetalhe() {
      detalheId.value = null
    },
    atualizarListas() {
      versao.value++
    },
  }
}