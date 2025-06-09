"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "@/components/navbar"
import { Loader2, Globe, Sparkles, ArrowRight, History, Brain } from "lucide-react"
import { authService } from "@/lib/auth"
import { apiService, type AnalysisResponse } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const [url, setUrl] = useState("")
  const [useJavaScript, setUseJavaScript] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push("/login")
        return
      }

      try {
        await authService.getProfile()
        setIsAuthenticated(true)
      } catch (error) {
        router.push("/login")
      }
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)
    setAnalysis(null)

    if (!url.trim()) {
      setError("Please enter a valid URL")
      setIsLoading(false)
      return
    }

    // Add protocol if missing
    let processedUrl = url.trim()
    if (!processedUrl.startsWith("http://") && !processedUrl.startsWith("https://")) {
      processedUrl = "https://" + processedUrl
    }

    try {
      const result = await apiService.analyzeWebsite(processedUrl, useJavaScript)
      setAnalysis(result)
      toast({
        title: "Analysis Complete!",
        description: "Website has been successfully analyzed.",
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Analysis failed")
    } finally {
      setIsLoading(false)
    }
  }

  const handleStartChat = () => {
    if (analysis) {
      router.push(`/chat/${analysis.conversationId}`)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
              AI Website Analysis
            </h1>
            <p className="text-lg text-muted-foreground">
              Enter any website URL to get comprehensive AI-powered insights
            </p>
          </div>

          {/* Analysis Form */}
          <Card className="mb-8 animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2 text-primary" />
                Analyze Website
              </CardTitle>
              <CardDescription>Enter a website URL to get detailed analysis and insights</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="url">Website URL</Label>
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    required
                    disabled={isLoading}
                    className="text-lg"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="useJavaScript"
                    checked={useJavaScript}
                    onCheckedChange={(checked) => setUseJavaScript(checked as boolean)}
                    disabled={isLoading}
                  />
                  <Label htmlFor="useJavaScript" className="text-sm">
                    Use JavaScript rendering (for dynamic websites)
                  </Label>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing Website...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Analyze Website
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysis && (
            <Card className="animate-fade-in">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Brain className="h-5 w-5 mr-2 text-primary" />
                    Analysis Results
                  </div>
                  <Button onClick={handleStartChat} className="ml-4">
                    Start Chat
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardTitle>
                <CardDescription>AI-powered analysis of {analysis.websiteTitle}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Website Title</h3>
                  <p className="text-muted-foreground">{analysis.websiteTitle}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">URL</h3>
                  <p className="text-muted-foreground break-all">{analysis.url}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">AI Summary</h3>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <p className="whitespace-pre-wrap">{analysis.summary}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Button onClick={handleStartChat} className="flex-1">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Ask Questions About This Website
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/history")} className="flex-1">
                    <History className="mr-2 h-4 w-4" />
                    View All Analyses
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
