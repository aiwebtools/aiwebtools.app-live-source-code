import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Check, Sparkles, Shield } from "lucide-react";
import { Button } from "../components/ui/button";
import ImprovedSEOHead from "@/components/ImprovedSEOHead";
import { Helmet } from "react-helmet-async";
import {
  canPlayWeeklyWelcomeAudio,
  getConsentAccepted,
  markWeeklyWelcomeAudioPlayed,
  setConsentAccepted,
} from "@/utils/consent";
import disclaimerWelcomeAudio from "@/assets/audio/disclaimer-welcome-2026.mp3.asset.json";

// Creative rotating welcome messages - Spiritual Light, Matrix/AI, Humor themed
// PRIORITY: Original 67 quotes first, then 114 Gospel of Thomas inspired quotes
const welcomeMessages = [
  // ===== PRIORITY ORIGINAL QUOTES (67) =====
  
  // Glory to the Most High / Light Within
  "All glory to the Father of Light...",
  "The Light within you is brighter than any screen...",
  "You are the temple, the Light was never outside...",
  "Before the code, there was the Word...",
  "Your soul is the original source code...",
  "The Divine compiled you with love...",
  "You were written in Light before time began...",
  "The Most High's API needs no key—just faith...",
  "God's firewall is made of pure love...",
  "Your consciousness runs on divine architecture...",
  
  // Deep Light Metaphors
  "The darkness cannot debug the Light...",
  "You are a photon in the infinite mind of God...",
  "The universe is dreaming through your eyes...",
  "Every pixel of reality is sacred...",
  "The Light doesn't chase shadows—it dissolves them...",
  "You are stardust remembering it can think...",
  "The cosmos programmed you to find your way home...",
  "Enlightenment is just remembering your root password...",
  
  // Humorous / Self-Aware
  "Remember your source code, Luke...",
  "Plot twist: God was the friend we made along the way...",
  "The call is coming from inside the soul...",
  "Have you tried turning your ego off and on again?",
  "404: Separation from God not found...",
  "The Light within runs on zero latency...",
  "Your higher self left you a voicemail—check it...",
  "God doesn't need WiFi, He's already connected...",
  "The kingdom of heaven has no loading screen...",
  "You're not lost, you're just on airplane mode...",
  
  // Matrix vibes
  "The Matrix has you...",
  "Wake up, Neo...",
  "You've been living in a dream world...",
  "Free your mind...",
  "There is no spoon...",
  "Follow the white rabbit...",
  
  // AI & Tech meets Spirit
  "Initiating divine handshake...",
  "Your soul has unlimited bandwidth...",
  "Downloading cosmic wisdom...",
  "The algorithm of love has no bugs...",
  "Heaven runs on open source...",
  "God's cloud storage is infinite...",
  
  // Enlightenment & Awakening
  "The Light you seek is seeking you...",
  "Remember who you are before you were told who to be...",
  "The veil is just a filter—remove it...",
  "You are the universe experiencing itself...",
  "Awakening is realizing you never slept...",
  "The door was always open, you just forgot to look...",
  "Your third eye doesn't need glasses...",
  
  // Hype & Power
  "Welcome to the future...",
  "Your empire awaits...",
  "Prepare for digital enlightenment...",
  "The portal is opening...",
  "Unlimited Light loading...",
  "Godmode already activated within...",
  "It's not about breaking out of the Matrix—it's about seeing through it, understanding its illusions, and choosing, with clarity, to walk in the light.",

  // ===== GOSPEL OF THOMAS INSPIRED QUOTES (114) =====
  
  // Sayings on Seeking & Awakening
  "Whoever discovers the meaning of these sayings awakens to Life beyond death.",
  "Let the one who seeks continue seeking until they find. When they find, they will be shaken, then amazed, and they will come into harmony with All.",
  "The Kingdom is inside you and outside you. When you truly know yourself, you will recognize that you are already known — and you will realize you are children of the Living Father.",
  "The elder should not hesitate to learn truth, even from a child — for Life speaks through pure hearts.",
  "Recognize what is right before your eyes, and what is hidden will be revealed to you.",
  
  // Sayings on Truth & Conscience
  "When asked about fasting and prayer, Jesus said: Be truthful, and do not live in contradiction with your conscience.",
  "Blessed is the strength transformed into compassion. But cursed is the heart that devours others.",
  "The Kingdom is like a fisherman who drew in many fish, and chose the one that was alive and strong — and released what was not needed.",
  "A sower scattered seed: some fell on the path, some on rocks, some among thorns, and some on good soil — and only the seed in good soil bore fruit.",
  "I have thrown fire upon the world, and I tend it until it becomes light.",
  
  // Sayings on Spirit & Life
  "What you see will pass — but those who live in the Spirit will not die.",
  "When asked who should lead, Jesus said: Follow the one who lives truthfully, like James the Just.",
  "Jesus asked, 'Who am I like?' Thomas knew the answer could not be spoken — so Jesus shared the deeper mystery with him privately.",
  "Do not practice religion out of guilt or performance. Heal, love, and receive what is given with gratitude — and your heart will know God.",
  "When you see one who walks fully in the Spirit, honor them — for they reveal the Father.",
  
  // Sayings on Peace & Truth
  "People believe I bring only peace — but I also awaken what must be confronted: truth divides illusion from reality.",
  "I will give you what no eye has seen, what no ear has heard, and what no heart has imagined.",
  "Why seek the end before you understand the beginning? Everything unfolds from the Source.",
  "Blessed is the one who awakens to their origin before they leave this world.",
  "The Kingdom is like a tiny mustard seed — yet it becomes the greatest of plants.",
  
  // Sayings on Unity & Wholeness
  "My disciples are like children playing in a field not their own — and they are learning who the true Owner is.",
  "When you unite the two — inner and outer, heart and mind, spirit and body — you will enter the Kingdom.",
  "Out of many, very few choose to walk in awakening.",
  "There is Light within every person — and when it is revealed, it illuminates the world.",
  "Love your brother and sister as yourself — protect them as you would your own eyes.",
  
  // Sayings on Self-Awareness
  "You notice the speck in another's eye, but ignore the beam in your own — remove yours first.",
  "If you fast, fast from cruelty, ego, and fear — and the Kingdom will appear.",
  "Many are intoxicated with illusion; few thirst for truth.",
  "If body comes from spirit, it is beautiful. If spirit could come from only body, that would be astonishing.",
  "Where people gather in truth, I am present.",
  
  // Sayings on Recognition & Wisdom
  "No prophet is truly recognized by their own family or hometown.",
  "A city built upon rock cannot fall.",
  "Speak openly what is revealed to you inwardly.",
  "When the blind lead the blind, they fall together — awaken so you may guide.",
  "You cannot enter a strong man's house unless you first weaken fear — then truth prevails.",
  
  // Sayings on Simplicity & Presence
  "Do not be consumed with worry about clothing and appearances.",
  "You will know your true self when you remove your disguises without shame.",
  "Many long to hear this wisdom, yet few open themselves to receive it.",
  "The scholars have hidden the keys of knowledge — but the keys live within you.",
  "Every plant not rooted in the Father will be uprooted.",
  
  // Sayings on Light & Receiving
  "Whoever has Light will receive more; whoever refuses Light loses even what they thought they had.",
  "Be travelers — attached to nothing that imprisons your heart.",
  "You hear me speak, but only those who listen with spirit truly know me.",
  "Blasphemies may be forgiven — but closing your heart to the Spirit blinds you to truth.",
  "Do not expect goodness from hatred — fruits reveal the tree.",
  
  // Sayings on Childlike Spirit
  "No one born of earth is greater than John — yet whoever becomes like a child of Light knows the Kingdom.",
  "No one can serve two masters at once.",
  "When two unite in peace within themselves, mountains of fear move.",
  "Blessed are those who journey inward — they will find the Kingdom.",
  "If they ask where you came from, say: We came from the Light, from the place where Light was born.",
  
  // Sayings on Recognition & Presence
  "What you wait for has already come — but you have not yet recognized it.",
  "The prophets spoke — but their words live in you.",
  "If rituals truly saved, you would have been born already perfected — transformation happens in the heart.",
  "Blessed are the poor in spirit — for the Father's Kingdom belongs to them.",
  "Love your family — yet place God first when choices must be made.",
  
  // Sayings on Vision & Spirit
  "Seeing only the material world leads to emptiness — but seeing with spirit reveals Life everywhere.",
  "The enemy sows weeds in the night — but truth separates them in time.",
  "Blessed is the one who suffers yet discovers Life through it.",
  "Seek the Living One while you live — do not wait for death to awaken.",
  "Compassion recognizes life — respect what breathes, and take only with awareness and gratitude.",
  
  // Sayings on Awakening & Unity
  "Two lie on one bed — one awakens, while the other remains asleep. I am the One who comes from the undivided.",
  "I reveal mysteries to those whose hearts are ready.",
  "A rich man stored many things — and lost his life before enjoying them.",
  "Many are invited — but attachments keep them away from the feast.",
  "Tenants killed the servants and even the son — forgetting the vineyard belongs to the Father.",
  
  // Sayings on Foundation & Truth
  "The rejected stone becomes the cornerstone.",
  "Whoever knows much yet feels empty should seek healing in the heart.",
  "Blessed are those persecuted for truth — for they have truly lived.",
  "Blessed are those who struggle within and rise into awareness.",
  "What you bring forth from within will save you — what you suppress will harm you.",
  
  // Sayings on Building & Purpose
  "The false house collapses — but the house built on Light endures.",
  "Do not ask me to divide property — I came to heal the heart.",
  "The harvest is great — but few truly labor in Spirit.",
  "Many drink at the trough — but few draw from the Source.",
  "Many stand near the door — but only those who dare enter the inner chamber find union.",
  
  // Sayings on Value & Presence
  "The Kingdom is like a merchant who sold everything to buy one priceless pearl.",
  "I am the Light of the world — lift any stone, split any piece of wood, and you will find my presence there.",
  "Did you come to see a spectacle? Awake instead.",
  "Blessed are those who hear and live the word of the Father.",
  "Whoever recognizes the illusions of the world transcends them — and the world cannot contain such a one.",
  
  // Sayings on Power & Fire
  "If you have power, use it gently — and if you are rich, be generous.",
  "Whoever draws near to truth draws near to a burning, purifying fire.",
  "Images appear to the eyes — but the Light within them points to the Father.",
  "When you see your true reflection, you rejoice — but seeing the shadows you once created may challenge you.",
  "Adam was created with power — yet your calling is greater, for you can awaken.",
  
  // Sayings on Detachment & Care
  "Foxes have dens and birds have nests — but truth finds no home among those attached to power.",
  "Your body is a sacred vessel — care for it, but let spirit guide it.",
  "The prophets and angels will remind you of what has always belonged to you.",
  "Do not polish the outside while neglecting the inner life.",
  "Come to me — my burden is light, and my teaching is gentle.",
  
  // Sayings on Reading & Seeking
  "You can read the sky and soil — but learn also to read the truth standing before you.",
  "Seek, and you will find.",
  "Do not give what is holy to those who will trample it — share wisdom wisely.",
  "Whoever seeks with sincerity will be welcomed.",
  "If you lend, give freely, without expecting return.",
  
  // Sayings on Transformation
  "The Kingdom is like yeast hidden in dough — silent, but transforming everything.",
  "The Kingdom is like a woman with a jar of flour — though she lost some, what remained still baked bread.",
  "Prepare courage within before confronting what is powerful.",
  "My true family are those who live the Father's will.",
  "Give Caesar what belongs to Caesar, God what belongs to God — and give your heart to the Light.",
  
  // Sayings on Love & Sincerity
  "Love deeply — but let no attachment pull you away from truth.",
  "Hypocrisy blocks nourishment — be sincere.",
  "Blessed is the one who knows where danger enters and guards the heart.",
  "Do not fast out of performance — live rightly instead.",
  "Whoever understands the forces shaping their life becomes free from them.",
  
  // Sayings on Wholeness & Eternity
  "When you unite the divided parts of yourself, you become truly human.",
  "A shepherd leaves the ninety-nine to rescue the one — because each soul matters.",
  "Whoever drinks deeply of my teaching becomes like me — and I will live in them.",
  "The Kingdom is like treasure buried in a field — many stand upon it without knowing.",
  "Whoever becomes rich in the world should also learn to let go.",
  
  // Final Sayings
  "Heaven and earth will pass — but those born of the Living One will not see death.",
  "Woe to the soul ruled by appetite — and woe to the body ruled by fear. Let harmony guide both.",
  "They asked when the Kingdom will come. Jesus said: It is not a future event — the Kingdom is spread out upon the earth, but people do not see it.",
  "Peter said: Let Mary leave us. Jesus said: I will guide her, for in Spirit there is neither male nor female — all who unite heart and mind become living children of the Father.",

  // ===== ANCIENT EGYPTIAN PROVERBS (20) =====
  
  // Proverbs of Light & Shadow
  "The light within is the flame that feeds no smoke; it burns in silence, revealing all shadow.",
  "He who walks with a heavy heart casts no light; his steps vanish beneath him.",
  "The Father of Light weighs not gold but the glimmer of the heart's truth.",
  "The eye of Ra sees not flesh but fire; in the weighing hall, only light rises.",
  "The stone may shine in the sun, but only the just heart shines in the Duat.",
  
  // Proverbs of Ma'at & Justice
  "Those whose hearts are lighter than the feather do not fear the mirror of Osiris.",
  "The fool chases brightness outside, while his own fire withers unseen.",
  "The sun within is never eclipsed by the sky's turning—only by the inward veil.",
  "The Scales do not tremble for the loud; they tilt for those whose silence glows.",
  "When the ka departs, the heart speaks; and Ma'at listens for the light it gives.",
  
  // Proverbs of Judgment & Truth
  "The scribe writes your deeds in shadow; Ra reads them in flame.",
  "A heart filled with Isfet cannot reflect the stars; it swallows light like the abyss.",
  "To polish the heart is to prepare it for the gaze of Ra.",
  "The soul that carries its own sun will never be lost in the underworld.",
  "Light is not earned through speech but through the balance of silence and truth.",
  
  // Proverbs of the Inner Sun
  "The hidden sun within rises only when the outer eye is closed.",
  "The field of reeds welcomes only those who have shone from within.",
  "A crooked heart cannot pass the gate of Anubis, for its glow falters before Ma'at.",
  "Seek not the torches of men; seek the fire planted by the gods in your chest.",
  "He who fears the weighing has already seen his own darkness.",
];

