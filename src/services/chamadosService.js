import { chamados } from '../mocks/chamados'

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const chamadosService = {
  // filtro: { status: ['aberto'], semAgente: true }
  async listar(filtro = {}) {
    await esperar(150)

    return chamados.filter((c) => {
      if (filtro.status && !filtro.status.includes(c.status)) return false
      if (filtro.semAgente && c.agente) return false
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
}