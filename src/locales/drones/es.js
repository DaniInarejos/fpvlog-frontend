export default {
  title: 'Mis Drones',
  addDrone: 'Añadir Drone',
  editDrone: 'Editar Drone',
  newDrone: 'Nuevo Drone',
  noDrones: 'Aún no tienes ningún drone registrado',
  details: 'Detalles',
  location: 'Ubicación',
  description: 'Descripción',
  visibility: 'Visibilidad',
  form: {
    name: 'Nombre',
    type: 'Selecciona un estilo',
    brand: 'Selecciona una marca',
    brandName: 'Marca',
    model: 'Modelo',
    serialNumber: 'Número de Serie',
    weight: 'Peso (g)',
    frameSize: 'Tamaño del marco (mm)',
    frame: 'Marco',
    description: 'Descripción',
    notes: 'Notas',
    image: 'Imagen del Drone',
    droneImage: 'Drone Image',
    visibility: {
      followers: 'Visible para seguidores',
      public: 'Público'
    },
    components: 'Componentes',
    originType: 'Tipo de Origen'
  },
  validation: {
    name: 'El nombre es requerido',
    type: 'El tipo de drone es requerido',
    brand: 'La marca es requerida',
    model: 'El modelo es requerido',
    serialNumber: 'El número de serie es requerido',
    weight: 'El peso es requerido',
    frameSize: 'El tamaño del frame es requerido'
  },
  delete: {
    title: 'Eliminar Drone',
    confirmation: '¿Estás seguro de que quieres eliminar el drone "{name}"? Esta acción no se puede deshacer.'
  },
  specs: {
    weight: 'peso',
    frame: 'frame'
  }
}