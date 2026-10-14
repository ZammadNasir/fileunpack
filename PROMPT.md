# Build a Production-Ready MVP: Online File Viewer

You are an expert full-stack engineer, frontend designer, and product architect.

Build a complete, polished MVP for an online file viewer website whose primary purpose is:

> **Allow users to open and view uncommon or difficult-to-open file formats directly in their browser, without installing specialized software.**

The project should be architected so that more file formats can easily be added later.

---

## 1\. Project identity

Create exactly ONE central configuration value for the project name:

```
export const PROJECT_NAME = "File Unpack";
Domain: fileunpack.com
```

Put this in a clearly named central configuration file such as:

```
src/config/site.ts
```

or an equivalent location appropriate for the chosen framework.

**IMPORTANT:**

- Never hardcode the project name throughout the application.
- All visible branding must reference `PROJECT_NAME`.
- Browser titles should use it.
- Navbar/logo should use it.
- Footer should use it.
- Metadata should use it.
- OpenGraph metadata should use it.
- Any placeholder branding should use it.
- If I later change `"File Unpack"` to `"FileScout"`, the entire application should automatically use the new name.

---

# 2\. Tech stack

Use a modern, lightweight stack appropriate for a solo developer and low-budget startup.

Preferred stack:

- Next.js
- TypeScript
- React
- Tailwind CSS
- Modern CSS where useful
- Client-side file processing wherever technically possible
- Web Workers for expensive parsing/processing where appropriate
- WASM libraries where appropriate
- Three.js for 3D formats where appropriate

Avoid unnecessary infrastructure.

Do NOT introduce:

- Kubernetes
- microservices
- Redis
- complex backend architecture
- unnecessary databases
- authentication
- user accounts
- payment systems
- CMS
- unnecessary APIs
- server-side file storage

The MVP should be capable of running extremely cheaply.

---

# 3\. Core architectural principle

The most important technical requirement is:

## PROCESS FILES LOCALLY WHENEVER POSSIBLE

The preferred flow is:

```
User selects file
        ↓
Browser receives file
        ↓
Format detection
        ↓
Client-side parser / WASM / renderer
        ↓
Viewer
```

Do NOT upload user files to a server unless a particular format genuinely requires server-side processing.

The application should be designed around privacy.

The interface should communicate something like:

> "Your file is processed directly in your browser whenever possible."

Do not make exaggerated claims such as "your files never leave your device" unless that is technically true for the specific operation.

---

# 4\. MVP file support

Initially implement support for ONLY these 4 formats:

### 1\. STL

3D model viewer.

Use Three.js or an appropriate maintained browser library.

Requirements:

- Load binary STL
- Load ASCII STL if practical
- Orbit controls
- Zoom
- Rotate
- Reset camera
- Fit model to screen
- Solid/wireframe option if straightforward
- Loading indicator
- Error state
- Basic model information where available

---

### 2\. OBJ

3D model viewer.

Use Three.js or an appropriate maintained loader.

Requirements:

- Load OBJ
- Orbit controls
- Zoom
- Rotate
- Reset camera
- Fit model
- Loading state
- Error state

If an OBJ references external MTL/textures and those cannot be reliably loaded in the first MVP, handle this gracefully rather than pretending they are supported.

---

### 3\. GLB / GLTF

Treat GLB and GLTF as one logical viewer category.

Use Three.js and the appropriate loaders.

Requirements:

- Load GLB
- Load GLTF
- 3D orbit controls
- Zoom
- Rotate
- Reset
- Fit model
- Loading state
- Error state
- Basic scene rendering

If external GLTF assets are difficult to support through local file selection, clearly communicate the limitation.

---

### 4\. SVG

Provide a proper SVG viewer.

Requirements:

- Render SVG safely
- Zoom
- Pan if practical
- Reset
- Fit to screen
- Show dimensions where available
- Loading/error state

Be careful with SVG security.

