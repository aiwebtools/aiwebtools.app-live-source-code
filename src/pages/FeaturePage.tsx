import React, { useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import InSiteGptRunner from "@/components/tool-detail/InSiteGptRunner";
import { allTools } from "@/data/toolsData";
import { getFlagshipFeatureBySlug, getFlagshipFeatures } from "@/data/flagshipFeatures";
import { ArrowRight, ExternalLink, Grid3X3 } from "lucide-react";
import { useResolvedToolImage } from "@/utils/assetResolver";
import { isExpiredHost, getYouTubeThumbnail } from "@/utils/imageUtils";

const BASE = "https://aiwebtools.app";

/**
 * Long-form flagship feature page ("back page"): magazine-style write-up on one
 * of our custom GPTs, with the real, working in-site chat room embedded so a
 * reader can try the tool inside the article.
 */
export default function FeaturePage() {
  const { slug } = useParams<{ slug: string }>();
  const feature = slug ? getFlagshipFeatureBySlug(slug) : undefined;

  const tool = useMemo(
    () => (feature ? allTools.find((t) => t.title === feature.toolTitle) : undefined),
    [feature]
  );

  // Resolve the hero image the same way tool cards do: bundled assets are
  // rewritten, dead image hosts fall back to the tool's video thumbnail.
  const rawImage = typeof tool?.imageUrl === "string" ? tool.imageUrl.trim() : "";
  const expiredImage = rawImage ? isExpiredHost(rawImage) : false;
  const resolvedImage = useResolvedToolImage(expiredImage ? "" : rawImage);

  if (!feature) {
    return <Navigate to="/features" replace />;
  }

  const url = `${BASE}/feature/${feature.slug}`;
  const toolPath = `/${feature.toolSlug}`;
  const image = resolvedImage || getYouTubeThumbnail(tool?.videoUrl);
  const others = getFlagshipFeatures().filter((f) => f.slug !== feature.slug).slice(0, 6);

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: feature.headline,
      description: feature.metaDescription,
      datePublished: feature.publishDate,
      dateModified: feature.publishDate,
      author: { "@type": "Organization", name: "AI Web Tools", url: BASE },
      publisher: {
        "@type": "Organization",
        name: "AI Web Tools",
        url: BASE,
        logo: { "@type": "ImageObject", url: `${BASE}/logo.png` },
      },
      mainEntityOfPage: { "@type": "WebPage", "@id": url },
      keywords: feature.keywords.join(", "),
      ...(image ? { image } : {}),
      about: {
        "@type": "SoftwareApplication",
        name: feature.toolTitle,
        applicationCategory: "AIApplication",
        operatingSystem: "Web",
        url: `${BASE}${toolPath}`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: BASE },
        { "@type": "ListItem", position: 2, name: "Flagship AI Tool Features", item: `${BASE}/features` },
        { "@type": "ListItem", position: 3, name: feature.toolTitle, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: feature.faq.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": url,
      name: feature.headline,
      description: feature.metaDescription,
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: [".aeo-answer", ".aeo-quick-facts"],
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>{feature.metaTitle}</title>
        <meta name="description" content={feature.metaDescription} />
        <meta name="keywords" content={feature.keywords.join(", ")} />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={feature.headline} />
        <meta property="og:description" content={feature.metaDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        {image && <meta property="og:image" content={image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={feature.headline} />
        <meta name="twitter:description" content={feature.metaDescription} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <Header />

      <main className="min-h-screen bg-black">
        <article className="featured-story-content container mx-auto max-w-4xl px-4 pt-40 pb-16">
          <nav aria-label="Breadcrumb" className="pt-8 text-sm text-green-400/80">
            <Link to="/" className="hover:text-green-300">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/features" className="hover:text-green-300">Flagship Features</Link>
            <span className="mx-2">/</span>
            <span className="text-green-200">{feature.toolTitle}</span>
          </nav>

          <header className="mt-6 mb-8">
            <p className="text-xs uppercase tracking-widest text-cyan-400">
              {feature.kicker} · {feature.category}
            </p>
            <h1 className="mt-2 text-3xl font-bold leading-tight text-green-300 md:text-4xl">
              <span className="mr-2" aria-hidden="true">{feature.emoji}</span>
              {feature.headline}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-gray-200">{feature.deck}</p>
            <p className="mt-3 text-xs uppercase tracking-widest text-green-500/70">
              {feature.readTime} read · Published {feature.publishDate} · AIWebTools.ai
            </p>
          </header>

          <section
            className="aeo-answer mb-6 rounded-lg border-l-4 border-green-500 bg-green-950/25 p-5"
            aria-label={`Quick answer: what is ${feature.toolTitle}`}
          >
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-green-400">
              Quick answer
            </h2>
            <p className="text-lg leading-relaxed text-green-100">{feature.answer}</p>
          </section>

          {image && (
            <img
              src={image}
              alt={`${feature.toolTitle} — custom AI tool built by AIWebTools.ai`}
              width={1200}
              height={675}
              loading="eager"
              decoding="async"
              className="mb-8 w-full rounded-lg border border-green-500/20 object-cover"
            />
          )}

          {/* The live, working tool — embedded inside the article. */}
          {tool && (
            <section className="mb-10" aria-label={`Try ${feature.toolTitle} right here`}>
              <h2 className="mb-3 text-xl font-bold text-green-300">
                Try {feature.toolTitle} right here
              </h2>
              <p className="mb-4 text-sm text-gray-400">
                This is the real tool, running inside the page. Free to use — no install and no
                account needed. No daily bot-use cap. In-site models are not ChatGPT; provider availability and limits still apply.
              </p>
              <InSiteGptRunner tool={tool} />
            </section>
          )}

          <section className="aeo-quick-facts mb-10" aria-label={`${feature.toolTitle} at a glance`}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-cyan-400">
              {feature.toolTitle} at a glance
            </h2>
            <dl className="grid gap-x-6 gap-y-2 rounded-lg border border-green-500/20 bg-black/40 p-4 sm:grid-cols-2">
              {feature.quickFacts.map((fact) => (
                <div key={fact.label} className="flex flex-col sm:flex-row sm:gap-2">
                  <dt className="shrink-0 font-semibold text-green-300">{fact.label}:</dt>
                  <dd className="text-gray-300">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="mb-10 flex flex-wrap gap-3">
            <Button asChild className="bg-green-600 font-semibold text-black hover:bg-green-500">
              <Link to={toolPath}>
                Open the {feature.toolTitle} page
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            {tool?.directUrl && (
              <Button
                asChild
                variant="outline"
                className="official-gold-btn"
              >
                <a href={tool.directUrl} target="_blank" rel="noopener noreferrer">
                  Use the official version — click here
                  <ExternalLink className="ml-1 h-4 w-4" />
                </a>
              </Button>
            )}
            <Button
              asChild
              variant="outline"
              className="border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40"
            >
              <Link to={`/category/${encodeURIComponent(feature.category)}`}>
                More {feature.category}
                <Grid3X3 className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="space-y-8">
            {feature.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-3 text-2xl font-bold text-green-300">{section.heading}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="mb-3 leading-relaxed text-gray-300">
                    {paragraph}
                  </p>
                ))}
                {section.bullets?.length ? (
                  <ul className="mt-3 list-disc space-y-1 pl-6 text-gray-300">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <section className="mt-12">
            <h2 className="mb-4 text-2xl font-bold text-green-300">Frequently asked questions</h2>
            <div className="space-y-5">
              {feature.faq.map((item) => (
                <div key={item.q}>
                  <h3 className="font-semibold text-green-200">{item.q}</h3>
                  <p className="mt-1 leading-relaxed text-gray-300">{item.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-12 border-t border-green-500/20 pt-8">
            <h2 className="mb-4 text-xl font-bold text-green-300">More flagship features</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    to={`/feature/${other.slug}`}
                    className="text-green-400 underline-offset-4 hover:text-green-300 hover:underline"
                  >
                    {other.emoji} {other.headline}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </article>
      </main>

      <Footer />
    </>
  );
}
