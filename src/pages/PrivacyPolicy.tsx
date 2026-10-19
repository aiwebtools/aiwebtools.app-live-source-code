import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";

const PrivacyPolicy = () => {
  const updated = "May 29, 2026";
  return (
    <>
      <Helmet>
        <title>Privacy Policy | AIWebTools.ai — 4,000+ AI Tools Directory</title>
        <meta
          name="description"
          content="AIWebTools.ai Privacy Policy: we do not collect personal information. Learn how we protect your privacy while browsing our directory of 4,000+ AI tools."
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://aiwebtools.app/privacy-policy" />
        <meta property="og:title" content="Privacy Policy | AIWebTools.ai" />
        <meta property="og:description" content="AIWebTools.ai does not collect personal information — clear, honest, and minimal." />
        <meta property="og:url" content="https://aiwebtools.app/privacy-policy" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Privacy Policy",
          "url": "https://aiwebtools.app/privacy-policy",
          "isPartOf": { "@type": "WebSite", "name": "AIWebTools.ai", "url": "https://aiwebtools.app" },
          "dateModified": "2026-05-29"
        })}</script>
      </Helmet>

      <main className="min-h-screen bg-black text-green-100 py-16 px-4">
        <div className="container mx-auto max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to AIWebTools.ai
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-green-400" />
            <h1 className="text-3xl md:text-4xl font-black text-green-300">Privacy Policy</h1>
          </div>
          <p className="text-sm text-green-500/80 mb-10">Last updated: {updated}</p>

          <div className="prose prose-invert max-w-none space-y-6 text-green-100/90 leading-relaxed">
            <section>
              <h2 className="text-xl font-bold text-green-300">1. Who we are</h2>
              <p>
                AIWebTools.ai (also operating as AITools.studio and several mirror domains) is a directory of
                4,000+ AI tools, custom GPTs, and AI services. This Privacy Policy explains our commitment to
                your privacy when you visit our website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-300">2. We do not collect personal information</h2>
              <p>
                AIWebTools.ai does not collect, store, or process any personally identifiable information
                from visitors browsing our directory. We do not require accounts, logins, or registrations to
                browse tools. No names, emails, addresses, phone numbers, or payment information are gathered
                simply by visiting the site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-300">3. Anonymous analytics only</h2>
              <p>
                We use Google Analytics to understand broad traffic patterns — such as which pages are popular
                and how visitors navigate the site. This data is aggregated and anonymized. It cannot be used
                to identify you personally. You may block analytics via your browser's Do Not Track setting or
                an ad-blocker with no loss of functionality.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-300">4. No cookies or tracking for ads</h2>
              <p>
                We do not use third-party advertising cookies, cross-site trackers, or invasive fingerprinting.
                Google AdSense may serve contextual ads, but we do not participate in personalized ad targeting
                based on your browsing behavior across other sites.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-300">5. Local storage</h2>
              <p>
                Your browser may store a few small items locally — such as your disclaimer-consent preference,
                favorite tools list (saved only on your device), and session IDs. These remain on your device
                and are never transmitted to our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-300">6. Third-party links & tools</h2>
              <p>
                Many tools listed here are third-party AI services. When you click an external tool, you leave
                AIWebTools.ai and become subject to that provider's privacy policy. External links may include
                the affiliate parameter <code className="px-1 mx-1 bg-green-500/10 rounded">?via=aiwebtools</code> —
                this helps fund the directory at no cost to you. AIWebTools.ai receives no personal data back
                from these links.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-300">7. AI Care Bot</h2>
              <p>
                Our Care Bot uses Lovable AI Gateway (which routes to providers such as Google and OpenAI) to
                respond to your questions. Messages are sent to those providers solely to generate the response.
                We do not store or review your Care Bot conversations. Do not share sensitive personal, medical,
                legal, or financial information with any AI bot.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-300">8. Tool submissions</h2>
              <p>
                If you voluntarily submit a tool to be listed, you choose what information to provide (name,
                email, tool details). This data is used only to review and potentially add your tool to the
                directory. It is never sold or shared with third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-300">9. Children</h2>
              <p>AIWebTools.ai is intended for users 13+. Tools listed may have higher age requirements; review each tool's policy.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-300">10. Changes</h2>
              <p>We may update this policy. Material changes will be reflected by the "Last updated" date above.</p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-green-300">11. Contact</h2>
              <p>
                Questions? Email <a href="mailto:contact@ai-webtools.com" className="text-cyan-300 underline">contact@ai-webtools.com</a>.
                See also our <Link to="/disclaimers" className="text-cyan-300 underline">Disclaimers & User Agreement</Link>.
              </p>
            </section>
          </div>
        </div>
      </main>
    </>
  );
};

export default PrivacyPolicy;