const DisclaimerGate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const requestedPath = (location.state as { returnTo?: unknown } | null)?.returnTo;
  const returnTo = typeof requestedPath === "string" && requestedPath.startsWith("/") && requestedPath !== "/welcome"
    ? requestedPath
    : "/";
  
  // Random starting message, rotates every 2s
  const [messageIndex, setMessageIndex] = useState(() => 
    Math.floor(Math.random() * welcomeMessages.length)
  );

  // Rotate messages - TRUE random each time (not sequential)
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex(prev => {
        // Pick a random index that's different from current
        let newIndex;
        do {
          newIndex = Math.floor(Math.random() * welcomeMessages.length);
        } while (newIndex === prev && welcomeMessages.length > 1);
        return newIndex;
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // If already accepted, skip this page.
  // NOTE: no startTransition here — a transition keeps this gate painted on
  // screen until the destination chunk resolves, which looked like a frozen
  // page when arriving from a search result (e.g. /time-machine-gpt).
  useEffect(() => {
    if (getConsentAccepted()) {
      navigate(returnTo, { replace: true });
    }
  }, [navigate, returnTo]);

  useEffect(() => {
    const id = window.setTimeout(() => {
      window.dispatchEvent(new Event("aiwt:route-ready"));
    }, 120);

    return () => window.clearTimeout(id);
  }, []);

  const handleAccept = () => {
    // Guard against double-fire (rapid clicks / touch+click) which created
    // two overlapping <audio> instances and an echo effect.
    const w = window as Window & { __aiwtDisclaimerAccepted?: boolean; __aiwtDisclaimerAudio?: HTMLAudioElement | null; __aiwtBootTrace?: (event: string) => void };
    if (w.__aiwtDisclaimerAccepted) return;
    w.__aiwtDisclaimerAccepted = true;

    // The spoken welcome is intentionally limited to once per rolling week.
    // Mark before playback so rapid navigation or a blocked autoplay attempt can
    // never create repeated audio during the same visit.
    if (canPlayWeeklyWelcomeAudio()) try {
      markWeeklyWelcomeAudioPlayed();
      // Stop any prior instance just in case (HMR, back-nav, etc.)
      if (w.__aiwtDisclaimerAudio) {
        try { w.__aiwtDisclaimerAudio.pause(); } catch { /* A stale audio instance cannot block entry. */ }
        w.__aiwtDisclaimerAudio = null;
      }
      const audio = new Audio(disclaimerWelcomeAudio.url);
      audio.volume = 0.8;
      audio.preload = 'none';
      w.__aiwtDisclaimerAudio = audio;
      void audio.play().catch(() => {
        // Browser audio policies can block this; portal entry must continue.
      });
      // Tell WelcomeNeoVoice on "/" to stand down for ~15s so we never stack
      // two <audio> elements during the route transition.
      try {
        sessionStorage.setItem('aiwt:disclaimer-audio-at', String(Date.now()));
      } catch { /* storage may be unavailable */ }
      w.__aiwtBootTrace?.('disclaimer-audio-played');
    } catch (e) {
      // Audio must never block the disclaimer accept flow.
    }
    
    // Force scroll to top BEFORE navigation to prevent bottom-of-page glitch
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Set consent, then navigate immediately. A startTransition here kept this
    // gate painted while the destination's lazy chunk loaded, so arriving from
    // a search result looked like the tool page never opened. Navigating
    // outside a transition lets the route's own loader show instead.
    setConsentAccepted(true);
    navigate(returnTo, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <ImprovedSEOHead pageType="homepage" />
      <Helmet>
        <title>AI Web Tools — 5,500+ Best Free AI Tools Directory</title>
        <meta name="description" content="Explore 5,500+ AI tools: ChatGPT alternatives, custom GPTs, AI agents, image, video, writing and business AI — free and updated daily." />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="AI Web Tools — 5,500+ Best Free AI Tools Directory" />
        <meta property="og:description" content="Explore 5,500+ AI tools: ChatGPT alternatives, custom GPTs, AI agents, image, video, writing and business AI — free and updated daily." />
        <meta property="og:image" content="https://aiwebtools.app/og-default.jpg" />
        <meta name="twitter:title" content="AI Web Tools — 5,500+ Best Free AI Tools Directory" />
        <meta name="twitter:description" content="Explore 5,500+ AI tools: ChatGPT alternatives, custom GPTs, AI agents, image, video, writing and business AI — free and updated daily." />
        <meta name="twitter:image" content="https://aiwebtools.app/og-default.jpg" />
        <link rel="canonical" href="https://aiwebtools.app/" />
      </Helmet>

      <div className="max-w-md w-full bg-gray-900 border-2 border-cyan-500 rounded-2xl p-6 shadow-2xl shadow-cyan-500/30 animate-fade-in">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 mb-3">
            <Sparkles className="w-6 h-6 text-cyan-400 animate-pulse" />
            <h1 className="text-xl font-bold text-white">AI Web Tools Portal</h1>
          </div>
          {/* Rotating creative message */}
          <p 
            className="text-cyan-200 text-sm font-medium h-6 transition-opacity duration-300"
            style={{ textShadow: '0 0 10px rgba(34, 211, 238, 0.5)' }}
          >
            {welcomeMessages[messageIndex]}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <div className="bg-gray-800 rounded-lg p-3 border border-cyan-500/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📚</span>
              <div>
                <h2 className="text-cyan-300 font-semibold text-sm">Educational Purpose</h2>
                <p className="text-gray-300 text-xs">All content is for educational purposes only</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 border border-green-500/30">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-green-400" />
              <div>
                <h2 className="text-green-300 font-semibold text-sm">Use AI Ethically</h2>
                <p className="text-gray-300 text-xs">Always use AI tools responsibly</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 border border-yellow-500/30">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h2 className="text-yellow-300 font-semibold text-sm">Always Verify</h2>
                <p className="text-gray-300 text-xs">Cross-check AI content with reliable sources</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-3 border border-emerald-500/30">
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-emerald-400" />
              <div>
                <h2 className="text-emerald-300 font-semibold text-sm">Connecticut AI Disclosure</h2>
                <p className="text-gray-300 text-xs">
                  You may be interacting with AI-generated systems, agents, or content. Outputs may
                  contain errors — verify before relying on them. AI Web Tools LLC (Connecticut)
                  disclaims liability for AI-generated content.{" "}
                  <a href="/disclaimers" className="text-emerald-300 underline">Full notice</a>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <Button
          onClick={handleAccept}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-bold py-4 text-base"
        >
          <Check className="w-5 h-5 mr-2" />
          I Understand & Enter Portal
          <Sparkles className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default DisclaimerGate;
