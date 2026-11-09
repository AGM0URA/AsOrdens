<script setup>
import { statusLabel } from '../utils/chamados'
defineProps({ status: { type: String, required: true } })
</script>

<template>
  <span class="status" :class="`status-${status}`">{{ statusLabel[status] }}</span>
</template>

<style scoped>
.status {
  padding: 3px 10px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
}
.status-aberto { background: #eff6ff; border-color: #bfdbfe; color: #1d4ed8; }
.status-em_andamento { background: #fefce8; border-color: #fde68a; color: #a16207; }
.status-resolvido { background: #f0fdf4; border-color: #bbf7d0; color: #15803d; }
.status-fechado { background: #f1f5f9; border-color: #e2e8f0; color: #475569; }
</style>