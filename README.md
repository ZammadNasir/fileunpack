# File Unpack

File Unpack is a browser-first online file viewer for uncommon formats. The MVP opens STL, OBJ, GLB, GLTF, and RTF files without accounts, databases, uploads, or server-side file storage.

## Tech stack

- Next.js 16 App Router
- TypeScript
- React
- Tailwind CSS 4 plus custom CSS tokens
- Three.js for 3D formats
- Client-side file parsing wherever possible

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Build and run production:

```bash
npm run build
npm start
```

## Viewer architecture

The app routes files through a central registry in `src/lib/formats.ts`.

1. The selected file extension is normalized with `getExtension`.
2. The extension is looked up in `FORMAT_REGISTRY`.
3. The registry chooses a viewer family: `3d`, `rtf`, or `unsupported`.
4. `FullscreenViewer` lazy-loads the matching viewer so Three.js is not loaded on informational pages until a 3D file is selected.

3D formats share `components/viewers/ThreeViewer.tsx`. Format-specific parsing happens in `loadModel`, while camera controls, fit, reset, lighting, model inspection, and wireframe mode stay common.

RTF files use `components/viewers/RtfViewer.tsx`, which parses rich text format and renders formatted content with tables and images.

## Add a new format

Example: adding `dxf`.

1. Add `"dxf"` to `siteConfig.supportedFormats`.
2. Add a `dxf` entry to `FORMAT_REGISTRY` with name, category, viewer type, copy, and features.
3. If an existing viewer works, point the entry to that viewer type. Otherwise create a new viewer under `components/viewers`.
4. Update `FullscreenViewer` to lazy-load the new viewer family.
5. If the new format needs a parser, keep loader logic separate from common viewer controls.
6. Test valid, malformed, empty, too-large, and unsupported files.

Dynamic `/open/[format]` pages and the sitemap are generated from the registry, so registered formats get SEO pages automatically.

## Change the project name

Change the single value in `src/config/site.ts`:

```ts
export const PROJECT_NAME = "FileScout";
```

Visible branding, metadata, footer text, and page titles read from that value.

## Current limitations

- OBJ material files and textures are not loaded in this MVP.
- Single-file GLTF works best when assets are embedded as data URIs. External `.bin` files and texture folders need a future multi-file selection flow.
- Very large files are rejected client-side using `MAX_FILE_SIZE_MB`.
- RTF viewer renders as continuous formatted text; complex page layout, headers/footers, and some legacy image types may appear differently than in desktop word processors.

## Licensing and attribution

This project uses Three.js, which is MIT licensed. Review dependency licenses before commercial deployment with your normal compliance process.
