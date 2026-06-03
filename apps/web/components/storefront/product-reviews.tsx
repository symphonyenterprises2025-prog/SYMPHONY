"use client";

import { useEffect, useState } from "react";
import { Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Review {
  id: string;
  name: string;
  rating: number;
  title: string | null;
  content: string;
  createdAt: string;
}

export function ProductReviews({ productId }: { productId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [average, setAverage] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ rating: 5, title: "", content: "" });
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch(`/api/reviews?productId=${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews);
        setAverage(data.average);
        setTotal(data.total);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    if (!formData.content) {
      setFormError("Please write a review");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, ...formData }),
      });

      if (res.ok) {
        setFormData({ rating: 5, title: "", content: "" });
        setShowForm(false);
        fetchReviews();
      } else {
        const data = await res.json();
        setFormError(data.error || "Failed to submit review");
      }
    } catch {
      setFormError("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          {total > 0 ? (
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-slate-950">{average}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= Math.round(average) ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500">({total} review{total !== 1 ? "s" : ""})</span>
            </div>
          ) : (
            <p className="text-slate-500">No reviews yet</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="rounded-full border-[#d0b57a]"
        >
          {showForm ? "Cancel" : "Write a Review"}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4 rounded-xl border border-[#eadfca] bg-[#fbf8f1] p-6">
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div>
            <Label>Rating</Label>
            <div className="mt-1 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData((p) => ({ ...p, rating: star }))}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 ${star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label htmlFor="reviewTitle">Title (optional)</Label>
            <Input
              id="reviewTitle"
              value={formData.title}
              onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
              placeholder="Great product!"
              className="h-10 rounded-xl border-[#e6dbc4]"
            />
          </div>
          <div>
            <Label htmlFor="reviewContent">Review *</Label>
            <Textarea
              id="reviewContent"
              value={formData.content}
              onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
              placeholder="Share your experience..."
              rows={4}
              className="rounded-xl border-[#e6dbc4]"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="rounded-full bg-[#1f3763] text-white hover:bg-[#172c53]"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}

      <div className="mt-6 space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="border-b border-[#efe4d1] pb-4 last:border-0">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3.5 w-3.5 ${star <= review.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-300"}`}
                  />
                ))}
              </div>
              <span className="font-semibold text-slate-950">{review.name}</span>
              <span className="text-xs text-slate-400">{new Date(review.createdAt).toLocaleDateString()}</span>
            </div>
            {review.title && (
              <p className="mt-2 font-semibold text-slate-800">{review.title}</p>
            )}
            <p className="mt-1 text-sm text-slate-600">{review.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
