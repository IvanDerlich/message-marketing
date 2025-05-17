"use client";

import styles from "./page.module.css";
import { FileUploaderContainer } from "@/components/FileUploader/FileUploaderContainer";

// Server page component
export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>GXR File Uploader</h1>
        <FileUploaderContainer />
      </main>
    </div>
  );
}
