# Sample Files

This folder contains sample files for each supported format in the file viewer.

## Adding New Sample Files

When adding a new format to the viewer, follow these steps:

1. Add a sample file to this folder with the naming convention: `sample.{extension}`
2. Update the format definition in `src/lib/formats.ts` to include the `sampleFile` property:
   ```typescript
   sampleFile: "/sample-files/sample.{extension}"
   ```
3. The download button will automatically appear on the format page if the `sampleFile` property is set.

## Current Sample Files

- `sample.svg` - Sample SVG vector image
- `sample.rtf` - Sample RTF document
- `sample.stl` - Sample STL 3D model
- `sample.obj` - Sample OBJ 3D model
- `sample.glb` - Sample GLB 3D model
- `sample.gltf` - Sample GLTF 3D model

## Notes

- Sample files should be small and simple to demonstrate the format
- Avoid including sensitive or proprietary data in sample files
- Ensure sample files are valid and can be loaded by the viewer
