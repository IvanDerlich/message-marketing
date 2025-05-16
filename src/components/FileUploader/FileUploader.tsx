"use client";

import { useState, useRef } from "react";
import { z } from "zod";
import type { FileError } from "./types";
import { FILE_ERRORS } from "./constants";
import { Spinner } from "./Spinner";
import { siteConfig } from "@/config/site";
import styles from "./FileUploader.module.css";

// Convert size in MB to bytes
const mbToBytes = (mb: number) => mb * 1024 * 1024;

export interface FileUploaderProps {
  onFileSelect?: (file: File) => void;
  maxFileSize?: number; // in MB
  // @TODO: Add more props as needed:
  // - maxFileSize?: number
  // - allowedFileTypes?: string[]
  // - multiple?: boolean
  // - customValidation?: (file: File) => boolean
}

export function FileUploader({ onFileSelect, maxFileSize = siteConfig.upload.maxFileSizeMB }: FileUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<FileError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileSchema = z.custom<File>(
    file => file instanceof File,
    { message: FILE_ERRORS.INVALID_FILE }
  )
  .refine(
    file => file.size <= mbToBytes(maxFileSize),
    `El archivo debe ser menor a ${maxFileSize}MB`
  )
  .refine(
    file => file.name.endsWith('.gxr'),
    FILE_ERRORS.INVALID_TYPE
  )
  .refine(
    file => file.name.length <= siteConfig.upload.maxFileNameLength,
    FILE_ERRORS.FILENAME_TOO_LONG
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setError(null);

    if (!file) {
      return;
    }

    try {
      setIsLoading(true);
      fileSchema.parse(file);
      setSelectedFile(file);
      if (onFileSelect) {
        await onFileSelect(file);
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError({ message: err.errors[0].message, code: "invalid_type" });
      } else {
        setError({ message: FILE_ERRORS.UNKNOWN_ERROR, code: "unknown" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnselect = () => {
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.uploadArea}>
        <label className={styles.label} data-testid="file-input-label">
          <div className={styles.labelContent}>
            <span className={styles.labelText}>
              {selectedFile ? 'Cambiar archivo' : 'Seleccionar archivo GXR'}
            </span>
            {isLoading && <Spinner />}
          </div>
          <input
            type="file"
            onChange={handleFileChange}
            accept=".gxr"
            ref={fileInputRef}
            data-testid="file-input"
            className={styles.input}
            disabled={isLoading}
          />
        </label>
      </div>

      {selectedFile && (
        <div className={styles.fileInfo}>
          <span 
            className={styles.fileName} 
            data-tooltip={selectedFile.name}
            data-testid="file-name"
          >
            {selectedFile.name}
          </span>
          <button 
            onClick={handleUnselect} 
            className={styles.removeButton}
            data-testid="remove-file-button"
            disabled={isLoading}
          >
            Eliminar
          </button>
        </div>
      )}

      {error && (
        <div data-testid="error-message" className={styles.error}>
          {error.message}
        </div>
      )}
    </div>
  );
}
