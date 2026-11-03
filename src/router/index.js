import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'

const emConstrucao = () => import('../views/EmConstrucaoView.vue')
const chamados = () => import('../views/ChamadosView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: emConstrucao, meta: { title: 'Dashboard' } },
        { path: 'fila', component: chamados, meta: { title: 'Fila não atribuída', filtro: { semAgente: true } } },
        { path: 'abertos', component: chamados, meta: { title: 'Chamados Abertos', filtro: { status: ['aberto'] } } },
        { path: 'em-andamento', component: chamados, meta: { title: 'Em Andamento', filtro: { status: ['em_andamento'] } } },
        { path: 'resolvidos', component: chamados, meta: { title: 'Resolvidos', filtro: { status: ['resolvido'] } } },
        { path: 'chamados', component: chamados, meta: { title: 'Todos os Chamados' } },
        { path: 'equipes', component: emConstrucao, meta: { title: 'Equipes' } },
        { path: 'relatorios', component: emConstrucao, meta: { title: 'Relatórios' } },
        { path: 'configuracoes', component: emConstrucao, meta: { title: 'Configurações' } },
      ],
    },
  ],
})

export default router