export default {
  title: 'Equipamiento',
  description: 'Gestiona tu equipamiento y herramientas de FPV',
  addItem: 'Añadir Equipamiento',
  editItem: 'Editar Equipamiento',
  noItems: 'No hay equipamiento registrado',
  noItemsOfType: 'No hay equipamiento de este tipo',
  noItemsDescription: 'Comienza añadiendo tu primer equipamiento para llevar un registro completo de tus herramientas de FPV.',
  addFirst: 'Añadir {type}',
  addFirstItem: 'Añadir primer equipamiento',
  addFirstDescription: 'Comienza añadiendo tu primer equipamiento para llevar un registro completo.',
  showing: 'Mostrando {count} de {total} elementos',
  noResults: 'No se encontraron resultados',
  noResultsDescription: 'Intenta ajustar los filtros de búsqueda o añade nuevo equipamiento.',
  selectType: 'Seleccionar tipo de equipamiento',
  addFavorite: 'Añadir a favoritos',
  removeFavorite: 'Quitar de favoritos',
  favorite: 'Favorito',
  viewProduct: 'Ver producto',
  itemDetails: 'Detalles del equipamiento',
  confirmDelete: 'Confirmar eliminación',
  deleteWarning: '¿Estás seguro de que quieres eliminar "{name}"? Esta acción no se puede deshacer.',
  loginDescription: 'Inicia sesión para gestionar tu equipamiento y herramientas de FPV.',
  statistics: 'Estadísticas',
  total: 'Total',
  loadingStats: 'Cargando estadísticas...',
  noImage: 'Sin imagen',
  metadata: 'Información del Sistema',
  
  stats: {
    total: 'Total de Elementos',
    byStatus: 'Por Estado',
    count: 'Cantidad',
    percentage: 'Porcentaje'
  },
  
  search: {
    placeholder: 'Buscar equipamiento...'
  },
  
  types: {
    all: 'Todos',
    drone: 'Drone',
    radio: 'Radio',
    goggles: 'Gafas FPV',
    battery: 'Batería',
    charger: 'Cargador',
    others: 'Otros'
  },
  
  conditions: {
    new: 'Nuevo',
    used: 'Usado',
    refurbished: 'Reacondicionado',
    likeNew: 'Como Nuevo',
    good: 'Bueno',
    fair: 'Regular',
    poor: 'Malo'
  },
  
  status: {
    active: 'Activo',
    archived: 'Archivado', 
    sold: 'Vendido',
    lost: 'Perdido'
  },
  
  form: {
    name: 'Nombre',
    type: 'Tipo',
    brand: 'Marca',
    model: 'Modelo',
    brandModel: 'Marca y Modelo',
    condition: 'Estado',
    status: 'Estado',
    price: 'Precio',
    currency: 'Moneda',
    purchaseDate: 'Fecha de compra',
    serialNumber: 'Número de serie',
    warranty: 'Garantía',
    warrantyExpiration: 'Vencimiento de garantía',
    location: 'Ubicación',
    sourceUrl: 'URL de compra',
    description: 'Descripción',
    notes: 'Notas',
    image: 'Imagen',
    favorite: 'Favorito',
    productLink: 'Enlace del Producto',
    basicInfo: 'Información Básica',
    multimedia: 'Enlaces y Multimedia',
    options: 'Opciones Adicionales',
    selectEquipmentType: '¿Qué tipo de equipamiento quieres añadir?',
    selectEquipmentTypeDescription: 'Selecciona el tipo de equipamiento para continuar',
    imagePreview: 'Vista previa de imagen',
    fillDetails: 'Completa los detalles',
    steps: {
      selectType: 'Seleccionar Tipo',
      fillDetails: 'Completar Detalles'
    },
    placeholders: {
      name: 'Ej: DJI FPV Drone',
      brand: 'Ej: DJI',
      model: 'Ej: FPV',
      price: '0.00',
      serialNumber: 'Ej: ABC123456',
      location: 'Ej: Caja de herramientas, Estante A',
      sourceUrl: 'https://...',
      description: 'Describe las características principales...',
      notes: 'Notas adicionales, estado, observaciones...',
      imageUrl: 'URL de la imagen del producto',
      productLink: 'https://tienda.com/producto',
      image: 'URL de la imagen del producto'
    },
    
    typePlaceholder: 'Selecciona un tipo'
  },
  
  warranty: {
    valid: 'Válida ({days} días restantes)',
    expiringSoon: 'Vence pronto ({days} días)',
    expired: 'Expirada'
  },
  
  validation: {
    nameRequired: 'El nombre es requerido',
    typeRequired: 'El tipo es requerido',
    conditionRequired: 'El estado es requerido',
    priceInvalid: 'El precio debe ser un número válido',
    dateInvalid: 'La fecha no es válida',
    urlInvalid: 'La URL no es válida'
  },
  
  success: {
    created: 'Equipamiento creado exitosamente',
    updated: 'Equipamiento actualizado exitosamente',
    deleted: 'Equipamiento eliminado exitosamente',
    favoriteAdded: 'Añadido a favoritos',
    favoriteRemoved: 'Removido de favoritos'
  },
  
  errors: {
    loadFailed: 'Error al cargar el equipamiento',
    saveFailed: 'Error al guardar el equipamiento',
    deleteFailed: 'Error al eliminar el equipamiento',
    toggleFavoriteFailed: 'Error al cambiar estado de favorito'
  }
}