// Move this file to the file handling folder when the folder is created

export interface FileError {
  message: string;
  code: "invalid_type" | "invalid_size" | "unknown";
}
