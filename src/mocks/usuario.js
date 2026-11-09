import { reactive } from 'vue'

export const usuarioAtual = reactive({
  id: 1,
  nome: 'Andre Moura',
  cargo: 'Agente de TI',
  email: 'ricardo.lima@asordens.com',
  telefone: '',
  disponibilidade: 'online',
})