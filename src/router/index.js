import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import { usuarioAtual } from '../mocks/usuario'
const equipes = () => import('../views/EquipesView.vue')

const atendimento = () => import('../views/AtendimentoView.vue')
const dashboard = () => import('../views/DashboardView.vue')
const configuracoes = () => import('../views/ConfiguracoesView.vue')
const emConstrucao = () => import('../views/EmConstrucaoView.vue')
const chamados = () => import('../views/ChamadosView.vue')
const relatorios = () => import('../views/RelatoriosView.vue')
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: dashboard, meta: { title: 'Dashboard' } },
        { path: 'fila', component: chamados, meta: { title: 'Fila não atribuída', filtro: { semAgente: true } } },
        { path: 'abertos', component: chamados, meta: { title: 'Chamados Abertos', filtro: { status: ['aberto'] } } },
        { path: 'em-andamento', component: chamados, meta: { title: 'Em Andamento', filtro: { status: ['em_andamento'] } } },
        { path: 'resolvidos', component: chamados, meta: { title: 'Resolvidos', filtro: { status: ['resolvido'] } } },
        { path: 'chamados', component: chamados, meta: { title: 'Todos os Chamados' } },
        { path: 'equipes', component: equipes, meta: { title: 'Equipes' } },
        { path: 'relatorios', component: relatorios, meta: { title: 'Relatórios' } },
        { path: 'configuracoes', component: configuracoes, meta: { title: 'Configurações' } },
        { path: 'minha-fila', component: chamados, meta: { title: 'Minha fila', filtro: { agente: usuarioAtual.nome, status: ['aberto', 'em_andamento'] } } },
        { path: 'atendimento/:id', component: atendimento, meta: { title: 'Atendimento' } },
      ],
    },
  ],
})

export default router