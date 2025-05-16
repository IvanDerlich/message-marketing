export const siteConfig = {
  upload: {
    maxFileSizeMB: 2, // Maximum file size in megabytes
    maxFileNameLength: 100, // Maximum length of file name in characters
    allowedExtensions: [".gxr"], // Update extension to .gxr
  },
  // Add other site-wide configuration here
};

// Type-safe config access
export type SiteConfig = typeof siteConfig;
