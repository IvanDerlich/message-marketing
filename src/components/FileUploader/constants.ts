export const FILE_ERRORS = {
  INVALID_FILE: 'Archivo inválido',
  FILE_TOO_LARGE: 'El archivo debe ser menor a 5MB',
  INVALID_TYPE: 'Solo se permiten archivos .gxr',
  FILENAME_TOO_LONG: 'El nombre del archivo es demasiado largo',
  UNKNOWN_ERROR: 'Ha ocurrido un error desconocido',
} as const;

export const FILE_CONSTRAINTS = {
  MAX_FILENAME_LENGTH: 100,
} as const; 