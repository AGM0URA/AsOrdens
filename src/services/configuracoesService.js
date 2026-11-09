import { chamados } from '../mocks/chamados'
import { usuarioAtual } from '../mocks/usuario'
import { preferencias } from '../mocks/configuracoes'
import { categorias } from '../utils/chamados'

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const configuracoesService = {
  async salvarPerfil({ email, telefone, disponibilidade }) {
    await esperar(150)
    // API real: await api.put('/me', { email, telefone, disponibilidade })
    Object.assign(usuarioAtual, { email, telefone, disponibilidade })
  },

  async salvarPreferencias(dados) {
    await esperar(150)
    // API real: await api.put('/me/preferencias', dados)
    Object.assign(preferencias, dados)
  },

  async adicionarCategoria(nome) {
    await esperar(100)
    // API real: await api.post('/categorias', { nome })
    const limpo = nome.trim()
    if (!limpo) throw new Error('Informe um nome para a categoria.')
    if (categorias.some((c) => c.toLowerCase() === limpo.toLowerCase())) {
      throw new Error('Essa categoria já existe.')
    }
    categorias.push(limpo)
  },

  async removerCategoria(nome) {
    await esperar(100)
    // API real: await api.delete(`/categorias/${nome}`)
    const emUso = chamados.filter((c) => c.categoria === nome).length
    if (emUso) {
      throw new Error(`Não dá pra remover: ${emUso} chamado(s) usam "${nome}".`)
    }
    categorias.splice(categorias.indexOf(nome), 1)
  },
}