import { ExternalLink, Radio, Youtube, Music2, Instagram, Facebook, Cloud, Play } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import MtvaiBrand from "@/components/MtvaiBrand";
import { Button } from "@/components/ui/button";
import { OFFICIAL_SOCIAL_ACCOUNTS, orderSocialAccounts } from "@/data/officialSocialAccounts";

const icons = { YouTube: Youtube, TikTok: Music2, Instagram, Facebook, Bluesky: Cloud, Odysee: Play };

export default function SocialsPage() {
  return <>
    <SEOHead title="MTVAI.live — Official Socials" description="Follow MTVAI.live and AIWebTools across YouTube, TikTok, Instagram, Facebook, Bluesky and Odysee. Music, digital art and audiobooks by Kenneth Bastian." url="/socials" />
    <Header />
    <main className="min-h-screen bg-background text-foreground px-4 pt-28 pb-24">
      <div className="mx-auto max-w-5xl">
        <MtvaiBrand />
        <div className="mt-8 mb-10 border-b border-border pb-8">
          <div className="flex items-center gap-3 text-primary"><Radio aria-hidden="true" /><h1 className="text-3xl font-bold">Official Socials</h1></div>
          <p className="mt-4 text-muted-foreground">One art collection. Every corner of the web.</p>
          <p className="mt-2 text-sm text-muted-foreground">Music videos, audiobooks and digital art — follow MTVAI.live wherever you call home.</p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orderSocialAccounts(OFFICIAL_SOCIAL_ACCOUNTS).map(account => {
            const Icon = icons[account.platform as keyof typeof icons];
            return <article key={account.url ?? account.handle} className="flex min-w-0 flex-col gap-4 rounded-lg border border-border bg-card p-5">
              <div className="flex items-center gap-3"><Icon className="h-6 w-6 shrink-0 text-primary" aria-hidden="true" /><h2 className="text-xl font-semibold">{account.platform}</h2></div>
              <p className="break-all text-sm text-muted-foreground">{account.handle}</p>
              {account.purpose && <p className="text-sm text-primary">{account.purpose}</p>}
              <p className="text-xs text-muted-foreground">{account.followers === null ? "Audience count unavailable" : `${account.followers.toLocaleString()} followers`}</p>
              {account.url ? <Button asChild variant="outline" className="mt-auto border-border text-foreground hover:bg-accent hover:text-accent-foreground"><a href={account.url} target="_blank" rel="noopener noreferrer">Follow on {account.platform}<ExternalLink aria-hidden="true" /></a></Button> : <p className="mt-auto text-sm text-muted-foreground">Official Page link awaiting verification.</p>}
            </article>;
          })}
        </div>
      </div>
    </main>
    <Footer />
  </>;
}