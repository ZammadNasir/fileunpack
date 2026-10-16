import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { siteConfig } from "@/src/config/site";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="not-found-page">
        <p className="eyebrow">{siteConfig.name}</p>
        <h1>That page is not available.</h1>
        <p>
          The current MVP includes viewers for STL, OBJ, GLB, GLTF, and SVG
          files.
        </p>
        <Link className="primary-link" href="/">
          Open a file
        </Link>
      </main>
      <Footer />
    </>
  );
}
