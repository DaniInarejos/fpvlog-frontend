export default {
  title: 'Grupos',
  topicsn: 'Temas',
  subtitle: 'Conecta con otros pilotos de FPV',
  createGroup: 'Crear Grupo',
  editGroup: 'Editar Grupo',
  joinGroup: 'Unirse al grupo',
  leaveGroup: 'Abandonar Grupo',
  join: 'Unirse',
  leave: 'Abandonar',
  requestJoin: 'Solicitar Unirse',
  sendRequest: 'Enviar Solicitud',
  pending: 'Pendiente',
  public: 'Público',
  private: 'Privado',
  joinAndComment: 'Únete al grupo para participar en discusiones y comentar en los temas',
  memberCount: '{count} miembro | {count} miembros',
  createdBy: 'Creado por {owner}',
  owner: 'Propietario',
  description: 'Descripción',
  privacy: 'Privacidad',
  createdAt: 'Creado el',
  deleteGroup: 'Eliminar Grupo',
deleteConfirmation: '¿Estás seguro de que quieres eliminar el grupo "{name}"?',
deleteWarning: 'Esta acción no se puede deshacer. Se eliminarán todos los topics, comentarios y miembros.',
confirmDelete: 'Sí, Eliminar',
tags: 'Etiquetas',

  // Agregar la sección de roles faltante
  roles: {
    owner: 'Propietario',
    admin: 'Administrador',
    member: 'Miembro',
    pending: 'Pendiente',
    banned: 'Baneado'
  },
  // Nuevas traducciones que faltan
  notFound: 'Grupo no encontrado',
  posts: 'Posts',
  requestPending: 'Solicitud Pendiente',
  manageMembers: 'Gestionar Miembros',
  privateGroupMessage: 'Este es un grupo privado. Solicita unirte para ver el contenido.',
  createPost: 'Crear Post',
  joinConfirmation: '¿Estás seguro de que quieres unirte al grupo "{name}"?',
  leaveConfirmation: '¿Estás seguro de que quieres abandonar el grupo "{name}"?',
  
  tabs: {
    all: 'Todos',
    myGroups: 'Mis Grupos',
    joined: 'Unidos',
    public: 'Públicos',
    private: 'Privados'
  },
  
  detail: {
    view: 'Ver',
    tabs: {
      topics: 'Temas',
      posts: 'Posts', // Nueva traducción
      about: 'Acerca de',
      members: 'Miembros'
    },
    newPost: 'Nuevo Post',
    accessDenied: 'Este es un grupo privado. Solicita unirte para ver el contenido del grupo.',
    joinMessage: '¿Estás seguro de que quieres unirte a este grupo?',
    requestJoinMessage: 'Tu solicitud será enviada a los administradores del grupo para su aprobación.',
    leaveMessage: '¿Estás seguro de que quieres abandonar este grupo?',
    about: 'Acerca del grupo'
  },
  
  // Nueva sección about
  about: {
    description: 'Descripción',
    noDescription: 'Sin descripción disponible',
    rules: 'Reglas del Grupo',
    details: 'Detalles',
    created: 'Creado',
    privacy: 'Privacidad'
  },
  
  topicsCount: 'temas',
  topics: {
    title: 'Temas',
    createTopic: 'Crear Tema',
    editTopic: 'Editar Tema',
    postCount: '{count} posts',
    lastActivity: 'Última actividad',
    by: 'por',
    pin: 'Fijar',
    unpin: 'Desfijar',
    confirmDelete: '¿Estás seguro de que quieres eliminar el tema "{title}"?',
    deleteTitle: 'Eliminar Topic',
    deleteConfirmation: '¿Estás seguro de que quieres eliminar el topic "{title}"?',
    comments: 'Comentarios',
    noComments: 'Aún no hay comentarios. ¡Sé el primero en comentar!',
    addComment: 'Agregar Comentario',
    commentPlaceholder: 'Escribe tu comentario aquí...',
    postComment: 'Publicar Comentario',
    createdBy: 'Creado por',
    pinned: 'Fijado',
    validation: {
      titleRequired: 'El título es requerido'
    },
    empty: {
      title: 'Aún no hay temas',
      description: 'Sé el primero en crear un tema de discusión para este grupo.'
    },
    form: {
      title: 'Título',
      titlePlaceholder: 'Ingresa el título del tema...',
      description: 'Descripción',
      descriptionPlaceholder: 'Describe de qué trata este tema...',
      pinTopic: 'Fijar este tema'
    }
  },
  
  comments: {
    placeholder: 'Escribe un comentario...',
    post: 'Comentar',
    reply: 'Responder',
    replyPlaceholder: 'Escribe una respuesta...',
    edited: 'editado',
    confirmDelete: '¿Estás seguro de que quieres eliminar este comentario?',
    empty: 'Aún no hay comentarios. ¡Sé el primero en comentar!',
    showReplies: 'Ver {count} respuestas',
    addComment: 'Agregar Comentario',
    writeComment: 'Escribe un comentario...',
    comment: 'Comentar'
  },
  
  posts: {
    title: 'Posts',
    create: 'Crear Post',
    edit: 'Editar Post',
    content: 'Contenido',
    tags: 'Etiquetas',
    tagsPlaceholder: 'Separar con comas',
    validation: {
      titleRequired: 'El título es requerido',
      contentRequired: 'El contenido es requerido'
    }
  },
  
  search: {
    placeholder: 'Buscar grupos...'
  },
  
  empty: {
    title: 'No hay grupos',
    description: 'Sé el primero en crear un grupo'
  },
  
  // Nueva sección delete
  delete: {
    confirmation: '¿Estás seguro de que quieres eliminar el grupo "{name}"?'
  },
  
  noPosts: 'No hay publicaciones',
  noPostsDescription: 'Sé el primero en compartir algo en este grupo.',
  writeComment: 'Escribe un comentario...',
  comment: 'Comentar',
  members: 'Miembros',
  inviteMembers: 'Invitar miembros',
  admin: 'Administrador',
  moderator: 'Moderador',
  member: 'Miembro',
  joinedOn: 'Se unió el',
  removeMember: 'Eliminar miembro',
  noMembers: 'No hay miembros en este grupo',
  joinRequests: 'Solicitudes de unión',
  requestedOn: 'Solicitó el',
  approve: 'Aprobar',
  reject: 'Rechazar',
  usernameOrEmail: 'Usuario o email',
  enterUsernameOrEmail: 'Ingresa un nombre de usuario o email',
  sendInvite: 'Enviar invitación',
  confirmRemoveMember: '¿Estás seguro de que quieres eliminar a {username} del grupo?',
  
  // Agregar esta sección form que falta
  form: {
    name: 'Nombre del Grupo',
    namePlaceholder: 'Ingresa el nombre del grupo',
    description: 'Descripción',
    descriptionPlaceholder: 'Describe de qué trata tu grupo',
    isPrivate: 'Grupo Privado',
    isPrivateDescription: 'Los grupos privados requieren aprobación para unirse',
    tags: 'Etiquetas',
    tagsPlaceholder: 'Agregar etiqueta',
    addTag: 'Agregar',
    tagsHelp: '{count} de {max} etiquetas'
  },
  
  // También agregar la sección validation que falta
  validation: {
    nameRequired: 'El nombre del grupo es requerido',
    nameTooLong: 'El nombre no puede exceder 100 caracteres',
    descriptionRequired: 'La descripción es requerida',
    descriptionTooLong: 'La descripción no puede exceder 500 caracteres',
    tooManyTags: 'Máximo 10 etiquetas permitidas'
  },
  
  // Y la sección messages
  messages: {
    created: 'Grupo creado exitosamente',
    updated: 'Grupo actualizado exitosamente',
    deleted: 'Grupo eliminado exitosamente',
    joined: 'Te has unido al grupo',
    left: 'Has abandonado el grupo',
    requestSent: 'Solicitud enviada, esperando aprobación'
  },
}