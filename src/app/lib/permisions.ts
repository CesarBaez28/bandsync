/**
 * Centralized definition of user permissions.
 */
export const UserPermissions = {
  // =========================
  // Members (Integrantes)
  // =========================
  VIEW_MEMBERS: 'Visualizar integrantes',
  ADD_MEMBER: 'Agregar integrante',
  UPDATE_MEMBER: 'Modificar integrante',
  DELETE_MEMBER: 'Eliminar integrante',

  // =========================
  // Repertoires (Repertorio)
  // =========================
  ADD_REPERTOIRE: 'Agregar repertorio',
  UPDATE_REPERTOIRE: 'Modificar repertorio',
  DELETE_REPERTOIRE: 'Eliminar repertorio',

  // =========================
  // Events (Eventos)
  // =========================
  ADD_EVENT: 'Agregar evento',
  UPDATE_EVENT: 'Modificar evento',
  DELETE_EVENT: 'Eliminar evento',

  // =========================
  // Artists (Artistas)
  // =========================
  ADD_ARTIST: 'Agregar artista',
  UPDATE_ARTIST: 'Modificar artista',
  DELETE_ARTIST: 'Eliminar artista',

  // =========================
  // Songs (Canciones)
  // =========================
  ADD_SONG: 'Agregar cancion',
  UPDATE_SONG: 'Modificar cancion',
  DELETE_SONG: 'Eliminar cancion',

  // =========================
  // Roles & Permissions
  // =========================
  VIEW_ROLES_AND_PERMISSIONS: 'Visualizar roles y permisos',
  ASSIGN_ROLE: 'Asignar rol',
  ADD_ROLE: 'Agregar rol',
  UPDATE_ROLE: 'Modificar rol',
  DELETE_ROLE: 'Eliminar rol',

  // =========================
  // Musical Genres (Géneros musicales)
  // =========================
  ADD_MUSICAL_GENRE: 'Agregar género musical',
  UPDATE_MUSICAL_GENRE: 'Modificar género musical',
  DELETE_MUSICAL_GENRE: 'Eliminar género musical',

  // =========================
  // Musical Roles (Roles musicales)
  // =========================
  ADD_MUSICAL_ROLE: 'Agregar rol musical',
  UPDATE_MUSICAL_ROLE: 'Modificar rol musical',
  DELETE_MUSICAL_ROLE: 'Eliminar rol musical',

  // =========================
  // Musical Bands (Bandas musicales)
  // =========================
  UPDATE_BAND: 'Editar Banda',
  DELETE_BAND: 'Eliminar Banda',
} as const;

export type UserPermission = typeof UserPermissions[keyof typeof UserPermissions];