Do not blindly inject potentially dangerous SVG content into the DOM.

---

# 5\. Viewer architecture

Do NOT hardcode format-specific logic throughout the application.

Create a viewer registry/plugin architecture.

Conceptually:

```
type ViewerType =
  | "3d"
  | "svg"
  | "unsupported";
```

Then:

```
const FORMAT_REGISTRY = {
  stl: {
    name: "STL",
    category: "3D",
    viewer: "3d",
    supported: true,
  },

  obj: {
    name: "OBJ",
    category: "3D",
    viewer: "3d",
    supported: true,
  },

  glb: {
    name: "GLB",
    category: "3D",
    viewer: "3d",
    supported: true,
  },

  gltf: {
    name: "GLTF",
    category: "3D",
    viewer: "3d",
    supported: true,
  },

  svg: {
    name: "SVG",
    category: "Vector",
    viewer: "svg",
    supported: true,
  },
};
```

Design this so adding a future format such as:

```
DWG
DXF
STEP
STP
MSG
EML
PSD
EPUB
VSDX
```

does not require rewriting the application.

---

# 6\. File detection

When a user selects a file:

1. Determine its extension.
2. Normalize the extension to lowercase.
3. Look it up in the format registry.
4. Route it to the appropriate viewer.
5. If unsupported, show a useful unsupported-file experience.

Do not rely solely on MIME type because MIME detection for uncommon formats is unreliable.

Example:

```
model.STL
→ stl

drawing.DWG
→ dwg

document.SVG
→ svg
```

---

# 7\. Homepage

The homepage should be extremely focused.

The primary message should be along the lines of:

> **Open files without the software.**

or:

> **Open unfamiliar files right in your browser.**

Do not make the homepage look like a generic SaaS landing page.

The central interaction should be a large drag-and-drop upload area.

Example structure:

```
------------------------------------------------

                    LOGO

             Open files online

       View uncommon files directly
             in your browser.

        ┌───────────────────────────┐
        │                           │
        │     Drop a file here      │
        │                           │
        │          or               │
        │                           │
        │      [ Choose File ]      │
        │                           │
        └───────────────────────────┘

       STL · OBJ · GLB · GLTF · SVG

   Processed locally whenever possible.

------------------------------------------------
```

The actual copy can be improved by the designer, but the hierarchy must remain clear.

---

# 8\. IMPORTANT: visual design direction

This is extremely important.

## DO NOT create a generic AI/SaaS interface.

I specifically do NOT want:

- Generic dark mode
- Dark navy backgrounds
- Purple/blue AI gradients
- Glassmorphism everywhere
- Huge gradient text
- Excessive rounded cards
- Floating gradient blobs
- "AI startup" aesthetic
- Dashboard-style UI
- Excessive pill-shaped buttons
- Inter everywhere with no personality
- Excessive shadows
- Random decorative illustrations
- Fake statistics
- Generic "Trusted by thousands" sections
- Fake testimonials
- Fake logos
- Generic SaaS landing-page sections

Do not make this look like something generated from a modern SaaS template.

---

# 9\. Design philosophy

I want the site to feel like a **well-designed independent internet product from the pre-AI/template era**.

Think:

- Practical
- Confident
- Clean
- Editorial
- Functional
- Human-designed
- Slightly distinctive
- Excellent typography
- Strong spacing
- Clear hierarchy
- Restrained visual effects
- Memorable color palette

It can be **light mode only**.

Do NOT implement dark mode unless specifically requested later.

---

# 10\. Create a real visual identity

Choose a proper custom color palette.

Do NOT simply use:

```
blue-500
purple-500
gray-900
```

as the entire design system.

Create semantic design tokens such as:

```
--color-primary
--color-primary-dark
--color-accent
--color-background
--color-surface
--color-border
--color-text
--color-text-muted
--color-success
--color-error
```

Choose a cohesive palette that gives the product its own identity.

