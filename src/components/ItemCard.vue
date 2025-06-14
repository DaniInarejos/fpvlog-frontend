<template>
  <div class="item-card">
    <div class="item-image">
      <img :src="imageUrl" :alt="imageAlt" />
    </div>
    <div class="item-header">
      <h4>{{ title }}</h4>
      <span class="item-subtitle">{{ subtitle }}</span>
    </div>
    <div class="item-details">
      <p v-for="detail in details" :key="detail.label">
        <strong>{{ detail.label }}:</strong> {{ detail.value }}
      </p>
    </div>
    <div class="item-actions">
      <button @click="$emit('edit', item)" class="btn btn-sm btn-outline">
        ✏️ Editar
      </button>
      <button @click="$emit('delete', item._id)" class="btn btn-sm btn-danger">
        🗑️ Eliminar
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  },
  details: {
    type: Array,
    default: () => []
  },
  imageUrl: {
    type: String,
    required: true
  },
  imageAlt: {
    type: String,
    default: 'Item'
  }
})

defineEmits(['edit', 'delete'])
</script>

<style scoped>
.item-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.item-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.item-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.item-card:hover::before {
  opacity: 1;
}

.item-image {
  width: 100%;
  height: 120px;
  overflow: hidden;
  border-radius: 8px 8px 0 0;
  border: 2px solid rgba(255, 255, 255, 0.2);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.item-card:hover .item-image img {
  transform: scale(1.05);
}

.item-header {
  padding: 15px 15px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.item-header h4 {
  margin: 0 0 5px 0;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
}

.item-subtitle {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
}

.item-details {
  padding: 15px;
}

.item-details p {
  margin: 8px 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.9rem;
}

.item-actions {
  padding: 15px;
  display: flex;
  gap: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.3s ease;
  flex: 1;
}

.btn-outline {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.btn-outline:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-danger {
  background: rgba(220, 53, 69, 0.8);
  color: white;
}

.btn-danger:hover {
  background: rgba(220, 53, 69, 1);
}
</style>