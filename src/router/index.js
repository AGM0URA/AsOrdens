import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/mainlayout.vue'

const pagina = () => import('../views/EmConstrucaoView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MainLayout,
      children: [
        { path: '', component: pagina, meta: { title: 'Dashboard' } },
        { path: 'fila', component: pagina, meta: { title: 'Fila não atribuída' } },
        { path: 'abertos', component: pagina, meta: { title: 'Chamados Abertos' } },
        { path: 'em-andamento', component: pagina, meta: { title: 'Em Andamento' } },
        { path: 'resolvidos', component: pagina, meta: { title: 'Resolvidos' } },
        { path: 'chamados', component: pagina, meta: { title: 'Todos os Chamados' } },
        { path: 'equipes', component: pagina, meta: { title: 'Equipes' } },
        { path: 'relatorios', component: pagina, meta: { title: 'Relatórios' } },
        { path: 'configuracoes', component: pagina, meta: { title: 'Configurações' } },
      ],
    },
  ],
})

export default router