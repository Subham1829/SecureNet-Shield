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
    <div className="min-h-screen bg-[#0d1224] selection:bg-[#2f6bff] selection:text-white font-sans text-[#f5f5f7]">
      {/* Background Glow Effect */}
      <div 
        className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#2563eb]/20 blur-[120px] rounded-full pointer-events-none" 
      />

      {/* Header */}
      <header className="border-b border-white/5 bg-[#10141f]/80 backdrop-blur-md px-6 py-4 sticky top-0 z-50">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="text-[#8b93a7] hover:text-white hover:bg-white/5 rounded-lg transition-colors border-0">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-3 ml-auto sm:ml-0">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2f6bff] shadow-[0_0_20px_rgba(47,107,255,0.4)]">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Feedback & Reviews</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6 relative z-10 pt-10">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Feedback Form */}
          <div className="p-8 rounded-2xl border border-white/5 bg-[#10141f] shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-px bg-gradient-to-r from-transparent via-[#2f6bff]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="mb-6 border-b border-white/5 pb-6">
              <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">Share Your Feedback</h3>
              <p className="text-sm text-[#8b93a7]">
                Help us improve by sharing your experience with our IP blocking application
              </p>
            </div>
            <div className="space-y-6">
              {/* Star Rating */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-[#8b93a7]">Rate your experience</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      className="transition-transform hover:scale-110 focus:outline-none"
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={`h-8 w-8 transition-colors ${
                          star <= (hoveredRating || rating)
                            ? "fill-[#2f6bff] text-[#2f6bff] drop-shadow-[0_0_8px_rgba(47,107,255,0.5)]"
                            : "text-[#8b93a7]/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm font-medium text-[#2f6bff]">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </p>
                )}
              </div>

              {/* Category Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold text-[#8b93a7]">What did you use this app for?</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-full bg-white/5 border-white/10 rounded-xl h-11 text-sm text-[#f5f5f7] focus:ring-1 focus:ring-[#2f6bff]/50 hover:bg-white/10 transition-colors">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#10141f] border-white/10 text-[#f5f5f7] rounded-xl">
                    <SelectItem value="learning" className="focus:bg-[#2f6bff]/20 focus:text-white cursor-pointer rounded-lg">Learning</SelectItem>
                    <SelectItem value="monitoring" className="focus:bg-[#2f6bff]/20 focus:text-white cursor-pointer rounded-lg">Monitoring</SelectItem>
                    <SelectItem value="security" className="focus:bg-[#2f6bff]/20 focus:text-white cursor-pointer rounded-lg">Security</SelectItem>
                    <SelectItem value="other" className="focus:bg-[#2f6bff]/20 focus:text-white cursor-pointer rounded-lg">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feedback Text */}
              <div className="space-y-3">
                <Label htmlFor="feedback" className="text-sm font-semibold text-[#8b93a7]">Write your feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us about your experience, suggestions for improvement, or any issues you encountered..."
                  className="min-h-[140px] bg-white/5 border-white/10 rounded-xl p-4 text-sm text-[#f5f5f7] placeholder:text-[#8b93a7]/50 focus-visible:ring-1 focus-visible:ring-[#2f6bff]/50 hover:bg-white/10 transition-colors resize-none"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <div className="space-y-0.5">
                  <Label htmlFor="anonymous" className="text-sm font-semibold text-[#f5f5f7]">Submit anonymously</Label>
                  <p className="text-xs text-[#8b93a7]">Hide your username from public display</p>
                </div>
                <Switch
                  id="anonymous"
                  checked={anonymous}
                  onCheckedChange={setAnonymous}
                  className="data-[state=checked]:bg-[#2f6bff] data-[state=unchecked]:bg-white/10"
                />
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit} 
                className="w-full h-12 rounded-xl text-sm font-bold text-white bg-[#2f6bff] hover:bg-[#2563eb] transition-all shadow-[0_0_20px_rgba(47,107,255,0.2)] hover:shadow-[0_0_30px_rgba(47,107,255,0.4)] disabled:opacity-50 disabled:hover:shadow-none border-0"
                disabled={!rating || !feedback.trim() || !category || loading}
              >
                <Send className="mr-2 h-4 w-4" />
                {loading ? "Submitting..." : "Submit Feedback"}
              </Button>

              {/* Success Message */}
              {submitted && (
                <div className="rounded-xl bg-green-500/10 p-4 text-green-400 border border-green-500/20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                    <Shield className="h-4 w-4 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Thank you for your feedback!</p>
                    <p className="text-xs opacity-90">Your review has been submitted successfully.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Reviews Display */}
          <div className="p-8 rounded-2xl border border-white/5 bg-[#10141f] shadow-xl">
            <div className="mb-6 border-b border-white/5 pb-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-2">Recent Reviews</h3>
                <p className="text-sm text-[#8b93a7]">
                  See what other users are saying
                </p>
              </div>
              <Badge variant="outline" className="bg-[#2f6bff]/10 text-[#2f6bff] border-[#2f6bff]/20 rounded-full px-3 py-1 font-semibold">
                {reviews.length} Total
              </Badge>
            </div>
            
            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {reviews.length === 0 ? (
                <div className="text-center py-10 text-[#8b93a7]">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                    <Star className="h-8 w-8 text-[#8b93a7]/30" />
                  </div>
                  <p>No reviews yet. Be the first to share your feedback!</p>
                </div>
              ) : (
                reviews.map((review, index) => (
                  <div key={index} className="group">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#2f6bff]/20 to-purple-500/20 border border-white/10">
                          <User className="h-5 w-5 text-[#f5f5f7]" />
                        </div>
                        <div>
                          <p className="font-semibold text-[#f5f5f7] text-sm">
                            {review.anonymous ? "Anonymous User" : review.username || "User"}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-3.5 w-3.5 ${
                                    star <= review.rating
                                      ? "fill-[#2f6bff] text-[#2f6bff]"
                                      : "text-[#8b93a7]/30"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-[#8b93a7] bg-white/5 px-2 py-0.5 rounded">
                              {review.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#8b93a7]">
                        {new Date(review.createdAt || new Date()).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-[#8b93a7] pl-13 leading-relaxed">
                      {review.comment}
                    </p>
                    {index < reviews.length - 1 && <Separator className="mt-6 bg-white/5" />}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 p-8 rounded-2xl border border-white/5 bg-[#10141f] shadow-xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#2f6bff]/5 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="mb-8 flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">Feedback Statistics</h3>
          </div>
          
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="text-sm font-semibold text-[#8b93a7] mb-2 uppercase tracking-wider">Average Rating</div>
              <div className="text-3xl font-extrabold text-white flex items-baseline gap-2">
                {reviews.length > 0 ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) : "0.0"}
                <Star className="h-5 w-5 fill-[#2f6bff] text-[#2f6bff] mb-1" />
              </div>
            </div>
            
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="text-sm font-semibold text-[#8b93a7] mb-2 uppercase tracking-wider">Total Reviews</div>
              <div className="text-3xl font-extrabold text-white">
                {reviews.length}
              </div>
            </div>
            
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="text-sm font-semibold text-[#8b93a7] mb-2 uppercase tracking-wider">Positive Feedback</div>
              <div className="text-3xl font-extrabold text-white flex items-center gap-2">
                {reviews.length > 0 ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100) : 0}%
                <span className="text-[#2563eb] text-sm font-medium">↑</span>
              </div>
            </div>
            
            <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <div className="text-sm font-semibold text-[#8b93a7] mb-2 uppercase tracking-wider">This Month</div>
              <div className="text-3xl font-extrabold text-white flex items-center gap-2">
                {reviews.filter(r => new Date(r.createdAt || new Date()).getMonth() === new Date().getMonth()).length}
                <span className="text-[#2563eb] text-sm font-medium">New</span>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Global styles for custom scrollbar within this page */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  )
}
