"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Star, Send, ArrowLeft, Shield, User } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function FeedbackPage() {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [category, setCategory] = useState("")
  const [anonymous, setAnonymous] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${apiUrl}/api/feedback`)
      if (res.ok) {
        const data = await res.json()
        setReviews(data)
      }
    } catch (error) {
      console.error("Error fetching reviews:", error)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleSubmit = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${apiUrl}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          comment: feedback,
          category,
          anonymous,
          username: "User",
        })
      })

      if (res.ok) {
        setSubmitted(true)
        setRating(0)
        setFeedback("")
        setCategory("")
        setAnonymous(false)
        fetchReviews()
        setTimeout(() => setSubmitted(false), 3000)
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background selection:bg-primary selection:text-background font-sans">
      {/* Header */}
      <header className="border-b border-border bg-background px-6 py-3">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground font-mono hover:text-foreground rounded-none bg-transparent">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-none bg-[#0d1117] text-primary">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <h1 className="text-lg font-mono font-bold uppercase tracking-widest text-foreground font-mono">Feedback & Reviews</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Feedback Form */}
          <div className="noc-panel p-6 mb-6">
            <div className="mb-4 border-b border-border pb-4">
              <h3 className="text-sm font-mono text-primary uppercase flex items-center gap-2 mb-1">Share Your Feedback</h3>
              <p className="text-xs font-mono text-muted-foreground">
                Help us improve by sharing your experience with our IP blocking application
              </p>
            </div>
            <div className="space-y-6">
              {/* Star Rating */}
              <div className="space-y-2">
                <Label className="text-muted-foreground font-mono text-xs">Rate your experience</Label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="transition-colors"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || rating)
                            ? "fill-primary text-primary"
                            : "text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-muted-foreground font-mono text-xs">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </p>
                )}
              </div>

              {/* Category Selection */}
              <div className="space-y-2">
                <Label className="text-muted-foreground font-mono text-xs">What did you use this app for?</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="noc-input border-border rounded-none focus-visible:ring-0 text-foreground font-mono">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="noc-input border-border rounded-none focus-visible:ring-0">
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feedback Text */}
              <div className="space-y-2">
                <Label htmlFor="feedback" className="text-muted-foreground font-mono text-xs">Write your feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us about your experience, suggestions for improvement, or any issues you encountered..."
                  className="min-h-[120px] noc-input border-border rounded-none focus-visible:ring-0 text-foreground font-mono placeholder:text-muted-foreground font-mono text-xs focus:border-blue-500"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="anonymous" className="text-muted-foreground font-mono text-xs">Submit anonymously</Label>
                <Switch
                  id="anonymous"
                  checked={anonymous}
                  onCheckedChange={setAnonymous}
                  className="data-[state=checked]:bg-primary"
                />
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit} 
                className="w-full noc-button rounded-none border border-border hover:border-primary disabled:opacity-50 h-12"
                disabled={!rating || !feedback.trim() || !category || loading}
              >
                <Send className="mr-2 h-4 w-4" />
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>

              {/* Success Message */}
              {submitted && (
                <div className="rounded-none bg-green-900/20 p-4 text-green-400 border border-green-500/50">
                  <p className="font-medium">Thank you for your feedback!</p>
                  <p className="text-sm">Your review has been submitted successfully.</p>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Display */}
          <div className="noc-panel p-6 mb-6">
            <div className="mb-4 border-b border-border pb-4">
              <h3 className="text-sm font-mono text-primary uppercase flex items-center gap-2 mb-1">Recent Reviews</h3>
              <p className="text-xs font-mono text-muted-foreground">
                See what other users are saying about our application
              </p>
            </div>
            <div className="space-y-4">
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-none bg-[#0d1117] border border-primary">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground font-mono">{review.username}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "fill-primary text-primary"
                                      : "text-slate-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge variant="outline" className="text-xs border-border text-muted-foreground font-mono text-xs">
                              {review.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground font-mono text-xs">{new Date(review.createdAt || new Date()).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground font-mono text-xs pl-13">
                      {review.comment}
                    </p>
                    {index < reviews.length - 1 && <Separator className="bg-slate-700" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="noc-panel p-6 mb-6">
          <div className="mb-4 border-b border-border pb-4">
            <h3 className="text-sm font-mono text-primary uppercase flex items-center gap-2 mb-1">Feedback Statistics</h3>
          </div>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-lg font-mono font-bold uppercase tracking-widest text-foreground font-mono">
                  {reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : "0"}
                </div>
                <div className="text-sm text-muted-foreground font-mono text-xs">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-mono font-bold uppercase tracking-widest text-foreground font-mono">{reviews.length}</div>
                <div className="text-sm text-muted-foreground font-mono text-xs">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-mono font-bold uppercase tracking-widest text-foreground font-mono">
                  {reviews.length > 0 ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100) : 0}%
                </div>
                <div className="text-sm text-muted-foreground font-mono text-xs">Positive Feedback</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-mono font-bold uppercase tracking-widest text-foreground font-mono">
                  {reviews.filter(r => new Date(r.createdAt || new Date()).getMonth() === new Date().getMonth()).length}
                </div>
                <div className="text-sm text-muted-foreground font-mono text-xs">This Month</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