The palette should work across:

- Navbar
- Upload area
- Buttons
- Viewer controls
- Links
- Cards
- Status messages
- Footer
- Documentation pages

Use color intentionally.

A possible direction is a warm/off-white background combined with a strong editorial accent color and dark charcoal typography, but choose the actual palette yourself.

Do not copy this suggestion literally.

---

# 11\. Typography

Typography should feel intentional.

Use a strong readable font pairing if appropriate.

For example:

- distinctive heading font
- highly readable body font

OR

- one excellent typeface with multiple weights

Do not automatically default to the standard AI-generated "Inter + Inter" look.

Typography should contribute to the identity of the site.

---

# 12\. Homepage layout

Keep the homepage relatively compact.

Suggested structure:

### Header

Left:

```
[PROJECT_NAME]
```

Right:

- Formats
- How it works
- About

Do not overload the navbar.

---

### Hero

Strong headline.

Short supporting paragraph.

Large uploader.

---

### Supported formats

A clean list/grid:

```
3D

STL
OBJ
GLB
GLTF

Vector

SVG
```

Each format should be clickable.

---

### How it works

Three simple steps:

```
01  Choose a file

02  We identify the format

03  View it instantly
```

Avoid giant marketing illustrations.

---

### Privacy section

Explain the browser-first architecture.

Example:

> **Your files are yours.**
>
> We process files directly in your browser whenever possible, so there's no reason to upload them to a server for supported formats.

Be technically accurate.

---

### Footer

Minimal.

Include:

- PROJECT_NAME
- Formats
- Privacy
- About
- Contact/feedback placeholder

---

# 13\. Format landing pages

Create dynamic SEO pages:

```
/open/stl
/open/obj
/open/glb
/open/gltf
/open/svg
```

Each page should be a useful page, not just an upload widget.

Example:

# Open STL Files Online

Short description.

Then:

```
[Upload STL File]
```

Then:

### What is an STL file?

Useful original explanation.

### How to open an STL file

Useful explanation.

### Can I open STL without installing software?

Answer.

### STL viewer features

- Rotate
- Zoom
- Fit model
- etc.

### Related formats

OBJ · GLB · GLTF

---

# 14\. SEO

Implement proper technical SEO from the beginning.

Include:

- Unique page titles
- Unique meta descriptions
- Canonical URLs
- OpenGraph metadata
- Twitter/X metadata where appropriate
- sitemap
- robots.txt
- semantic HTML
- correct heading hierarchy
- descriptive URLs
- internal links
- structured data where genuinely appropriate

Do not keyword-stuff.

Each format page should provide genuinely useful information.

---

# 15\. URL structure

Use:

```
/
```

Homepage.

```
/open/stl
/open/obj
/open/glb
/open/gltf
/open/svg
```

Format viewer pages.

Potential future structure:

```
/guides/how-to-open-dwg
/guides/how-to-open-msg
```

Do not implement unnecessary future pages now.

---

# 16\. Viewer UX

When the viewer opens, the user should immediately understand what happened.

Example:

```
← Back

model.stl
STL • 3D Model

┌─────────────────────────────────────┐
│                                     │
│                                     │
│             3D MODEL                │
│                                     │
│                                     │
└─────────────────────────────────────┘

[ Reset ] [ Fit ] [ Wireframe ]

File: model.stl
Type: STL
Size: 4.2 MB
```

Keep viewer controls simple.

Do not create a complicated CAD application.

This is a **file previewer**, not AutoCAD.

---

# 17\. Upload UX

Support:

- Click to upload
- Drag and drop
- Keyboard accessibility
- File validation
- Loading state
- Error state
- Unsupported state

Handle:

- Very large files
- Empty files
- Corrupted files
- Wrong extensions
- Unsupported formats

Gracefully.

Never crash the entire application because a malformed file was uploaded.

---

# 18\. File size limits

Set sensible client-side limits.

