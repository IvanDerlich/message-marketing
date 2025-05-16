export const siteConfig = {
  upload: {
    maxFileSizeMB: 2, // Maximum file size in megabytes
    allowedExtensions: ['.grx'],
  },
  // Add other site-wide configuration here
} ;

// Type-safe config access
export type SiteConfig = typeof siteConfig; 