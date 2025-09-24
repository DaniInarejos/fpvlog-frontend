<template>
  <div class="equipment-stats">
    <!-- Tabla de estadísticas -->
    <div class="stats-table-container">
      <table class="stats-table">
        <thead>
          <tr>
            <th class="table-header">{{ $t('equipmentItems.status.status') || 'Estado' }}</th>
            <th class="table-header text-center">{{ $t('equipmentItems.stats.count') || 'Cantidad' }}</th>
            <th class="table-header text-center">{{ $t('equipmentItems.stats.percentage') || 'Porcentaje' }}</th>
          </tr>
        </thead>
        <tbody>
          <!-- Fila total -->
          <tr class="table-row total-row">
            <td class="table-cell status-cell">
              <div class="status-content">
                <i class="fas fa-tools status-icon"></i>
                <span class="status-label">{{ $t('equipmentItems.stats.total') }}</span>
              </div>
            </td>
            <td class="table-cell count-cell">
              <span class="count-badge total">{{ stats.total }}</span>
            </td>
            <td class="table-cell percentage-cell">
              <span class="percentage-text">100%</span>
            </td>
          </tr>
          
          <!-- Filas por estado -->
          <tr 
            v-for="(count, status) in stats.byStatus" 
            :key="status"
            class="table-row"
            :class="`${status}-row`"
          >
            <td class="table-cell status-cell">
              <div class="status-content">
                <i :class="getStatusIcon(status)" class="status-icon"></i>
                <span class="status-label">{{ $t(`equipmentItems.status.${status}`) }}</span>
              </div>
            </td>
            <td class="table-cell count-cell">
              <span class="count-badge" :class="status">{{ count }}</span>
            </td>
            <td class="table-cell percentage-cell">
              <span class="percentage-text">{{ getPercentage(count) }}%</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EquipmentStats',
  props: {
    stats: {
      type: Object,
      required: true,
      default: () => ({
        total: 0,
        byStatus: {
          active: 0,
          archived: 0,
          sold: 0,
          lost: 0
        }
      })
    }
  },
  methods: {
    getStatusIcon(status) {
      const icons = {
        active: 'fas fa-check-circle',
        archived: 'fas fa-archive',
        sold: 'fas fa-dollar-sign',
        lost: 'fas fa-exclamation-triangle'
      }
      return icons[status] || 'fas fa-question-circle'
    },

    getPercentage(count) {
      if (this.stats.total === 0) return 0
      return Math.round((count / this.stats.total) * 100)
    }
  }
}
</script>

<style scoped>
.equipment-stats {
  @apply space-y-4;
  min-height: 200px;
}

.stats-table-container {
  @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden;
}

.stats-table {
  @apply w-full;
}

.table-header {
  @apply bg-gray-50 dark:bg-gray-700 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider;
}

.table-header.text-center {
  text-align: center;
}

.table-row {
  @apply border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150;
}

.table-row.total-row {
  @apply bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700;
}

.table-row.active-row:hover {
  @apply bg-green-50 dark:bg-green-900/20;
}

.table-row.archived-row:hover {
  @apply bg-gray-50 dark:bg-gray-700;
}

.table-row.sold-row:hover {
  @apply bg-yellow-50 dark:bg-yellow-900/20;
}

.table-row.lost-row:hover {
  @apply bg-red-50 dark:bg-red-900/20;
}

.table-cell {
  @apply px-6 py-4 whitespace-nowrap;
}

.status-cell {
  @apply text-sm font-medium;
}

.status-content {
  @apply flex items-center space-x-3;
}

.status-icon {
  @apply text-lg;
}

.status-label {
  @apply text-gray-900 dark:text-white;
}

.count-cell {
  @apply text-center;
}

.count-badge {
  @apply inline-flex items-center px-3 py-1 rounded-full text-sm font-medium;
}

.count-badge.total {
  @apply bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200;
}

.count-badge.active {
  @apply bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200;
}

.count-badge.archived {
  @apply bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200;
}

.count-badge.sold {
  @apply bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200;
}

.count-badge.lost {
  @apply bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200;
}

.percentage-cell {
  @apply text-center;
}

.percentage-text {
  @apply text-sm font-medium text-gray-600 dark:text-gray-300 w-12 text-right;
}

/* Responsive */
@media (max-width: 640px) {
  .table-header,
  .table-cell {
    @apply px-3 py-2;
  }
  
  .status-content {
    @apply space-x-2;
  }
  
  .status-icon {
    @apply text-base;
  }
  
  .percentage-text {
    @apply w-10 text-xs;
  }
}

/* Evitar flash de contenido sin estilo */
.equipment-stats[v-cloak] {
  display: none;
}
</style>