Do not attempt to load enormous files blindly.

Display something like:

> This file is too large to process comfortably in your browser.

The exact limit can be configurable.

Create something like:

```
export const MAX_FILE_SIZE_MB = 100;
```

in the central configuration.

Do not scatter the limit throughout the code.

---

# 19\. Error handling

Every viewer needs:

### Loading

```
Preparing your file...
```

### Success

Show the viewer.

### Invalid file

```
We couldn't read this file.
The file may be corrupted or use an unsupported variant.
```

### Unsupported format

```
We don't support .XYZ yet.
```

Eventually this could become a format-request feature, but do not build a backend for that in the MVP.

---

# 20\. Accessibility

The project must be accessible.

Implement:

- keyboard navigation
- visible focus states
- semantic buttons
- proper labels
- ARIA only where necessary
- adequate color contrast
- reduced-motion consideration
- screen-reader-friendly upload controls

Do not sacrifice accessibility for visual styling.

---

# 21\. Responsive design

The site must work properly on:

- Desktop
- Laptop
- Tablet
- Mobile

The uploader should be especially good on mobile.

The 3D viewer should adapt to smaller screens.

Do not simply shrink desktop components.

---

# 22\. Performance

Performance is important because this is an SEO-driven site.

Optimize for:

- fast initial HTML
- minimal JavaScript on informational pages
- lazy loading heavy viewer libraries
- dynamic imports for viewers
- Web Workers for expensive processing
- avoiding unnecessary dependencies
- image optimization
- minimal animations

Critically:

**Do not load Three.js on the homepage.**

Only load the 3D viewer code when a 3D file is actually being viewed.

Likewise, don't load SVG-specific or future viewer code unnecessarily.

---

# 23\. Component architecture

Keep components reusable.

Suggested structure:

```
components/
  layout/
    Header
    Footer

  uploader/
    FileDropzone
    FilePicker
    UploadStatus

  viewer/
    ViewerShell
    ViewerToolbar
    ViewerLoading
    ViewerError
    UnsupportedFile

  viewers/
    ThreeViewer
    SvgViewer

  format/
    FormatHeader
    FormatInfo
    RelatedFormats
```

Keep business logic out of presentation components where practical.

---

# 24\. 3D viewer architecture

Create a reusable `ThreeViewer` rather than one viewer for each 3D format.

Conceptually:

```
STL ─────┐
OBJ ─────┤
GLB ─────┼──→ ThreeViewer
GLTF ────┘
```

The format-specific loader should be separated from the common viewer controls.

For example:

```
loadSTL(file)
loadOBJ(file)
loadGLTF(file)
```

feeding into the same viewer shell.

---

# 25\. Security

Treat uploaded files as untrusted input.

Important:

- Do not execute uploaded files.
- Validate file types.
- Do not blindly inject uploaded SVG into the page.
- Avoid unsafe HTML.
- Sanitize where necessary.
- Keep processing isolated.
- Do not use `dangerouslySetInnerHTML` unnecessarily.
- Do not send files to external services without explicitly requiring it.

For SVG specifically, account for potentially dangerous embedded content.

---

# 26\. No authentication

Do NOT implement:

- Login
- Signup
- Profiles
- User dashboards

The MVP should be completely usable without an account.

---

# 27\. No database initially

Do NOT add a database unless there is a concrete need.

The format registry and format descriptions can be static data/content.

The goal is:

```
Git repository
+
Next.js
+
client-side viewers
=
working product
```

---

# 28\. No advertising initially

Do not add Google AdSense yet.

However, structure the layout so advertising can eventually be introduced without redesigning everything.

Create an optional:

```
AdSlot
```

component if useful, but keep it disabled.

Do not fill the site with placeholder advertisements.

---

# 29\. No fake content

Do NOT create:

- fake testimonials
- fake customer logos
- fake statistics
- fake user counts
- fake reviews
- fake security certifications
- fake "trusted by" sections

