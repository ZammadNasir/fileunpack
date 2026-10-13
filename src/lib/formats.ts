import { siteConfig } from "@/src/config/site";

export type SupportedExtension = (typeof siteConfig.supportedFormats)[number];
export type ViewerType = "3d" | "svg" | "unsupported";
export type FormatCategory = "3D" | "Vector";

export type FormatDefinition = {
  extension: SupportedExtension;
  name: string;
  category: FormatCategory;
  viewer: ViewerType;
  supported: true;
  description: string;
  accepts: string[];
  features: string[];
  whatIs: string;
  howToOpen: string;
  withoutSoftware: string;
  limitations?: string;
};

export const FORMAT_REGISTRY: Record<SupportedExtension, FormatDefinition> = {
  stl: {
    extension: "stl",
    name: "STL",
    category: "3D",
    viewer: "3d",
    supported: true,
    description:
      "Preview STL mesh files online with orbit controls, fit-to-view, and a solid or wireframe display.",
    accepts: [".stl"],
    features: ["Binary and ASCII STL loading", "Orbit, zoom, and reset controls", "Fit model to screen", "Solid and wireframe viewing", "Basic mesh information"],
    whatIs:
      "An STL file describes the surface of a 3D model as a collection of triangles. It is common in 3D printing, prototyping, machining, and exported CAD workflows.",
    howToOpen:
      "Choose an STL file from your device. The viewer reads the mesh in your browser and places it in a simple 3D scene that you can rotate, zoom, and reframe.",
    withoutSoftware:
      "Yes. For supported STL files, you can inspect the model in the browser without installing a slicer, CAD package, or 3D modeling app.",
  },
  obj: {
    extension: "obj",
    name: "OBJ",
    category: "3D",
    viewer: "3d",
    supported: true,
    description:
      "Open OBJ 3D models in a browser-based viewer with practical camera controls and clear file details.",
    accepts: [".obj"],
    features: ["OBJ geometry loading", "Orbit, zoom, and reset controls", "Fit model to screen", "Graceful handling for missing materials"],
    whatIs:
      "An OBJ file is a text-based 3D geometry format used by modeling, scanning, animation, and asset pipelines. It can reference separate material or texture files.",
    howToOpen:
      "Select an OBJ file and the viewer will parse the local geometry directly in your browser. You can then rotate, zoom, and fit the model to the canvas.",
    withoutSoftware:
      "Yes, basic OBJ geometry can be opened here without a modeling application. External MTL files and texture folders are not loaded in this MVP.",
    limitations:
      "This first version loads the OBJ geometry you select. If the file depends on separate MTL or texture assets, those materials may not appear.",
  },
  glb: {
    extension: "glb",
    name: "GLB",
    category: "3D",
    viewer: "3d",
    supported: true,
    description:
      "View self-contained GLB scenes online with a lightweight browser 3D previewer.",
    accepts: [".glb"],
    features: ["GLB scene loading", "Orbit, zoom, and reset controls", "Fit scene to screen", "Basic scene rendering"],
    whatIs:
      "A GLB file is the binary form of glTF. It can bundle geometry, materials, animations, and textures into one portable 3D asset.",
    howToOpen:
      "Choose a GLB file from your device. Because GLB usually contains its required assets, it is well suited to local browser viewing.",
    withoutSoftware:
      "Yes. Supported GLB files can be previewed in the browser without a dedicated 3D asset viewer.",
  },
  gltf: {
    extension: "gltf",
    name: "GLTF",
    category: "3D",
    viewer: "3d",
    supported: true,
    description:
      "Open GLTF 3D scene files online and inspect them with browser orbit controls.",
    accepts: [".gltf"],
    features: ["GLTF scene loading", "Orbit, zoom, and reset controls", "Fit scene to screen", "Clear note for external asset limits"],
    whatIs:
      "A GLTF file is a JSON-based 3D scene format often used on the web. It may reference separate binary buffers, images, or textures.",
    howToOpen:
      "Select a GLTF file to preview the scene in your browser. Self-contained data URIs work best in this MVP.",
    withoutSoftware:
      "Yes for simple or self-contained GLTF files. GLTF projects that rely on separate local assets may need a later multi-file upload flow.",
    limitations:
      "This MVP accepts one GLTF file at a time. External .bin files and texture folders are not reliably resolved yet.",
  },
  svg: {
    extension: "svg",
    name: "SVG",
    category: "Vector",
    viewer: "svg",
    supported: true,
    description:
      "Open SVG vector files safely with zoom, pan, fit-to-screen, and dimension details.",
    accepts: [".svg", "image/svg+xml"],
    features: ["Sandboxed SVG rendering", "Zoom, pan, reset, and fit controls", "Dimension detection", "Malformed-file error handling"],
    whatIs:
      "An SVG file is a vector image written in XML. It can describe icons, diagrams, logos, maps, charts, and interface artwork without losing sharpness when scaled.",
    howToOpen:
      "Choose an SVG file and the viewer sanitizes risky markup before displaying it in a sandboxed preview with zoom and pan controls.",
    withoutSoftware:
      "Yes. You can inspect SVG files in your browser without a vector design tool, while still treating the uploaded file as untrusted input.",
  },
};

export const SUPPORTED_FORMATS = Object.values(FORMAT_REGISTRY);

export function getExtension(filename: string) {
  const lastSegment = filename.split(/[\\/]/).pop() ?? filename;
  const dotIndex = lastSegment.lastIndexOf(".");
  if (dotIndex < 0 || dotIndex === lastSegment.length - 1) return "";
  return lastSegment.slice(dotIndex + 1).toLowerCase();
}

export function getFormatByExtension(extension: string) {
  const key = extension.toLowerCase();
  return key in FORMAT_REGISTRY ? FORMAT_REGISTRY[key as SupportedExtension] : undefined;
}

export function getFormatFromFile(file: File) {
  return getFormatByExtension(getExtension(file.name));
}

export function isSupportedExtension(value: string): value is SupportedExtension {
  return value in FORMAT_REGISTRY;
}

export function relatedFormats(current: SupportedExtension) {
  return SUPPORTED_FORMATS.filter((format) => format.extension !== current);
}
