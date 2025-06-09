"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Navbar } from "@/components/navbar"
import { Loader2, MessageCircle, Trash2, Globe, Calendar, Plus } from "lucide-react"
import { authService } from "@/lib/auth"
import { apiService, type Conversation } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function HistoryPage() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
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

  useEffect(() => {
    const loadConversations = async () => {
      if (!isAuthenticated) return

      try {
        const response = await apiService.getConversations()
        setConversations(response.conversations)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load conversations")
      } finally {
        setIsLoading(false)
      }
    }

    loadConversations()
  }, [isAuthenticated])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await apiService.deleteConversation(id)
      setConversations((prev) => prev.filter((conv) => conv._id !== id))
      toast({
        title: "Conversation deleted",
        description: "The conversation has been successfully deleted.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete conversation",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading conversations...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 animate-fade-in">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
                Analysis History
              </h1>
              <p className="text-lg text-muted-foreground">View and manage your website analysis conversations</p>
            </div>
            <Link href="/dashboard">
              <Button className="mt-4 sm:mt-0">
                <Plus className="h-4 w-4 mr-2" />
                New Analysis
              </Button>
            </Link>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Conversations Grid */}
          {conversations?.length === 0 ? (
            <Card className="text-center py-12 animate-slide-up">
              <CardContent>
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No analyses yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start by analyzing your first website to see it appear here.
                </p>
                <Link href="/dashboard">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Analyze Website
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {conversations.map((conversation, index) => (
                <Card
                  key={conversation._id}
                  className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                          {conversation.websiteTitle}
                        </CardTitle>
                        <CardDescription className="mt-1 line-clamp-1">{conversation.url}</CardDescription>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 hover:bg-destructive/10 hover:text-destructive"
                            disabled={deletingId === conversation._id}
                          >
                            {deletingId === conversation._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Conversation</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this conversation? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(conversation._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{conversation.summary}</p>

                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(conversation.createdAt)}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {conversation.messages?.length} messages
                      </Badge>
                    </div>

                    <Link href={`/chat/${conversation._id}`}>
                      <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Continue Chat
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
