"use client";

import { FileUploader } from "./FileUploader";
import { siteConfig } from "@/config/site";

export function FileUploaderContainer() {
  const handleFileSelect = async (file: File) => {
    // Simulate file upload delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Selected file:', file.name);
  };

  return (
    <FileUploader 
      maxFileSize={siteConfig.upload.maxFileSizeMB}
      onFileSelect={handleFileSelect}
    />
  );
} 