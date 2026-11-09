import { chamados } from '../mocks/chamados'
import { agentes } from '../mocks/agentes'

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const equipesService = {
  async listar() {
    await esperar(150)
    // API real: const { data } = await api.get('/agentes')
    // return data

    return agentes.map((a) => {
      const meus = chamados.filter((c) => c.agente === a.nome)
      const contar = (status) => meus.filter((c) => c.status === status).length
      return {
        ...a,
        disponibilidade: a.nome === usuarioAtual.nome ? usuarioAtual.disponibilidade : a.disponibilidade,
        abertos: contar('aberto'),
        emAndamento: contar('em_andamento'),
        resolvidos: contar('resolvido'),
        naFila: contar('aberto') + contar('em_andamento'),
      }
    })
  },
}