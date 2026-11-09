import { reactive } from 'vue'

export const statusLabel = {
  aberto: 'Aberto',
  em_andamento: 'Em andamento',
  resolvido: 'Resolvido',
  fechado: 'Fechado',
}

export const prioridadeLabel = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
}

export function formatarData(iso) {
  const d = new Date(iso)
  const data = d.toLocaleDateString('pt-BR')
  const hora = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${data} ${hora}`
}

export const categorias = reactive(['Sistemas', 'Hardware', 'Acessos', 'Rede', 'E-mail', 'SO'])

export function formatarTamanho(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}