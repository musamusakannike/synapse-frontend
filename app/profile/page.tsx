"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Loader2, User, Mail, Calendar, Shield } from "lucide-react"
import { authService, type User as UserType } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
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
        const userData = await authService.getProfile()
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to load profile")
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleResendVerification = async () => {
    if (!user?.email) return

    try {
      await authService.resendVerification(user.email)
      toast({
        title: "Verification email sent",
        description: "Please check your email for the verification link.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to send verification email",
        variant: "destructive",
      })
    }
  }

  if (!isAuthenticated || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
        <Navbar />
        <div className="container mx-auto px-4 py-20 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
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
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="text-lg text-muted-foreground">Manage your account information and settings</p>
          </div>

          {/* Profile Card */}
          <Card className="animate-slide-up">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2 text-primary" />
                Account Information
              </CardTitle>
              <CardDescription>Your personal information and account status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" value={user?.fullName || ""} disabled className="bg-muted" />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="flex items-center space-x-2">
                  <Input id="email" value={user?.email || ""} disabled className="bg-muted flex-1" />
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {user?.isEmailVerified ? (
                      <Badge
                        variant="default"
                        className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">Unverified</Badge>
                    )}
                  </div>
                </div>
                {!user?.isEmailVerified && (
                  <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      Your email address is not verified. Please check your email or resend the verification link.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleResendVerification}
                      className="ml-4 border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-700 dark:text-yellow-200 dark:hover:bg-yellow-900/40"
                    >
                      Resend
                    </Button>
                  </div>
                )}
              </div>

              {/* User ID */}
              <div className="space-y-2">
                <Label htmlFor="userId">User ID</Label>
                <Input id="userId" value={user?.id || ""} disabled className="bg-muted font-mono text-sm" />
              </div>

              {/* Account Status */}
              <div className="pt-4 border-t">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-primary" />
                  Account Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                    <p className="text-lg font-semibold">Free User</p>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">Member Since</p>
                    <p className="text-lg font-semibold">
                      {new Date().toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                      })}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button onClick={() => router.push("/dashboard")} className="flex-1">
                    Back to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      authService.logout()
                      router.push("/")
                      toast({
                        title: "Logged out",
                        description: "You have been successfully logged out.",
                      })
                    }}
                    className="flex-1"
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
