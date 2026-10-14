export const PROJECT_NAME = "File Unpack";

export const siteConfig = {
  name: PROJECT_NAME,
  domain: "fileunpack.com",
  url: "https://fileunpack.com",
  description: "Open uncommon files directly in your browser.",
  tagline: "Open files without the software",
  version: "0.1.0",
  maxFileSizeMB: 100,
  supportedFormats: ["stl", "obj", "glb", "gltf", "svg"] as const,
};

export const MAX_FILE_SIZE_MB = siteConfig.maxFileSizeMB;
