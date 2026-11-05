import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

// The creator embed is rate-limited and throws third-party errors. Keep the
// profile reachable without loading its script or an indefinitely blank frame.
const TikTokFeedSection = () => (
  <section id="tiktok-feed" aria-labelledby="tiktok-feed-heading" className="py-12 relative">
    <div className="container mx-auto px-4 text-center">
      <h2 id="tiktok-feed-heading" className="text-2xl md:text-4xl font-bold text-primary mb-4">🎵 AIWEBTOOLS ON TIKTOK</h2>
      <p className="text-muted-foreground mb-6">@aiwebtools</p>
      <Button asChild className="h-auto min-h-11 whitespace-normal px-6 py-3">
        <a href="https://www.tiktok.com/@aiwebtools?via=aiwebtools" target="_blank" rel="noopener noreferrer">
          Follow us on TikTok <ExternalLink className="ml-2 h-4 w-4 shrink-0" />
        </a>
      </Button>
    </div>
  </section>
);
export default TikTokFeedSection;