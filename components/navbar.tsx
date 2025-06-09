"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Brain, LogOut, User, History, Menu, X, Sparkles } from "lucide-react"
import { authService, type User as UserType } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"

export function Navbar() {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = await authService.getProfile()
          setUser(userData)
        }
      } catch (error) {
        console.error("Failed to load user:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    router.push("/")
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <nav className={`border-b backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 transition-all duration-500 py-2 ${scrolled
        ? 'bg-background/95 shadow-lg border-primary/20'
        : 'bg-background/60 border-border/50'
      }`}>
      <div className="container mx-auto px-4">
        <div className="flex h-18 items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group transition-all duration-300 hover:scale-105">
            <div className="relative">
              <Brain className="h-9 w-9 text-primary group-hover:animate-pulse transition-all duration-300" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary/20 rounded-full animate-ping group-hover:bg-primary/40"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-purple-600 to-primary bg-clip-text text-transparent group-hover:from-purple-600 group-hover:to-primary transition-all duration-500">
              Synapse
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {user && (
              <div className="flex items-center space-x-2">
                <Link href="/dashboard">
                  <Button
                    variant="ghost"
                    className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 rounded-xl px-6 py-2 relative group"
                  >
                    <span className="relative z-10">Dashboard</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </Link>
                <Link href="/history">
                  <Button
                    variant="ghost"
                    className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 rounded-xl px-6 py-2 relative group"
                  >
                    <History className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                    <span className="relative z-10">History</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/0 to-primary/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </Link>
              </div>
            )}

            <div className="flex items-center space-x-4">
              <div className="hover:scale-110 transition-transform duration-300">
                <ModeToggle />
              </div>

              {isLoading ? (
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary/20 to-purple-500/20 animate-pulse"></div>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:scale-110 transition-all duration-300 group">
                      <Avatar className="h-10 w-10 border-2 border-primary/20 group-hover:border-primary/60 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                        <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-sm">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-background animate-pulse"></div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="w-64 backdrop-blur-xl bg-background/95 border-primary/20 shadow-2xl rounded-2xl p-2"
                    align="end"
                    forceMount
                  >
                    <div className="flex items-center justify-start gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-purple-500/5 mb-2">
                      <Avatar className="h-12 w-12 border-2 border-primary/30">
                        <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white font-bold">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-semibold text-lg">{user.fullName}</p>
                        <p className="w-[160px] truncate text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-primary/10" />
                    <DropdownMenuItem asChild className="rounded-xl hover:bg-primary/10 transition-all duration-300 cursor-pointer my-1">
                      <Link href="/profile" className="flex items-center p-3">
                        <User className="mr-3 h-5 w-5 text-primary" />
                        <span className="font-medium">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="rounded-xl hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 transition-all duration-300 cursor-pointer p-3 my-1"
                    >
                      <LogOut className="mr-3 h-5 w-5" />
                      <span className="font-medium">Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105 rounded-xl px-6 py-2 font-medium"
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/register">
                    <Button className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl px-6 py-2 font-medium group">
                      <Sparkles className="h-4 w-4 mr-2 group-hover:animate-spin" style={{ animationDuration: '2s' }} />
                      Get Started
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <div className="hover:scale-110 transition-transform duration-300">
              <ModeToggle />
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="hover:bg-primary/10 transition-all duration-300 hover:scale-110 rounded-xl p-2"
            >
              <div className="relative">
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-primary animate-spin" style={{ animationDuration: '0.3s' }} />
                ) : (
                  <Menu className="h-6 w-6 text-primary" />
                )}
              </div>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation with Enhanced Animation */}
        <div className={`md:hidden border-t border-primary/10 overflow-hidden transition-all duration-500 ease-out ${isMobileMenuOpen
            ? 'max-h-96 opacity-100 py-6'
            : 'max-h-0 opacity-0 py-0'
          }`}>
          {user ? (
            <div className="space-y-3">
              <div className="px-4 py-4 border-b border-primary/10 bg-gradient-to-r from-primary/5 to-purple-500/5 rounded-xl mx-2 mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 border-2 border-primary/30">
                    <AvatarFallback className="bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-sm">
                      {getInitials(user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </div>

              {[
                { href: "/dashboard", label: "Dashboard", icon: null },
                { href: "/history", label: "History", icon: History },
                { href: "/profile", label: "Profile", icon: User }
              ].map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <Button
                    variant="ghost"
                    className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-xl py-3 px-4 group"
                  >
                    {item.icon && <item.icon className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />}
                    <span className="font-medium">{item.label}</span>
                  </Button>
                </Link>
              ))}

              <Button
                variant="ghost"
                className="w-full justify-start hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 transition-all duration-300 rounded-xl py-3 px-4 group"
                onClick={() => {
                  handleLogout()
                  setIsMobileMenuOpen(false)
                }}
              >
                <LogOut className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform duration-300" />
                <span className="font-medium">Log out</span>
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full hover:bg-primary/10 hover:text-primary transition-all duration-300 rounded-xl py-3 font-medium"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white shadow-lg transition-all duration-300 rounded-xl py-3 font-medium group">
                  <Sparkles className="h-4 w-4 mr-2 group-hover:animate-spin" style={{ animationDuration: '2s' }} />
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}