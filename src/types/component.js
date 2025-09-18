/**
 * @typedef {Object} Component
 * @property {string} _id - ID único del componente
 * @property {string} name - Nombre del componente
 * @property {string} type - Tipo de componente (FRAME, MOTOR, FC, ESC, VTX, CAMERA, ANTENNA, RECEIVER, BATTERY, PROPS, MOUNT, OTHER)
 * @property {string} [brand] - Marca del componente
 * @property {number} [weight] - Peso en gramos
 * @property {string} [sourceUrl] - URL de compra
 * @property {string} [description] - Descripción del componente
 * @property {boolean} favorite - Indica si el componente está marcado como favorito
 * @property {string} [imageUrl] - URL de la imagen del componente
 * @property {string} createdBy - ID del usuario que creó el componente
 * @property {Date} createdAt - Fecha de creación
 * @property {Date} updatedAt - Fecha de última actualización
 */

/**
 * @typedef {Object} ComponentStats
 * @property {Object.<string, number>} byType - Estadísticas por tipo de componente
 * @property {Object.<string, number>} byBrand - Estadísticas por marca
 * @property {number} totalComponents - Total de componentes
 * @property {number} favoriteComponents - Total de componentes favoritos
 */

export {}