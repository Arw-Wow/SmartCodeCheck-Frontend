import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DetectionView from '@/views/DetectionView.vue'
import ComparisonView from '@/views/ComparisonView.vue'

const routes = [
  { path: '/', name: 'Home', component: HomeView },
  { path: '/detection', name: 'Detection', component: DetectionView },
  { path: '/comparison', name: 'Comparison', component: ComparisonView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router