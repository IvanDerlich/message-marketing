"use client";

import { FileUploader } from "./FileUploader";
import { siteConfig } from "@/config/site";

export function FileUploaderContainer() {
  return (
    <FileUploader 
      maxFileSize={siteConfig.upload.maxFileSizeMB}
      onFileSelect={(file) => {
        console.log('Selected file:', file.name);
      }}
    />
  );
} 