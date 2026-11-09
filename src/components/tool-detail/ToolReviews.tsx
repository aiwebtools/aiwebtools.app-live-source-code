import { useCallback, useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Star, Loader2, MessageSquarePlus } from "lucide-react";
import { Tool } from "@/types/tools";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { generateToolSlug } from "@/utils/urlGenerator";
import { buildCanonicalUrl } from "@/utils/seo";
import { getDisplayedCategory } from "@/utils/toolCategoryDisplay";

interface ToolReviewsProps {
  tool: Tool;
  fallbackRating: number;
  fallbackVotes: number;
}

interface ReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  author_name: string;
  avatar_seed: string;
  created_at: string;
}

const REVIEW_SESSION_KEY = "aiwt_review_session";

/** Strip markup characters from visitor-supplied text before it enters JSON-LD. */
const sanitizeSchemaText = (value?: string | null): string =>
  (value || "").replace(/[<>]/g, "").replace(/[\u2028\u2029]/g, " ").trim();

const getReviewSession = (): string => {
  let id = sessionStorage.getItem(REVIEW_SESSION_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    sessionStorage.setItem(REVIEW_SESSION_KEY, id);
  }
  return id;
};

const StarRow = ({
  value,
  onChange,
  size = 18,
}: {
  value: number;
  onChange?: (next: number) => void;
  size?: number;
}) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map((star) => {
      const active = star <= Math.round(value);
      const StarIcon = (
        <Star
          size={size}
          className={active ? "fill-yellow-400 text-yellow-400" : "text-gray-600"}
          aria-hidden="true"
        />
      );
      return onChange ? (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} out of 5 stars`}
          className="transition-transform hover:scale-110"
        >
          {StarIcon}
        </button>
      ) : (
        <span key={star}>{StarIcon}</span>
      );
    })}
  </div>
);

const ToolReviews = ({ tool, fallbackRating, fallbackVotes }: ToolReviewsProps) => {
  const slug = useMemo(() => generateToolSlug(tool.title), [tool.title]);
  const { toast } = useToast();

  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [authorName, setAuthorName] = useState("");

  const loadReviews = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tool_reviews")
      .select("id, rating, comment, author_name, avatar_seed, created_at")
      .eq("tool_slug", slug)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) setReviews(data as ReviewRow[]);
    setLoading(false);
  }, [slug]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const communityAverage =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const displayRating = reviews.length > 0 ? communityAverage : fallbackRating;
  const displayCount = reviews.length > 0 ? reviews.length : fallbackVotes;

  const handleSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);

    const name = authorName.trim().slice(0, 60) || "Anonymous Seeker";
    const { error } = await supabase.from("tool_reviews").insert({
      tool_slug: slug,
      tool_title: tool.title,
      rating,
      comment: comment.trim().slice(0, 1200) || null,
      author_name: name,
      avatar_seed: name.toLowerCase().replace(/\s+/g, "-"),
      session_id: getReviewSession(),
    });

    setSubmitting(false);

    if (error) {
      toast({
        title: "Review not saved",
        description: "Something blocked the save. Please try again in a moment.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Thank you",
      description: `Your review of ${tool.title} is now live.`,
    });
    setComment("");
    setAuthorName("");
    setRating(5);
    setShowForm(false);
    loadReviews();
  };

  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    applicationCategory: getDisplayedCategory(tool) || "AI Tool",
    operatingSystem: "Web Browser",
    url: buildCanonicalUrl(`/${slug}`),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(displayRating.toFixed(1)),
      reviewCount: Math.max(displayCount, 1),
      bestRating: 5,
      worstRating: 1,
    },
    review: reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: sanitizeSchemaText(r.author_name) },
      datePublished: r.created_at.slice(0, 10),
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
        worstRating: 1,
      },
      reviewBody: sanitizeSchemaText(r.comment) || `${r.rating}-star rating for ${tool.title}.`,
    })),
  };

  // JSON.stringify does not escape "</script>", and Helmet writes the payload with
  // innerHTML — so every user-supplied string is stripped of angle brackets and the
  // serialized JSON has its unicode-escaped separators neutralised as well.
  const reviewSchemaJson = JSON.stringify(reviewSchema)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

  return (
    <section
      id="reviews"
      className="mt-8 rounded-lg border border-cyan-500/30 bg-gray-900/70 p-6"
      aria-labelledby="tool-reviews-heading"
    >
      <Helmet>
        <script type="application/ld+json">{reviewSchemaJson}</script>
      </Helmet>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2
            id="tool-reviews-heading"
            className="text-2xl font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
          >
            Reviews &amp; Ratings
          </h2>
          <div className="mt-2 flex items-center gap-3">
            <StarRow value={displayRating} size={20} />
            <span className="text-lg font-semibold text-cyan-300">
              {displayRating.toFixed(1)}
            </span>
            <span className="text-sm text-gray-400">
              {reviews.length > 0
                ? `${reviews.length} community review${reviews.length === 1 ? "" : "s"}`
                : "Be the first to review this tool"}
            </span>
          </div>
        </div>

        <Button
          onClick={() => setShowForm((open) => !open)}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500"
        >
          <MessageSquarePlus className="mr-2 h-4 w-4" />
          {showForm ? "Close" : "Write a review"}
        </Button>
      </div>

      {showForm && (
        <div className="mt-6 space-y-4 rounded-lg border border-cyan-500/20 bg-black/40 p-4">
          <div>
            <label className="mb-2 block text-sm text-gray-300">Your rating</label>
            <StarRow value={rating} onChange={setRating} size={24} />
          </div>
          <Input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            maxLength={60}
            placeholder="Your name (optional)"
            className="bg-gray-900/80 text-gray-100"
          />
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            maxLength={1200}
            rows={4}
            placeholder={`What did you think of ${tool.title}?`}
            className="bg-gray-900/80 text-gray-100"
          />
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="bg-gradient-to-r from-emerald-500 to-cyan-600 text-white"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Post review
          </Button>
        </div>
      )}

      <div className="mt-6 space-y-4">
        {loading && (
          <p className="text-sm text-gray-400">Loading reviews…</p>
        )}

        {!loading && reviews.length === 0 && (
          <p className="text-sm text-gray-400">
            No community reviews yet for {tool.title}. Share your experience and help the
            next seeker choose wisely.
          </p>
        )}

        {reviews.map((review) => (
          <article
            key={review.id}
            className="rounded-lg border border-gray-700/60 bg-gray-900/60 p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold text-white">
                  {review.author_name.charAt(0).toUpperCase()}
                </span>
                <div>
                  <p className="text-sm font-semibold text-cyan-200">
                    {review.author_name}
                  </p>
                  <time
                    dateTime={review.created_at}
                    className="text-xs text-gray-500"
                  >
                    {new Date(review.created_at).toLocaleDateString()}
                  </time>
                </div>
              </div>
              <StarRow value={review.rating} />
            </div>
            {review.comment && (
              <p className="mt-3 text-sm leading-relaxed text-gray-300">
                {review.comment}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default ToolReviews;
