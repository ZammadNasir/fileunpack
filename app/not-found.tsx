import Link from "next/link";
import { siteConfig } from "@/src/config/site";

export default function NotFound() {
  return (
    <main className="not-found-page">
      <p className="eyebrow">{siteConfig.name}</p>
      <h1>That page is not available.</h1>
      <p>The current MVP includes viewers for STL, OBJ, GLB, GLTF, and SVG files.</p>
      <Link className="primary-link" href="/">Open a file</Link>
    </main>
  );
}