The website should feel honest.

---

# 30\. Code quality

The project should be production-quality.

Requirements:

- TypeScript strict mode
- sensible naming
- reusable components
- no unnecessary duplication
- no giant components
- no unnecessary dependencies
- clear separation of concerns
- error boundaries where appropriate
- clean imports
- meaningful comments only where useful

Avoid overengineering.

---

# 31\. Central configuration

Create a single configuration module.

For example:

```
export const siteConfig = {
  name: "TEMP_PROJECT_NAME",
  description:
    "Open uncommon files directly in your browser.",
  url: "http://localhost:3000",

  maxFileSizeMB: 100,

  supportedFormats: [
    "stl",
    "obj",
    "glb",
    "gltf",
    "svg",
  ],
};
```

The project name must exist in ONE place.

If a separate `PROJECT_NAME` constant is cleaner, use that instead.

The key requirement is:

> **I should be able to rename the entire product by changing one value.**

---

# 32\. README

Create a useful README explaining:

- What the project does
- Tech stack
- How to install
- How to run locally
- How the viewer architecture works
- How to add a new format
- How to change the project name
- How to build for production

Include an example of adding a future format.

For example:

```
1. Add format definition
2. Add/choose loader
3. Register viewer
4. Add format content
5. Add route/metadata
6. Test malformed files
```

---

# 33\. Developer experience

The project should run with:

```
npm install
npm run dev
```

and production build with:

```
npm run build
npm start
```

No complicated setup.

If environment variables aren't required, don't create unnecessary `.env` requirements.

---

# 34\. Final visual quality requirement

Before considering the task complete, inspect the UI as a designer would.

Ask:

> Does this look like a generic AI-generated SaaS template?

If yes, redesign it.

Ask:

> Does this look like an actual independent software product someone intentionally designed?

If no, redesign it.

The visual identity should come from:

- typography
- spacing
- color
- proportions
- borders
- iconography
- layout
- interaction details

—not from gradients and decorative effects.

The website should be **simple enough to understand immediately but distinctive enough to remember.**

---

# 35\. Final deliverable

Produce the complete working project, not a mockup.

It must include:

- Homepage
- Upload/dropzone
- File detection
- Format registry
- STL viewer
- OBJ viewer
- GLB viewer
- GLTF viewer
- SVG viewer
- Viewer controls
- Loading states
- Error states
- Unsupported-format state
- Format-specific SEO pages
- Responsive design
- Accessibility
- SEO metadata
- Sitemap
- Robots
- Central configuration
- README
- Clean architecture

Do not stop at pseudocode.

Do not provide only snippets.

Implement the actual application.

Before finishing, test the primary flows:

```
Homepage
→ choose STL
→ STL viewer

Homepage
→ choose OBJ
→ OBJ viewer

Homepage
→ choose GLB
→ GLB viewer

Homepage
→ choose GLTF
→ GLTF viewer

Homepage
→ choose SVG
→ SVG viewer

Unsupported file
→ graceful unsupported state

Malformed supported file
→ graceful error state
```

Finally, provide a concise summary of:

1. What was built
2. Files/components created
3. How to run it
4. How to change the project name
5. How to add the next file format
6. Any known limitations
7. Any dependencies that require special licensing or attribution

Do not add features that were not requested merely to make the project appear more complete.

Focus on making this MVP **small, polished, fast, extensible, and genuinely useful.**

I'd give that prompt to a coding agent **as-is**. The most important parts are the explicit anti-template design requirements and the single `siteConfig.name` source of truth.

One small correction to the earlier architecture: I listed five formats in places because **GLB and GLTF are really one viewer family**. For the MVP, I'd treat them as one 3D renderer with four supported extensions: **STL, OBJ, GLB/GLTF, SVG**. That gives you a manageable first version while already demonstrating the architecture you'll need for DWG, DXF, MSG, STEP, etc.
