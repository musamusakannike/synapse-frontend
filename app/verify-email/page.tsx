"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "@/components/navbar"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { authService } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token")

      if (!token) {
        setStatus("error")
        setMessage("Invalid verification link. Please check your email for the correct link.")
        return
      }

      try {
        const response = await authService.verifyEmail(token)
        setStatus("success")
        setMessage(response.message)
        toast({
          title: "Email verified!",
          description: "Your email has been successfully verified.",
        })

        // Redirect to dashboard after a short delay
        setTimeout(() => {
          router.push("/dashboard")
        }, 3000)
      } catch (error) {
        setStatus("error")
        setMessage(error instanceof Error ? error.message : "Email verification failed")
      }
    }

    verifyEmail()
  }, [searchParams, router, toast])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      <div className="container mx-auto px-4 py-20 flex items-center justify-center">
        <Card className="w-full max-w-md animate-fade-in">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4">
              {status === "loading" && (
                <div className="bg-primary/10">
                  <Loader2 className="h-6 w-6 text-primary animate-spin" />
                </div>
              )}
              {status === "success" && (
                <div className="bg-green-100 dark:bg-green-900">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              )}
              {status === "error" && (
                <div className="bg-red-100 dark:bg-red-900">
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                </div>
              )}
            </div>
            <CardTitle className="text-2xl">
              {status === "loading" && "Verifying Email..."}
              {status === "success" && "Email Verified!"}
              {status === "error" && "Verification Failed"}
            </CardTitle>
            <CardDescription>
              {status === "loading" && "Please wait while we verify your email address."}
              {status === "success" && "Your email has been successfully verified."}
              {status === "error" && "There was a problem verifying your email."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {message && (
              <Alert variant={status === "error" ? "destructive" : "default"}>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {status === "success" && (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  You will be redirected to the dashboard in a few seconds.
                </p>
                <Link href="/dashboard">
                  <Button className="w-full">Go to Dashboard</Button>
                </Link>
              </div>
            )}

            {status === "error" && (
              <div className="space-y-2">
                <Link href="/login">
                  <Button className="w-full">Go to Login</Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" className="w-full">
                    Create New Account
                  </Button>
                </Link>
              </div>
            )}

            {status === "loading" && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground">This may take a few moments...</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
