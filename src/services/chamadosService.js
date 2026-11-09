import { chamados } from '../mocks/chamados'
import { usuarioAtual } from '../mocks/usuario'


const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const chamadosService = {
  // filtro: { status: ['aberto'], semAgente: true }
  async listar(filtro = {}) {
    await esperar(150)

    return chamados.filter((c) => {
      if (filtro.status && !filtro.status.includes(c.status)) return false
      if (filtro.semAgente && c.agente) return false
      if (filtro.agente && c.agente !== filtro.agente) return false
      return true
    })
  },

    async buscar(id) {
    await esperar(100)
    // API real: const { data } = await api.get(`/chamados/${id}`)
    return chamados.find((c) => c.id === id) ?? null
  },

  async criar(dados) {
    await esperar(200)


    const ultimo = Math.max(...chamados.map((c) => Number(c.id.split('-')[1])))
    const novo = {
      ...dados,
      id: `CHM-${ultimo + 1}`,
      status: 'aberto',
      agente: null,
      atualizadoEm: new Date().toISOString(),
    }
    chamados.unshift(novo)
    return novo
  },

  async atualizar(id, dados) {
    await esperar(200)
    
    const chamado = chamados.find((c) => c.id === id)
    Object.assign(chamado, dados, { atualizadoEm: new Date().toISOString() })
    return chamado
  },

    async puxar(id) {
    await esperar(150)
    // API real: await api.post(`/chamados/${id}/puxar`)
    const chamado = chamados.find((c) => c.id === id)
    if (chamado.agente) throw new Error('Este chamado já foi atribuído a outro agente.')
    chamado.agente = usuarioAtual.nome
    chamado.status = 'em_andamento'
    chamado.atualizadoEm = new Date().toISOString()
    return chamado
  },

  async alterarStatus(id, status) {
    await esperar(100)
    // API real: await api.patch(`/chamados/${id}`, { status })
    const chamado = chamados.find((c) => c.id === id)
    chamado.status = status
    chamado.atualizadoEm = new Date().toISOString()
    return chamado
  },

  async enviarMensagem(id, { texto, anexos }) {
    await esperar(150)
    // API real: POST /chamados/:id/mensagens (multipart, por causa dos anexos)
    const chamado = chamados.find((c) => c.id === id)
    chamado.mensagens ??= []
    chamado.mensagens.push({
      id: crypto.randomUUID(),
      autor: 'agente',
      nome: usuarioAtual.nome,
      texto,
      anexos,
      enviadoEm: new Date().toISOString(),
    })
    chamado.atualizadoEm = new Date().toISOString()
    return chamado
  },
}