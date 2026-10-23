import { Helmet } from "react-helmet-async";
import BotSuiteMenuSection from "@/components/header/BotSuiteMenuSection";

/** Full-page directory of every in-site bot, sorted A–Z by category and name, with task-aware search. */
export default function BotDirectory() {
  return (
    <>
      <Helmet>
        <title>In-Site AI Bot Directory — AIWebTools.app</title>
        <meta name="description" content="Browse every AIWebTools in-site AI bot, sorted A–Z by category and name. Search by name or describe your task to find the best bot." />
        <link rel="canonical" href="https://aiwebtools.app/gpts" />
      </Helmet>
      <main className="container mx-auto max-w-3xl px-4 py-10">
        <h1 className="mb-2 text-3xl font-bold text-primary">In-Site AI Bot Directory</h1>
        <p className="mb-6 text-sm text-muted-foreground">Type a bot name, or describe what you are trying to do (like “fix my car” or “plan a garden”) and we will suggest the best bot.</p>
        <BotSuiteMenuSection gptsOnly fullPage />
      </main>
    </>
  );
}
