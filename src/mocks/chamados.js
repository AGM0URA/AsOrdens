import { reactive } from 'vue'


export const chamados = reactive([
 { id: 'CHM-1042', titulo: 'Erro ao acessar sistema de folha de pagamento', solicitante: 'Fernanda Oliveira', categoria: 'Sistemas', prioridade: 'alta', status: 'aberto', agente: 'Ricardo Lima', atualizadoEm: '2026-09-16T09:45:00' },
  { id: 'CHM-1041', titulo: 'Impressora do 3º andar não responde', solicitante: 'Carlos Souza', categoria: 'Hardware', prioridade: 'media', status: 'em_andamento', agente: 'Ana Paula Costa', atualizadoEm: '2026-09-16T08:00:00' },
  { id: 'CHM-1040', titulo: 'Solicitação de acesso ao SharePoint', solicitante: 'Mariana Torres', categoria: 'Acessos', prioridade: 'baixa', status: 'resolvido', agente: 'João Henrique', atualizadoEm: '2026-09-15T16:20:00' },
  { id: 'CHM-1039', titulo: 'VPN desconectando frequentemente', solicitante: 'Bruno Almeida', categoria: 'Rede', prioridade: 'alta', status: 'em_andamento', agente: 'Ricardo Lima', atualizadoEm: '2026-09-15T10:10:00' },
  { id: 'CHM-1038', titulo: 'Monitor sem sinal após atualização', solicitante: 'Priscila Mendes', categoria: 'Hardware', prioridade: 'media', status: 'aberto', agente: null, atualizadoEm: '2026-09-14T13:20:00' },
  { id: 'CHM-1037', titulo: 'Configurar e-mail corporativo no celular', solicitante: 'Lucas Ferreira', categoria: 'E-mail', prioridade: 'baixa', status: 'resolvido', agente: 'Ana Paula Costa', atualizadoEm: '2026-09-13T15:40:00' },
  { id: 'CHM-1036', titulo: 'Software de CAD travando ao salvar', solicitante: 'Amanda Rocha', categoria: 'Sistemas', prioridade: 'alta', status: 'aberto', agente: 'João Henrique', atualizadoEm: '2026-09-13T08:30:00' },
  { id: 'CHM-1035', titulo: 'Computador lento após Windows Update', solicitante: 'Diego Castro', categoria: 'SO', prioridade: 'media', status: 'fechado', agente: 'Ricardo Lima', atualizadoEm: '2026-09-13T09:00:00' },
  { id: 'CHM-1034', titulo: 'Teclado com teclas travando', solicitante: 'Natália Gomes', categoria: 'Hardware', prioridade: 'baixa', status: 'fechado', agente: 'Ana Paula Costa', atualizadoEm: '2026-09-12T17:00:00' },
  { id: 'CHM-1033', titulo: 'Sem acesso ao banco de dados de produção', solicitante: 'Rafael Nunes', categoria: 'Acessos', prioridade: 'alta', status: 'resolvido', agente: 'João Henrique', atualizadoEm: '2026-09-11T14:30:00' },
  { id: 'CHM-1032', titulo: 'Câmera de videoconferência não funciona', solicitante: 'Isabela Cardoso', categoria: 'Hardware', prioridade: 'media', status: 'em_andamento', agente: 'Ricardo Lima', atualizadoEm: '2026-09-12T08:00:00' },
  { id: 'CHM-1031', titulo: 'Erro 403 no portal do cliente', solicitante: 'Tiago Barbosa', categoria: 'Sistemas', prioridade: 'alta', status: 'resolvido', agente: 'João Henrique', atualizadoEm: '2026-09-10T17:55:00' },
])