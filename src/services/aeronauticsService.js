import api from './api'

const aeronauticsService = {
  /**
   * Obtiene datos de zonas aeronáuticas de España
   * Los datos se cachean durante 1 semana para optimizar el rendimiento
   * @returns {Promise} Promesa que resuelve con los datos de zonas aeronáuticas
   */
  async getAeronauticsData() {
    try {
      const response = await api.get('/aeronautics', {
        headers: {
          'Accept': 'application/json'
          // Removido 'Accept-Encoding' - el navegador lo maneja automáticamente
        },
        // Configuración para manejar respuesta binaria
        responseType: 'arraybuffer', // Recibir como buffer binario
        decompress: true
      })
      
      // Convertir el buffer binario a string y luego parsear a JSON
      const textData = new TextDecoder('utf-8').decode(response)
      const jsonData = JSON.parse(textData)
      
      console.log('Datos aeronáuticos obtenidos:', {
        source: jsonData.source,
        cachedAt: jsonData.cachedAt,
        featuresCount: jsonData.data?.features?.length || 0
      })
      
      return jsonData
    } catch (error) {
      console.error('Error obteniendo datos aeronáuticos:', error)
      
      // Si falla el parsing, intentar como texto plano
      if (error.name === 'SyntaxError') {
        console.warn('Error de parsing JSON, intentando como texto plano')
        try {
          const textResponse = await api.get('/aeronautics', {
            headers: {
              'Accept': 'application/json',
              'Accept-Encoding': 'gzip, deflate, br'
            },
            responseType: 'text',
            decompress: true
          })
          
          return JSON.parse(textResponse)
        } catch (fallbackError) {
          console.error('Error en fallback:', fallbackError)
          throw fallbackError
        }
      }
      
      throw error
    }
  },

  /**
   * Refresca datos de zonas aeronáuticas manualmente
   * Fuerza la actualización desde la API de ENAIRE, limpiando el cache existente
   * @returns {Promise} Promesa que resuelve con los datos actualizados
   */
  async refreshAeronauticsData() {
    try {
      const response = await api.post('/aeronautics/refresh', {}, {
        headers: {
          'Accept': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br'
        },
        responseType: 'arraybuffer', // Recibir como buffer binario
        decompress: true
      })
      
      // Convertir el buffer binario a string y luego parsear a JSON
      const textData = new TextDecoder('utf-8').decode(response)
      const jsonData = JSON.parse(textData)
      
      console.log('Datos aeronáuticos actualizados:', {
        message: jsonData.message,
        cachedAt: jsonData.cachedAt,
        featuresCount: jsonData.data?.features?.length || 0
      })
      
      return jsonData
    } catch (error) {
      console.error('Error actualizando datos aeronáuticos:', error)
      
      // Si falla el parsing, intentar como texto plano
      if (error.name === 'SyntaxError') {
        console.warn('Error de parsing JSON en refresh, intentando como texto plano')
        try {
          const textResponse = await api.post('/aeronautics/refresh', {}, {
            headers: {
              'Accept': 'application/json',
              'Accept-Encoding': 'gzip, deflate, br'
            },
            responseType: 'text',
            decompress: true
          })
          
          return JSON.parse(textResponse)
        } catch (fallbackError) {
          console.error('Error en fallback refresh:', fallbackError)
          throw fallbackError
        }
      }
      
      throw error
    }
  }
}

export default aeronauticsService