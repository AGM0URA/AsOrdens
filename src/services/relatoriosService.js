import { chamados } from '../mocks/chamados'
import { relatorios } from '../mocks/relatorios'

const esperar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

export const relatoriosService = {
  async gerar(dias) {
    await esperar(150)

    // API real: const { data } = await api.get('/relatorios', { params: { dias } })
    // return data

    // No mock, o período conta a partir do chamado mais recente.
    // Na API real, conta a partir de hoje.
    const referencia = new Date(Math.max(...chamados.map((c) => new Date(c.atualizadoEm))))
    const inicio = new Date(referencia)
    inicio.setDate(inicio.getDate() - dias)

    const doPeriodo = chamados.filter((c) => new Date(c.atualizadoEm) >= inicio)
    const concluido = (c) => ['resolvido', 'fechado'].includes(c.status)
    const total = doPeriodo.length
    const concluidos = doPeriodo.filter(concluido).length

    const porAgente = {}
    for (const c of doPeriodo) {
      if (!c.agente) continue
      porAgente[c.agente] ??= { agente: c.agente, total: 0, concluidos: 0 }
      porAgente[c.agente].total++
      if (concluido(c)) porAgente[c.agente].concluidos++
    }

    const porCategoria = {}
    for (const c of doPeriodo) porCategoria[c.categoria] = (porCategoria[c.categoria] ?? 0) + 1

    return {
      total,
      altaPrioridade: doPeriodo.filter((c) => c.prioridade === 'alta').length,
      taxaResolucao: total ? Math.round((concluidos / total) * 100) : 0,
      tempoMedioHoras: relatorios[dias].tempoMedioHoras,
      serie: relatorios[dias].serie,
      ranking: Object.values(porAgente).sort((a, b) => b.concluidos - a.concluidos),
      porCategoria: Object.entries(porCategoria)
        .map(([categoria, qtd]) => ({ categoria, total: qtd }))
        .sort((a, b) => b.total - a.total),
      chamados: doPeriodo,
    }
  },
}