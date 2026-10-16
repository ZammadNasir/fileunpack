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
  faqs: Array<{ question: string; answer: string }>;
  relatedFormats: SupportedExtension[];
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
    faqs: [
      {
        question: "What is the difference between binary and ASCII STL?",
        answer: "Binary STL files are more compact and faster to load, while ASCII STL files are human-readable text. Both contain the same mesh data in different formats.",
      },
      {
        question: "Can I edit the STL file in this viewer?",
        answer: "No, this viewer is for inspection only. To edit STL files, you'll need a 3D modeling application like Blender, MeshLab, or CAD software.",
      },
      {
        question: "Why does my STL look faceted or low-resolution?",
        answer: "STL files only store surface triangles, not smooth curves. The resolution depends on how the model was originally exported. Higher triangle counts produce smoother surfaces.",
      },
      {
        question: "Are STL files suitable for 3D printing?",
        answer: "Yes, STL is the most common format for 3D printing. However, you may need to check for holes, non-manifold geometry, or scale issues before printing.",
      },
    ],
    relatedFormats: ["obj", "glb", "gltf"],
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
    faqs: [
      {
        question: "Why does my OBJ model appear without colors or textures?",
        answer: "OBJ files often reference separate MTL material files and texture images. This viewer loads the geometry but does not currently parse external material references.",
      },
      {
        question: "What is an MTL file?",
        answer: "An MTL (Material Template Library) file defines materials, colors, and texture references for an OBJ model. It's usually named the same as the OBJ file and located in the same directory.",
      },
      {
        question: "Can OBJ files contain animations?",
        answer: "Standard OBJ files are static geometry only. For animated 3D content, consider formats like GLB/GLTF or FBX which support animation data.",
      },
      {
        question: "Is OBJ better than STL for 3D printing?",
        answer: "OBJ can include more complex geometry and smooth curves, while STL is simpler and more universally supported by 3D printers. For complex organic shapes, OBJ may preserve better detail.",
      },
    ],
    relatedFormats: ["stl", "glb", "gltf"],
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
    faqs: [
      {
        question: "What is the difference between GLB and GLTF?",
        answer: "GLB is a binary format that bundles all assets (geometry, materials, textures) into a single file. GLTF is a JSON-based format that may reference external files. GLB is more portable and easier to share.",
      },
      {
        question: "Can GLB files contain animations?",
        answer: "Yes, GLB supports skeletal animations, morph targets, and node-based animations. This viewer will display the model, though animation playback support may vary.",
      },
      {
        question: "Why is GLB popular for web 3D?",
        answer: "GLB is optimized for web delivery with efficient compression, self-contained assets, and widespread browser support. It's designed to be the 'JPEG of 3D'.",
      },
      {
        question: "Can I convert GLB to other formats?",
        answer: "Yes, tools like Blender, online converters, or command-line utilities can convert GLB to OBJ, STL, FBX, and other formats depending on your needs.",
      },
    ],
    relatedFormats: ["gltf", "obj", "stl"],
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
    faqs: [
      {
        question: "Why does my GLTF file appear incomplete?",
        answer: "GLTF files often reference external .bin files for geometry data and separate image files for textures. This viewer supports self-contained GLTF files with embedded data URIs.",
      },
      {
        question: "What is a .bin file referenced by GLTF?",
        answer: "The .bin file contains binary geometry data (vertices, indices, normals) that the GLTF JSON file references. It's usually named the same as the GLTF file and stored alongside it.",
      },
      {
        question: "When should I use GLTF vs GLB?",
        answer: "Use GLTF when you need to edit the JSON structure or work with external assets separately. Use GLB for a single portable file that's easier to share and deploy.",
      },
      {
        question: "Is GLTF suitable for game development?",
        answer: "Yes, GLTF is widely supported by game engines and 3D frameworks. It's designed as a transmission format for efficient 3D content delivery.",
      },
    ],
    relatedFormats: ["glb", "obj", "stl"],
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
    faqs: [
      {
        question: "Why is SVG considered safer than other image formats?",
        answer: "SVG is text-based XML, which allows for sanitization of potentially malicious scripts. This viewer strips risky elements like scripts before rendering, providing a safer preview experience.",
      },
      {
        question: "Can SVG files contain animations?",
        answer: "Yes, SVG supports CSS animations, SMIL animations, and JavaScript interactivity. However, this viewer sanitizes scripts for security, so only CSS-based animations may appear.",
      },
      {
        question: "When should I use SVG vs PNG/JPG?",
        answer: "Use SVG for logos, icons, diagrams, and any graphics that need to scale infinitely without quality loss. Use PNG/JPG for photographs and complex raster artwork.",
      },
      {
        question: "Can I edit SVG files in this viewer?",
        answer: "No, this viewer is for inspection only. To edit SVG files, use vector design tools like Adobe Illustrator, Inkscape, Figma, or code editors for direct XML editing.",
      },
    ],
    relatedFormats: [],
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
