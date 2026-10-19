import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Trophy, Flame, Eye, MousePointerClick } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ToolThumb from "@/components/tools/ToolThumb";
import { allTools } from "@/data/toolsData";
import { generateToolSlug } from "@/utils/urlGenerator";
import { supabase } from "@/integrations/supabase/client";
import { buildCanonicalUrl } from "@/utils/seo";

interface PopularityRow {
  tool_title: string;
  tool_category: string;
  clicks: number;
  views: number;
  popularity: number;
}

const MAX_CATEGORIES = 24;
const TOOLS_PER_CATEGORY = 10;

const RankingsPage = () => {
  const [rows, setRows] = useState<PopularityRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from("tool_popularity")
        .select("tool_title, tool_category, clicks, views, popularity")
        .order("popularity", { ascending: false })
        .limit(1000);
      if (!active) return;
      setRows((data as PopularityRow[]) || []);
      setLoading(false);
    })();
    return () => {
      active = false;
    };
  }, []);

  const toolByTitle = useMemo(() => {
    const map = new Map<string, (typeof allTools)[number]>();
    for (const tool of allTools) {
      if (tool?.title && !map.has(tool.title)) map.set(tool.title, tool);
    }
    return map;
  }, []);

  const grouped = useMemo(() => {
    const byCategory = new Map<string, PopularityRow[]>();
    for (const row of rows) {
      if (!toolByTitle.has(row.tool_title)) continue;
      const list = byCategory.get(row.tool_category) || [];
      if (list.length < TOOLS_PER_CATEGORY) {
        list.push(row);
        byCategory.set(row.tool_category, list);
      }
    }
    return Array.from(byCategory.entries())
      .sort(
        (a, b) =>
          b[1].reduce((s, r) => s + r.popularity, 0) -
          a[1].reduce((s, r) => s + r.popularity, 0)
      )
      .slice(0, MAX_CATEGORIES);
  }, [rows, toolByTitle]);

  const overall = rows.filter((r) => toolByTitle.has(r.tool_title)).slice(0, 25);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Most Popular AI Tools — Live Category Rankings",
    description:
      "Live popularity rankings of the most viewed and most opened AI tools in the AI Web Tools directory, ordered by real visitor activity.",
    url: buildCanonicalUrl("/rankings"),
    numberOfItems: overall.length,
    itemListElement: overall.map((row, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: row.tool_title,
      url: buildCanonicalUrl(`/${generateToolSlug(row.tool_title)}`),
    })),
  };

  return (
    <>
      <Helmet>
        <title>Most Popular AI Tools 2026 — Live Category Rankings | AI Web Tools</title>
        <meta
          name="description"
          content="See which AI tools people actually open. Live popularity rankings by category across 4,000+ AI Tools, updated from real visitor activity on AIWEBTOOLS.AI."
        />
        <meta
          name="keywords"
          content="most popular ai tools, ai tools ranking, top ai tools 2026, best ai tools by category, trending ai tools, ai tools leaderboard, aiwebtools.ai"
        />
        <link rel="canonical" href={buildCanonicalUrl("/rankings")} />
        <meta property="og:title" content="Most Popular AI Tools 2026 — Live Category Rankings" />
        <meta
          property="og:description"
          content="Live popularity rankings by category across 4,000+ AI Tools, driven by real visitor activity."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={buildCanonicalUrl("/rankings")} />
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
      </Helmet>

      <div className="min-h-screen bg-black">
        <Header />

        <main className="container mx-auto px-4 py-20">
          <header className="mx-auto mb-10 max-w-3xl text-center">
            <div className="mb-4 flex justify-center">
              <Trophy className="h-12 w-12 text-yellow-400" aria-hidden="true" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent md:text-5xl">
              Most Popular AI Tools — Live Category Rankings
            </h1>
            <p className="mt-4 text-gray-400">
              These rankings are not opinions. They are drawn from what visitors actually
              view and open across the 4,000+ AI Tools directory, category by category.
            </p>
          </header>

          {loading && (
            <p className="text-center text-gray-400">Reading the live signal…</p>
          )}

          {!loading && rows.length === 0 && (
            <p className="mx-auto max-w-2xl rounded-lg border border-cyan-500/30 bg-gray-900/70 p-6 text-center text-gray-400">
              The leaderboard is still gathering its first signal. As visitors explore the
              directory, the most-opened tools in every category will rise here
              automatically.
            </p>
          )}

          {!loading && overall.length > 0 && (
            <section className="mb-12" aria-labelledby="overall-heading">
              <h2
                id="overall-heading"
                className="mb-4 flex items-center gap-2 text-2xl font-semibold text-cyan-300"
              >
                <Flame className="h-6 w-6 text-orange-400" aria-hidden="true" />
                Top 25 Overall
              </h2>
              <ol className="grid gap-3 md:grid-cols-2">
                {overall.map((row, index) => {
                  const tool = toolByTitle.get(row.tool_title)!;
                  return (
                    <li key={`${row.tool_title}-${row.tool_category}`}>
                      <Link
                        to={`/${generateToolSlug(row.tool_title)}`}
                        className="flex items-center gap-3 rounded-lg border border-gray-700/60 bg-gray-900/60 p-3 transition-colors hover:border-cyan-500/60"
                      >
                        <span className="w-8 shrink-0 text-center text-lg font-bold text-yellow-400">
                          {index + 1}
                        </span>
                        <ToolThumb tool={tool} className="h-12 w-20 rounded object-cover" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-semibold text-gray-100">
                            {row.tool_title}
                          </span>
                          <span className="flex items-center gap-3 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <MousePointerClick className="h-3 w-3" aria-hidden="true" />
                              {row.clicks}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" aria-hidden="true" />
                              {row.views}
                            </span>
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          )}

          {grouped.map(([category, entries]) => (
            <section
              key={category}
              className="mb-10"
              aria-labelledby={`cat-${generateToolSlug(category)}`}
            >
              <h2
                id={`cat-${generateToolSlug(category)}`}
                className="mb-3 text-xl font-semibold text-cyan-300"
              >
                Top {entries.length} in {category}
              </h2>
              <ol className="grid gap-2 md:grid-cols-2">
                {entries.map((row, index) => (
                  <li key={`${category}-${row.tool_title}`}>
                    <Link
                      to={`/${generateToolSlug(row.tool_title)}`}
                      className="flex items-center gap-3 rounded-md border border-gray-800 bg-gray-900/50 px-3 py-2 text-sm transition-colors hover:border-cyan-500/50"
                    >
                      <span className="w-6 text-center font-bold text-cyan-400">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate text-gray-200">
                        {row.tool_title}
                      </span>
                      <span className="shrink-0 text-xs text-gray-500">
                        {row.popularity} pts
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </main>

        <Footer />
      </div>
    </>
  );
};

export default RankingsPage;
