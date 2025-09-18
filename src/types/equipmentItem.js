/**
 * @typedef {Object} EquipmentItem
 * @property {string} _id - ID único del equipmentItem
 * @property {string} name - Nombre del equipmentItem
 * @property {string} type - Tipo del equipmentItem (DRONE, RADIO, GOGGLES, BATTERY, CHARGER, OTHERS)
 * @property {string} [brand] - Marca del equipmentItem
 * @property {string} [model] - Modelo específico
 * @property {number} [price] - Precio en la moneda local
 * @property {string} [currency] - Moneda (EUR, USD, etc.)
 * @property {string} [sourceUrl] - URL de compra
 * @property {string} [description] - Descripción del equipmentItem
 * @property {boolean} favorite - Indica si el equipmentItem está marcado como favorito
 * @property {string} [imageUrl] - URL de la imagen del equipmentItem
 * @property {string} [condition] - Estado del equipmentItem (NEW, USED, REFURBISHED)
 * @property {Date} [purchaseDate] - Fecha de compra
 * @property {string} [serialNumber] - Número de serie
 * @property {Object} [specifications] - Especificaciones técnicas específicas por tipo
 * @property {string} createdBy - ID del usuario que creó el equipmentItem
 * @property {Date} createdAt - Fecha de creación
 * @property {Date} updatedAt - Fecha de última actualización
 */

/**
 * @typedef {Object} EquipmentItemStats
 * @property {Object.<string, number>} byType - Estadísticas por tipo de equipmentItem
 * @property {Object.<string, number>} byBrand - Estadísticas por marca
 * @property {Object.<string, number>} byCondition - Estadísticas por condición
 * @property {number} totalEquipmentItems - Total de equipmentItems
 * @property {number} favoriteEquipmentItems - Total de equipmentItems favoritos
 * @property {number} totalValue - Valor total estimado de todos los equipmentItems
 */

/**
 * Tipos disponibles para equipmentItems
 */
export const EQUIPMENT_TYPES = {
  DRONE: 'DRONE',           // Drones
  RADIO: 'RADIO',           // Radios/Transmisores
  GOGGLES: 'GOGGLES',       // Gafas FPV
  BATTERY: 'BATTERY',       // Baterías
  CHARGER: 'CHARGER',       // Cargadores
  OTHERS: 'OTHERS'          // Otros
}

/**
 * Condiciones disponibles para equipmentItems
 */
export const EQUIPMENT_CONDITIONS = {
  NEW: 'NEW',               // Nuevo
  USED: 'USED',             // Usado
  REFURBISHED: 'REFURBISHED' // Reacondicionado
}

export {}