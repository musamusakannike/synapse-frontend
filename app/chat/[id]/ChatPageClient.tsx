"use client"
import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import { Loader2, Send, Bot, User, ArrowLeft, Globe } from "lucide-react"
import { authService } from "@/lib/auth"
import { apiService, type Conversation } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

export default function ChatPage({ id }: { id: string }) {
    const [conversation, setConversation] = useState<Conversation | null>(null)
    const [question, setQuestion] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingConversation, setIsLoadingConversation] = useState(true)
    const [error, setError] = useState("")
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { toast } = useToast()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

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
        const loadConversation = async () => {
            if (!isAuthenticated) return

            try {
                const response = await apiService.getConversation(id)
                setConversation(response.conversation)
            } catch (error) {
                setError(error instanceof Error ? error.message : "Failed to load conversation")
                toast({
                    title: "Error",
                    description: "Failed to load conversation",
                    variant: "destructive",
                })
            } finally {
                setIsLoadingConversation(false)
            }
        }

        loadConversation()
    }, [id, isAuthenticated, toast])

    useEffect(() => {
        scrollToBottom()
    }, [conversation?.messages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!question.trim() || !conversation) return

        setError("")
        setIsLoading(true)

        const userQuestion = question.trim()
        setQuestion("")

        // Optimistically add user message
        const userMessage = {
            type: "question" as const,
            content: userQuestion,
            timestamp: new Date().toISOString(),
        }

        setConversation((prev) =>
            prev
                ? {
                    ...prev,
                    messages: [...prev.messages, userMessage],
                }
                : null,
        )

        try {
            const response = await apiService.askQuestion(conversation._id, userQuestion)

            // Add AI response
            const aiMessage = {
                type: "answer" as const,
                content: response.answer,
                timestamp: new Date().toISOString(),
            }

            setConversation((prev) =>
                prev
                    ? {
                        ...prev,
                        messages: [...prev.messages, aiMessage],
                    }
                    : null,
            )

            toast({
                title: "Question answered!",
                description: "The AI has provided a response to your question.",
            })
        } catch (error) {
            setError(error instanceof Error ? error.message : "Failed to get answer")
            // Remove the optimistic user message on error
            setConversation((prev) =>
                prev
                    ? {
                        ...prev,
                        messages: prev.messages.slice(0, -1),
                    }
                    : null,
            )
        } finally {
            setIsLoading(false)
        }
    }

    if (!isAuthenticated || isLoadingConversation) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
                <Navbar />
                <div className="container mx-auto px-4 py-20 flex items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                        <p>Loading conversation...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error && !conversation) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
                <Navbar />
                <div className="container mx-auto px-4 py-20 flex items-center justify-center">
                    <Card className="w-full max-w-md">
                        <CardContent className="p-6 text-center">
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                            <Button onClick={() => router.push("/dashboard")} className="mt-4">
                                Back to Dashboard
                            </Button>
                        </CardContent>
                    </Card>
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
                    <div className="flex items-center mb-6 animate-fade-in">
                        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mr-4">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold flex items-center">
                                <Globe className="h-6 w-6 mr-2 text-primary" />
                                {conversation?.websiteTitle || "Website Chat"}
                            </h1>
                            {conversation?.url && <p className="text-sm text-muted-foreground break-all">{conversation.url}</p>}
                        </div>
                    </div>

                    {/* Chat Container */}
                    <Card className="h-[600px] flex flex-col animate-slide-up">
                        <CardHeader className="border-b">
                            <CardTitle className="text-lg">AI Conversation</CardTitle>
                        </CardHeader>

                        {/* Messages */}
                        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                            {/* Initial Summary */}
                            {conversation?.summary && (
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 bg-muted rounded-lg p-3">
                                        <p className="text-sm font-medium mb-1">Initial Analysis</p>
                                        <p className="text-sm whitespace-pre-wrap">{conversation.summary}</p>
                                    </div>
                                </div>
                            )}

                            {/* Chat Messages */}
                            {conversation?.messages.map((message, index) => (
                                <div key={index} className="flex items-start space-x-3">
                                    <div
                                        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.type === "question" ? "bg-primary text-primary-foreground" : "bg-primary/10"
                                            }`}
                                    >
                                        {message.type === "question" ? (
                                            <User className="h-4 w-4" />
                                        ) : (
                                            <Bot className="h-4 w-4 text-primary" />
                                        )}
                                    </div>
                                    <div
                                        className={`flex-1 rounded-lg p-3 ${message.type === "question"
                                                ? "bg-primary text-primary-foreground ml-auto max-w-[80%]"
                                                : "bg-muted"
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                        <p className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Loading indicator */}
                            {isLoading && (
                                <div className="flex items-start space-x-3">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                        <Bot className="h-4 w-4 text-primary" />
                                    </div>
                                    <div className="flex-1 bg-muted rounded-lg p-3">
                                        <div className="flex items-center space-x-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <p className="text-sm">AI is thinking...</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </CardContent>

                        {/* Input Form */}
                        <div className="border-t p-4">
                            {error && (
                                <Alert variant="destructive" className="mb-4">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit} className="flex space-x-2">
                                <Input
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    placeholder="Ask a question about this website..."
                                    disabled={isLoading}
                                    className="flex-1"
                                />
                                <Button type="submit" disabled={isLoading || !question.trim()}>
                                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                            </form>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
