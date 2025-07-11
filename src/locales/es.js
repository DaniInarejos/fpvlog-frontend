export default {
  message: {
    nav: {
      home: 'Inicio',
      flights: 'Vuelos',
      drones: 'Drones',
      profile: 'Perfil',
      dashboard: 'Panel de Control',
      logout: 'Cerrar Sesión',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      about: 'Acerca de',
      myData: 'Mis Datos',
      droneBrands: 'Marcas de Drones',
      droneTypes: 'Tipos de Drones',
      followers: 'Seguidores',
      following: 'Seguidos',
      feed: 'Novedades',
      components: 'Componentes',
      spots: 'Spots'
    },
    common: {
      loading: 'Cargando...',
      error: 'Ha ocurrido un error',
      success: 'Operación exitosa',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      select: 'Seleccionar',
      likes:"Me gustas"
    },
    about: {
      title: 'Acerca de SkySphere',
      description: 'SkySphere es un proyecto personal diseñado específicamente para la comunidad de pilotos de drones FPV. La plataforma proporciona todas las herramientas necesarias para documentar, gestionar y compartir tus experiencias de vuelo, está en continuo desarrollo y se irán añadiendo nuevas características.',
      mainFeatures: 'Características Principales',
      features: {
        flights: 'Registro detallado de vuelos con información de ubicación y condiciones',
        drones: 'Gestión completa de tu flota de drones',
        community: 'Comunidad activa de pilotos FPV',
        share: 'Compartir experiencias y aprender de otros pilotos',
        interface: 'Interfaz intuitiva y moderna'
      },
      technologies: 'Tecnologías Utilizadas',
      techs: {
        vue: 'Vue.js 3 con Composition API',
        tailwind: 'Tailwind CSS',
        vite: 'Vite',
        claude: 'Claude-3.5 IA',
        backend: 'Bunjs + hono Backend',
        database: 'MongoDB Atlas + Redis Upstash'
      },
      performanceNote: 'El proyecto está desplegado en tiers gratuitos. Si experimenta alguna demora en la respuesta, esto puede deberse a que el backend está inicializando una nueva instancia.',
      developer: {
        title: 'Sobre el Desarrollador',
        name: 'Daniel Inarejos Aroca',
        nickname: 'aunque mis amigos me llaman Danico',
        description: 'Soy un desarrollador de software con más de 12 años de experiencia y entusiasta de los drones FPV. Creé SkySphere para resolver la necesidad de tener una plataforma moderna y completa para la comunidad de pilotos FPV.',
        motivation: 'Como piloto de FPV, entiendo las necesidades específicas de nuestra comunidad y trabajo constantemente para mejorar esta plataforma con nuevas características y mejoras.',
        contact: 'Contacto y Redes Sociales'
      }
    },
    drones: {
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
        components:'Componentes',
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
    },
    flights: {
      title: 'Mis Vuelos',
      addFlight: 'Añadir Vuelo',
      editFlight: 'Editar Vuelo',
      newFlight: 'Nuevo Vuelo',
      noFlights: 'Aún no tienes ningún vuelo registrado',
      form: {
        title: 'Título',
        date: 'Fecha',
        drone: 'Selecciona un drone',
        location: 'Ubicación',
        duration: 'Duración (segundos)',
        batteryUsed: 'Baterías Usadas',
        weather: 'Clima',
        notes: 'Notas',
        image: 'Imagen del Vuelo',
        visibility: {
          followers: 'Visible para seguidores',
          public: 'Público'
        },
        spot:'Spot',
        urlVideo: 'Link a youtube',
        sections: {
          media: 'Imagen',
          basic: 'Informacion Basica', 
          privacy: 'Privacidad'
        }
      },
      validation: {
        title: 'El título es requerido',
        date: 'La fecha es requerida',
        location: 'La ubicación es requerida',
        duration: 'La duración es requerida',
        batteryUsed: 'El número de baterías es requerido',
        droneId: 'El drone es requerido',
        image: 'Error al subir la imagen del vuelo'
      },
      details: {
        drone: 'Drone',
        date: 'Fecha',
        batteryUsed: 'Baterias usadas',
        likes: "Me gustas",
        weather: "Clima",
        notes: 'Notas',
        visibility: 'Visibilidad',
        location: 'Ubicación',
        duration: 'duración',
        batteries: 'baterías',
        notSpecified: 'No especificado',
        viewDrone: 'Ver detalles del drone'
      },
      delete: {
        title: 'Eliminar Vuelo',
        confirmation: '¿Estás seguro de que quieres eliminar el vuelo "{title}"? Esta acción no se puede deshacer.'
      }
    },
    following: {
      title: 'Siguiendo',
      searchPlaceholder: 'Buscar por username...',
      noUsersFound: 'No se encontraron usuarios',
      noFollowing: 'No sigues a ningún usuario aún',
      unfollowButton: 'Dejar de seguir',
      followedSince: 'Seguido desde',
      error: {
        loading: 'Error cargando usuarios seguidos',
        unfollow: 'Error al dejar de seguir al usuario',
        userNotFound: 'Usuario no encontrado'
      }
    },
    followers: {
      title: 'Seguidores',
      total: 'Total',
      subtitle: "Revisa todos los follows",
      searchPlaceholder: 'Buscar por username...',
      noUsersFound: 'No se encontraron usuarios',
      noFollowers: 'No tienes seguidores aún',
      followsSince: 'Te sigue desde',
      error: {
        loading: 'Error cargando seguidores',
        userNotFound: 'Usuario no encontrado'
      }
    },
    dashboard: {
      error: {
        loading: 'Error cargando el dashboard',
        userNotFound: 'Usuario no encontrado',
        followError: 'Error al seguir',
        unfollowError: 'Error al dejar de seguir'
      },
      stats: {
        drones: 'Drones',
        flights: 'Vuelos',
        followers: 'Seguidores',
        following: 'Siguiendo'
      },
      recentFlights: {
        title: 'Vuelos',
        noFlights: 'No hay vuelos ',
        duration: 'min',
        location: 'Ubicación'
      },
      drones: {
        title: 'Drones',
        noDrones: 'No hay drones registrados'
      },
      follow: {
        follow: 'Seguir',
        unfollow: 'Dejar de seguir'
      }
    },
    home: {
      error: {
        loading: 'Error cargando datos del perfil'
      },
      profile: {
        bio: 'Piloto FPV apasionado por los drones',
        followers: 'Seguidores',
        following: 'Siguiendo',
        feed: 'Feed'
      },
      stats: {
        totalTime: 'Tiempo Total',
        flights: 'Vuelos',
        drones: 'Drones',
        averageTime: 'Tiempo Promedio'
      },
      sections: {
        myDrones: 'Mis Drones',
        recentFlights: 'Últimos Vuelos'
      },
      time: {
        hours: 'h',
        minutes: 'm'
      }
    },
    feed: {
      drone:{title:'Drone'},
      description: 'Descripción',
      title: 'Novedades',
      globalFeed:'Global',
      followingFeed:'Seguidos',
      subtitle: 'Descubre las ultimas novedades de la comunidad',
      error: {
        loading: 'Error al cargar el novedades'
      },
      noMoreContent: 'No hay más contenido para mostrar',
      itemInfo: {
        location: 'Ubicación',
        duration: 'Duración',
        weather: 'Clima',
        weight: 'Peso',
        type: 'Tipo',
        brand: 'Marca',
        model:"Modelo",
        frameSize:"Tamaño de marco",
        newUser: 'Nuevo usuario',
        joinedAt: 'Se unió el',
        likes: 'Me gusta',
        noLikes: 'Sin me gusta'
      }
    },
    profile: {
      title: 'Mi Perfil',
      uploadPhoto: 'Cambiar foto',
      stats: {
        flights: 'Vuelos',
        followers: 'Seguidores',
        following: 'Siguiendo'
      },
      form: {
        username: 'Nombre de usuario',
        name: 'Nombre',
        lastName: 'Apellido',
        email: 'Correo electrónico',
        saveChanges: 'Guardar Cambios'
      },
      privacy: {
        title: 'Privacidad',
        allowFlights: 'Permitir que seguidores vean mis vuelos',
        allowDrones: 'Permitir que seguidores vean mis drones',
        profileVisibility: 'Visibilidad del perfil',
        types: {
          frame: 'Frame',
          motor: 'Motor',
          flightController: 'Controladora de Vuelo',
          esc: 'ESC',
          vtx: 'VTX',
          camera: 'Cámara',
          antenna: 'Antena',
          receiver: 'Receptor',
          battery: 'Batería',
          props: 'Hélices',
          mount: 'Soporte',
          other: 'Otro'
        },
        validation: {
          required: 'Este componente es requerido',
          invalid: 'Componente inválido'
        },
        select: {
          placeholder: 'Seleccionar componente'
        }
      },
      messages: {
        updateSuccess: 'Perfil actualizado correctamente',
        updateError: 'Error actualizando perfil',
        loadError: 'Error cargando perfil',
        photoError: 'Error subiendo la foto de perfil'
      }
    },
    components: {
      title: 'Componentes',
      addComponent: 'Añadir Componente',
      noComponentsOfType: 'No hay componentes de este tipo',
      selectType: 'Seleccionar Tipo de Componente',
      types: {
        frame: 'Marco',
        motor: 'Motor',
        flightController: 'Controlador de Vuelo',
        esc: 'ESC',
        vtx: 'VTX',
        camera: 'Cámara',
        antenna: 'Antena',
        receiver: 'Receptor',
        battery: 'Batería',
        props: 'Hélices',
        mount: 'Montaje',
        other: 'Otros'
      },
      form: {
        name: 'Nombre',
        brand: 'Marca',
        weight: 'Peso (g)',
        sourceUrl: 'URL de compra',
        description: 'Descripción'
      },
      validation: {
        name: 'El nombre es requerido'
      }
    },
    spots: {
    title: 'Mis Spots',
    addSpot: 'Añadir Spot',
    editSpot: 'Editar Spot',
    createSpot: 'Crear Spot',
    deleteSpot: 'Eliminar Spot',
    noSpots: 'Aún no tienes ningún spot registrado',
    deleteConfirmation: '¿Estás seguro de que quieres eliminar el spot "{name}"? Esta acción no se puede deshacer.',
    public: 'Público',
    followersOnly: 'Solo seguidores',
    private: 'Privado',
    details: 'Detalles',
    location: 'Ubicación',
    description: 'Descripción',
    visibility: 'Visibilidad',
    form: {
      name: 'Nombre',
      description: 'Descripción',
      location: 'Ubicación',
      searchLocation: 'Buscar ubicación...',
      visibility: 'Visibilidad',
      public: 'Público',
      visibleToFollowersOnly: 'Visible solo para seguidores',
      create: 'Crear Spot'
    },
    delete: {
      title: 'Eliminar Spot',
      confirmation: '¿Estás seguro de que quieres eliminar el spot "{name}"? Esta acción no se puede deshacer.',
      success: 'Spot eliminado correctamente',
      error: 'Error eliminando spot'
    
    },
          map:{
            restrictedZone: "Restricted Zone",
            limitedZone: 'Limited Zone',
            allowedZone: 'Allowed Zone'
          }

  }
  }
}
