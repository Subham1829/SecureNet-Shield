"use client"

import { useState } from "react"
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

  const handleSubmit = () => {
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  const reviews = [
    {
      username: "Alex Johnson",
      rating: 5,
      comment: "Excellent tool for network security! The IP analysis feature is incredibly detailed and helpful.",
      date: "2024-01-15",
      category: "Security"
    },
    {
      username: "Sarah Chen",
      rating: 4,
      comment: "Great for learning about different IP types. The interface is clean and intuitive.",
      date: "2024-01-14",
      category: "Learning"
    },
    {
      username: "Mike Rodriguez",
      rating: 5,
      comment: "The auto-blocking feature saved our network from multiple threats. Highly recommended!",
      date: "2024-01-13",
      category: "Monitoring"
    },
    {
      username: "Anonymous",
      rating: 4,
      comment: "Good tool overall, but would love to see more advanced filtering options.",
      date: "2024-01-12",
      category: "Other"
    }
  ]

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm px-4 py-4">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="text-slate-400 hover:text-white">
              <Link href="/dashboard">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600">
                <Shield className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">Feedback & Reviews</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Feedback Form */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Share Your Feedback</CardTitle>
              <CardDescription className="text-slate-400">
                Help us improve by sharing your experience with our IP blocking application
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Star Rating */}
              <div className="space-y-2">
                <Label className="text-slate-300">Rate your experience</Label>
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
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-600"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-sm text-slate-400">
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
                <Label className="text-slate-300">What did you use this app for?</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="learning">Learning</SelectItem>
                    <SelectItem value="monitoring">Monitoring</SelectItem>
                    <SelectItem value="security">Security</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Feedback Text */}
              <div className="space-y-2">
                <Label htmlFor="feedback" className="text-slate-300">Write your feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Tell us about your experience, suggestions for improvement, or any issues you encountered..."
                  className="min-h-[120px] bg-slate-800 border-slate-600 text-white placeholder:text-slate-500 focus:border-blue-500"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                />
              </div>

              {/* Anonymous Toggle */}
              <div className="flex items-center justify-between">
                <Label htmlFor="anonymous" className="text-slate-300">Submit anonymously</Label>
                <Switch
                  id="anonymous"
                  checked={anonymous}
                  onCheckedChange={setAnonymous}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit} 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={!rating || !feedback.trim() || !category}
              >
                <Send className="mr-2 h-4 w-4" />
                Submit Feedback
              </Button>

              {/* Success Message */}
              {submitted && (
                <div className="rounded-lg bg-green-900/20 p-4 text-green-400 border border-green-500/50">
                  <p className="font-medium">Thank you for your feedback!</p>
                  <p className="text-sm">Your review has been submitted successfully.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Reviews Display */}
          <Card className="bg-slate-900/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Reviews</CardTitle>
              <CardDescription className="text-slate-400">
                See what other users are saying about our application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {reviews.map((review, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20">
                          <User className="h-5 w-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{review.username}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-slate-600"
                                  }`}
                                />
                              ))}
                            </div>
                            <Badge variant="outline" className="text-xs border-slate-600 text-slate-400">
                              {review.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">{review.date}</span>
                    </div>
                    <p className="text-sm text-slate-300 pl-13">
                      {review.comment}
                    </p>
                    {index < reviews.length - 1 && <Separator className="bg-slate-700" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <Card className="mt-6 bg-slate-900/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Feedback Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">4.5</div>
                <div className="text-sm text-slate-400">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">127</div>
                <div className="text-sm text-slate-400">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">89%</div>
                <div className="text-sm text-slate-400">Positive Feedback</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24</div>
                <div className="text-sm text-slate-400">This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
