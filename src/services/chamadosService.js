import { chamados } from '../mocks/chamados'

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const chamadosService = {
  // filtro: { status: ['aberto'], semAgente: true }
  async listar(filtro = {}) {
    await esperar(150) // simula o tempo de resposta de uma API

    // Quando o back existir, troca tudo por:
    // const { data } = await api.get('/chamados', { params: filtro })
    // return data

    return chamados.filter((c) => {
      if (filtro.status && !filtro.status.includes(c.status)) return false
      if (filtro.semAgente && c.agente) return false
      return true
    })
  },
}