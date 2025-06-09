"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navbar } from "@/components/navbar"
import { Brain, Zap, Shield, Globe, ArrowRight, Sparkles } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/3 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8 backdrop-blur-sm border border-primary/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 cursor-default">
            <Sparkles className="h-4 w-4 mr-2 animate-spin" style={{animationDuration: '3s'}} />
            AI-Powered Website Analysis
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-purple-600 bg-clip-text text-transparent leading-tight tracking-tight">
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-foreground via-primary to-purple-600" style={{animationDelay: '0s', animationDuration: '2s'}}>Unlock</span>{' '}
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-primary to-purple-600" style={{animationDelay: '0.2s', animationDuration: '2s'}}>Website</span>{' '}
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-primary to-purple-600" style={{animationDelay: '0.4s', animationDuration: '2s'}}>Insights</span>{' '}
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-primary to-purple-600" style={{animationDelay: '0.6s', animationDuration: '2s'}}>with</span>{' '}
            <span className="inline-block animate-bounce text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-primary to-foreground" style={{animationDelay: '0.8s', animationDuration: '2s'}}>AI</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed opacity-0 animate-fade-in-up" style={{animationDelay: '1s', animationFillMode: 'forwards'}}>
            Analyze any website instantly with our advanced AI. Get comprehensive summaries, ask intelligent questions,
            and discover hidden insights about web content with unprecedented precision.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center opacity-0 animate-fade-in-up" style={{animationDelay: '1.5s', animationFillMode: 'forwards'}}>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-10 py-4 text-lg group shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 rounded-xl"
              >
                Start Analyzing
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="px-10 py-4 text-lg hover:bg-primary/10 backdrop-blur-sm border-primary/30 hover:border-primary/60 transition-all duration-300 hover:scale-105 rounded-xl shadow-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-24 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 opacity-100 animate-fade-in-up" style={{animationDelay: '0.2s', animationFillMode: 'forwards'}}>
        Powerful Features for Deep Analysis
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto opacity-100 animate-fade-in-up" style={{animationDelay: '0.4s', animationFillMode: 'forwards'}}>
        Our AI-powered platform provides comprehensive website analysis with intelligent insights that transform how you understand web content
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
        {
          icon: Brain,
          title: "AI Analysis",
          description: "Advanced AI algorithms analyze website content and structure for comprehensive insights",
        },
        {
          icon: Zap,
          title: "Instant Results",
          description: "Get detailed analysis and summaries in seconds, not hours",
        },
        {
          icon: Globe,
          title: "Any Website",
          description: "Analyze any public website with support for both static and dynamic content",
        },
        {
          icon: Shield,
          title: "Secure & Private",
          description: "Your data is protected with enterprise-grade security and privacy measures",
        },
          ].map((feature, index) => {
        const Icon = feature.icon;
        return (
          <Card
            key={index}
            className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-primary/20 hover:border-primary/40 backdrop-blur-sm bg-background/50 rounded-2xl overflow-hidden opacity-100 animate-fade-in-up hover:scale-105"
            style={{animationDelay: `${0.6 + index * 0.2}s`, animationFillMode: 'forwards'}}
          >
            <CardContent className="p-8 text-center relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-lg">
              <Icon className="h-7 w-7" />
            </div>
            <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
          </div>
            </CardContent>
          </Card>
        );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-24 relative z-10">
        <Card className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 border-primary/20 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden opacity-100 animate-fade-in-up" style={{animationDelay: '0.3s', animationFillMode: 'forwards'}}>
          <CardContent className="p-16 text-center relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-purple-500/5 animate-pulse" style={{animationDuration: '4s'}}></div>
        <div className="relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Ready to Analyze Your First Website?</h2>
          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Join thousands of users who trust Synapse for intelligent website analysis and unlock the power of AI-driven insights
          </p>
          <Link href="/register">
            <Button
          size="lg"
          className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white px-12 py-5 text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110 rounded-xl"
            >
          Get Started Free
            </Button>
          </Link>
        </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/50 backdrop-blur-lg relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0 group">
              <Brain className="h-8 w-8 text-primary group-hover:animate-pulse" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Synapse</span>
            </div>
            <p className="text-muted-foreground">© 2024 Synapse. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  )
}