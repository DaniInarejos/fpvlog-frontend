export default {
  // Títulos y navegación
  title: 'Spots',
  mySpots: 'Mis Spots',
  allSpots: 'Todos los Spots',
  favoriteSpots: 'Spots Favoritos',
  
  // Estados
  noSpots: 'No hay spots disponibles',
  noSpotsDescription: 'Aún no has creado ningún spot. ¡Crea tu primer spot para empezar!',
  addFirstSpot: 'Crear primer spot',
  showing: 'Mostrando {count} de {total} spots',
  
  // Acciones
  createSpot: 'Crear Spot',
  editSpot: 'Editar Spot',
  deleteSpot: 'Eliminar Spot',
  viewSpot: 'Ver Spot',
  addToFavorites: 'Añadir a favoritos',
  removeFromFavorites: 'Quitar de favoritos',
  
  // Propiedades del spot
  name: 'Nombre',
  description: 'Descripción',
  type: 'Tipo',
  difficulty: 'Dificultad',
  coordinates: 'Coordenadas',
  noLocation: 'Sin ubicación',
  
  // Visibilidad
  public: 'Público',
  private: 'Privado',
  followersOnly: 'Solo seguidores',
  
  // Tipos de spots
  types: {
    mountain: 'Montaña',
    beach: 'Playa',
    forest: 'Bosque',
    urban: 'Urbano',
    field: 'Campo',
    desert: 'Desierto',
    lake: 'Lago',
    river: 'Río',
    other: 'Otro'
  },
  
  // Dificultades
  difficulty: {
    title: 'Dificultad',
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
    expert: 'Experto'
  },
  
  // Estados legales
  legalStatus: {
    noRestrictions: 'Sin restricciones',
    restrictedZone: 'Zona restringida',
    prohibitedZone: 'Zona prohibida',
    notAnalyzed: 'No analizado',
    noRestrictionsDescription: 'Este spot no tiene restricciones aeronáuticas conocidas.',
    restrictedZoneDescription: 'Este spot está en una zona con restricciones aeronáuticas.',
    prohibitedZoneDescription: 'Este spot está en una zona prohibida para vuelos.',
    notAnalyzedDescription: 'El estado aeronáutico de este spot no ha sido analizado.'
  },
  
  // Formulario
  form: {
    title: 'Información del Spot',
    name: 'Nombre del spot',
    description: 'Descripción',
    location: 'Ubicación',
    selectLocation: 'Seleccionar ubicación',
    locationHelp: 'Haz clic en el mapa para seleccionar la ubicación del spot',
    legalStatus: 'Estado Legal',
    calculatingLegalStatus: 'Calculando estado legal...',
    visibility: 'Visibilidad',
    sections: {
      basic: 'Información Básica',
      location: 'Ubicación',
      privacy: 'Privacidad'
    },
    namePlaceholder: 'Nombre del spot',
    descriptionPlaceholder: 'Describe tu spot...',
    publicDescription: 'Visible para todos los usuarios',
    visibleToFollowersOnlyDescription: 'Solo visible para tus seguidores'
  },
  
  // Eliminación
  delete: {
    title: 'Eliminar Spot',
    confirmation: '¿Estás seguro de que quieres eliminar "{name}"?',
    success: 'Spot eliminado correctamente',
    error: 'Error al eliminar el spot'
  },
  
  // Mensajes de éxito/error
  created: 'Spot creado correctamente',
  updated: 'Spot actualizado correctamente',
  error: 'Error al procesar la solicitud'
}