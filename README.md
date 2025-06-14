
# FPV Log - Frontend

🚁 **Aplicación web para el registro y gestión de vuelos FPV (First Person View)**

Una aplicación moderna desarrollada con Vue 3 y Vite que permite a los pilotos de drones FPV registrar, gestionar y analizar sus vuelos y equipos.

## 🌟 Características

### 📊 Dashboard Interactivo
- **Estadísticas en tiempo real**: Total de vuelos, tiempo acumulado, número de drones y fecha del último vuelo
- **Secciones colapsables**: Organización mejorada con secciones expandibles/contraíbles
- **Diseño responsivo**: Adaptado para dispositivos móviles y escritorio

### 🚁 Gestión de Drones
- **Registro completo**: Nombre, tipo, marca, modelo, número de serie, peso y descripción
- **Tipos soportados**: Racing, Freestyle, Cinematic, Micro, Whoops, Long Range
- **Operaciones CRUD**: Crear, leer, actualizar y eliminar drones
- **Modal inteligente**: Cierre solo con botón X o doble clic fuera del modal

### ✈️ Registro de Vuelos
- **Información detallada**: Título, drone utilizado, ubicación, fecha, duración
- **Condiciones meteorológicas**: Registro de condiciones climáticas
- **Notas personalizadas**: Espacio para observaciones adicionales
- **Vinculación con drones**: Asociación automática con el equipo utilizado

### 👤 Gestión de Usuario
- **Autenticación completa**: Login y registro de usuarios
- **Perfil personalizable**: Gestión de información personal
- **Cambio de contraseña**: Funcionalidad segura de actualización
- **Persistencia de sesión**: Mantenimiento del estado de login

## 🛠️ Tecnologías Utilizadas

- **Frontend Framework**: Vue 3 con Composition API
- **Build Tool**: Vite
- **Routing**: Vue Router 4
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Styling**: CSS modular con variables CSS personalizadas


## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd fpvlog-frontend
   ```
2. **Instalar dependencias**
   ```bash
   npm install
   ```
3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   ```
4. **Ejecutar la aplicación**
   ```bash
   npm run dev
   ```
5. **Acceder a la aplicación**
   - Abre tu navegador web y visita `http://localhost:5173`
   - Inicia sesión con tu cuenta o regístrate si es la primera vez
6. **Explora la aplicación**
   - Registra drones y vuelos
   - Utiliza las secciones colapsables para una navegación más organizada
   - Explora las estadísticas en tiempo real en el dashboard

   ## 🎨 Características de Diseño
### Sistema de Colores
- Paleta Sky : Tonos azules inspirados en el cielo
- Gradientes : Efectos visuales modernos
- Transparencias : Uso de backdrop-filter para efectos glassmorphism
### Responsividad
- Mobile First : Diseño optimizado para dispositivos móviles
- Breakpoints : Adaptación fluida a diferentes tamaños de pantalla
- Componentes flexibles : Layouts que se adaptan automáticamente
### Interactividad
- Animaciones suaves : Transiciones CSS para mejor UX
- Estados hover : Feedback visual en elementos interactivos
- Modales inteligentes : Comportamiento personalizado de cierre
## 🔧 Funcionalidades Técnicas
### Gestión de Estado
- Pinia Store : Estado global reactivo
- Persistencia : Mantenimiento de sesión en localStorage
- Composables : Lógica reutilizable (pendiente de implementación)
### API Integration
- Axios : Cliente HTTP configurado
- Interceptors : Manejo automático de tokens
- Error Handling : Gestión centralizada de errores
### Routing
- Rutas protegidas : Autenticación requerida para ciertas páginas
- Navegación programática : Redirecciones automáticas
- Guards : Validación de acceso a rutas
## 📱 Uso de la Aplicación
### Primer Uso
1. Registro : Crear una cuenta nueva
2. Login : Iniciar sesión con credenciales
3. Añadir Drone : Registrar tu primer drone
4. Registrar Vuelo : Documentar tu primera sesión de vuelo
### Flujo Típico
1. Dashboard : Revisar estadísticas y actividad reciente
2. Gestión : Añadir/editar drones y vuelos
3. Análisis : Revisar patrones y tendencias de vuelo
## 🔮 Roadmap
### Próximas Características
- Composables : Refactorización de lógica a composables
- Gráficos : Visualización de estadísticas avanzadas
- Exportación : Funcionalidad de exportar datos
- Mapas : Integración con mapas para ubicaciones
- Fotos : Galería de imágenes por vuelo
### Mejoras Técnicas
- Testing : Implementación de tests unitarios
- PWA : Conversión a Progressive Web App
- Optimización : Lazy loading y code splitting
- Accesibilidad : Mejoras en a11y

## 📄 Licencia
Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para detalles.

## 👨‍💻 Autor
Desarrollado con ❤️ para la comunidad FPV