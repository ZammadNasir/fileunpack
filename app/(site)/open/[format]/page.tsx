import { FormatPageContent } from "@/components/format/FormatPageContent";
import { siteConfig } from "@/src/config/site";
import {
  FORMAT_REGISTRY,
  isSupportedExtension,
  SUPPORTED_FORMATS,
} from "@/src/lib/formats";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = PageProps<"/open/[format]">;

export function generateStaticParams() {
  return SUPPORTED_FORMATS.map((format) => ({ format: format.extension }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { format: formatParam } = await params;
  if (!isSupportedExtension(formatParam)) return {};
  const format = FORMAT_REGISTRY[formatParam];
  const title = `Open ${format.name} Files Online`;
  const socialTitle = `${title} | ${siteConfig.name}`;
  const url = `/open/${format.extension}`;

  return {
    title,
    description: format.description,
    alternates: { canonical: url },
    openGraph: {
      title: socialTitle,
      description: format.description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: socialTitle,
      description: format.description,
    },
  };
}

export default function FormatPage({ params }: Props) {
  return (
    <Suspense fallback={<FormatPageLoading />}>
      <ResolvedFormatPage params={params} />
    </Suspense>
  );
}

async function ResolvedFormatPage({ params }: { params: Props["params"] }) {
  const { format: formatParam } = await params;
  if (!isSupportedExtension(formatParam)) notFound();
  const format = FORMAT_REGISTRY[formatParam];

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${siteConfig.name} ${format.name} Viewer`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    url: `${siteConfig.url}/open/${format.extension}`,
    description: format.description,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <FormatPageContent format={format} />
    </>
  );
}

function FormatPageLoading() {
  return (
    <main className="format-page format-page-loading" aria-busy="true">
      <p className="eyebrow">Format viewer</p>
      <h1>Loading format details...</h1>
      <div className="loader-line" aria-hidden="true" />
      <p role="status">Preparing the viewer guide.</p>
    </main>
  );
}
