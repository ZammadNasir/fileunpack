export const PROJECT_NAME = "File Unpack";

export const siteConfig = {
  name: PROJECT_NAME,
  domain: "fileunpack.com",
  url: "https://fileunpack.com",
  description: "Open uncommon files directly in your browser.",
  maxFileSizeMB: 100,
  supportedFormats: ["stl", "obj", "glb", "gltf", "svg"] as const,
};

export const MAX_FILE_SIZE_MB = siteConfig.maxFileSizeMB;
