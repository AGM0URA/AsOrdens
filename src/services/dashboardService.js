import { chamados } from '../mocks/chamados'
import { dashboard } from '../mocks/dashboard'

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const dashboardService = {
  async resumo() {
    await esperar(150)

    // Quando o back existir, troca tudo por:
    // const { data } = await api.get('/dashboard')
    // return data

    const contar = (fn) => chamados.filter(fn).length

    return {
      kpis: {
        abertos: contar((c) => c.status === 'aberto'),
        emAndamento: contar((c) => c.status === 'em_andamento'),
        resolvidos: contar((c) => c.status === 'resolvido'),
        altaPrioridade: contar((c) => c.prioridade === 'alta'),
      },
      porDia: dashboard.porDia,
      porCategoria: dashboard.porCategoria,
      recentes: [...chamados]
        .sort((a, b) => b.atualizadoEm.localeCompare(a.atualizadoEm))
        .slice(0, 6),
    }
  },
}