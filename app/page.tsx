'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { 
  Star, 
  Zap, 
  Shield, 
  Globe, 
  BarChart3, 
  Calendar, 
  Users, 
  ArrowRight,
  Play,
  CheckCircle,
  Sparkles,
  Moon,
  Sun,
  Compass,
  Target,
  TrendingUp,
  Award,
  Clock,
  MapPin,
  Calculator
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function Home() {
  const { data: session } = useSession()
  const router = useRouter()
  const [currentFeature, setCurrentFeature] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const features = [
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Advanced Chart Analysis",
      description: "Generate precise natal charts with multiple house systems and ayanamshas"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Daily Panchang",
      description: "Get daily astrological timings and auspicious periods"
    },
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Transit Tracking",
      description: "Monitor planetary movements and their effects on your chart"
    },
    {
      icon: <Calculator className="h-8 w-8" />,
      title: "Specialized Calculators",
      description: "Tools for Sade Sati, Kuja Dosha, and more"
    }
  ]

  const testimonials = [
    {
      name: "Dr. Priya Sharma",
      role: "Professional Astrologer",
      content: "Prerana Astro has revolutionized my practice. The accuracy and ease of use are unmatched.",
      rating: 5
    },
    {
      name: "Rajesh Kumar",
      role: "Astrology Student",
      content: "Perfect for learning and practicing. The interface is intuitive and calculations are precise.",
      rating: 5
    },
    {
      name: "Meera Patel",
      role: "Life Coach",
      content: "I use Prerana Astro daily for client consultations. It's become an essential tool in my toolkit.",
      rating: 5
    }
  ]

  const stats = [
    { label: "Active Users", value: "10K+", icon: <Users className="h-5 w-5" /> },
    { label: "Charts Generated", value: "50K+", icon: <BarChart3 className="h-5 w-5" /> },
    { label: "Countries", value: "25+", icon: <Globe className="h-5 w-5" /> },
    { label: "Accuracy Rate", value: "99.9%", icon: <Target className="h-5 w-5" /> }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 dark:from-blue-600/10 dark:to-purple-600/10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Professional Astrology Software
            </Badge>
            
            <h1 className="text-5xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6 leading-tight">
              Prerana Astro
            </h1>
            
            <p className="text-xl lg:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              The most advanced astrology platform for professionals and enthusiasts. 
              Generate precise charts, analyze transits, and unlock cosmic insights with 
              Swiss Ephemeris accuracy.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              {session ? (
                <Button 
                  size="lg" 
                  className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  onClick={() => router.push('/dashboard')}
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="px-8 py-4 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => router.push('/login')}
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="px-8 py-4 text-lg border-2"
                    onClick={() => router.push('/chart/new')}
                  >
                    <Play className="mr-2 h-5 w-5" />
                    Try Demo
                  </Button>
                </>
              )}
            </div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 opacity-20 animate-float">
              <Moon className="h-12 w-12 text-blue-400" />
            </div>
            <div className="absolute top-32 right-20 opacity-20 animate-float-delayed">
              <Sun className="h-10 w-10 text-yellow-400" />
            </div>
            <div className="absolute bottom-20 left-20 opacity-20 animate-float">
              <Star className="h-8 w-8 text-purple-400" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Features for Modern Astrology
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Everything you need for professional astrological analysis and consultation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className={`text-center p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl ${
                  currentFeature === index ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
              >
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className="mx-auto w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white mb-4">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  {stat.label}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Why Choose Prerana Astro?
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <Card className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white mb-6">
                <Shield className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl mb-4">Swiss Ephemeris Accuracy</CardTitle>
              <p className="text-slate-600 dark:text-slate-300">
                Industry-standard ephemeris data ensures precise planetary positions and calculations
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center text-white mb-6">
                <Zap className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl mb-4">Lightning Fast</CardTitle>
              <p className="text-slate-600 dark:text-slate-300">
                Optimized algorithms deliver instant results without compromising accuracy
              </p>
            </Card>

            <Card className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white mb-6">
                <Globe className="h-8 w-8" />
              </div>
              <CardTitle className="text-2xl mb-4">Global Coverage</CardTitle>
              <p className="text-slate-600 dark:text-slate-300">
                Support for multiple ayanamshas and house systems from around the world
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300">
              See what astrologers and enthusiasts are saying about Prerana Astro
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    {testimonial.role}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Explore the Cosmos?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of astrologers and enthusiasts who trust Prerana Astro for their daily astrological work
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <Button 
                size="lg" 
                variant="secondary"
                className="px-8 py-4 text-lg"
                onClick={() => router.push('/dashboard')}
              >
                Go to Dashboard
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  variant="secondary"
                  className="px-8 py-4 text-lg"
                  onClick={() => router.push('/login')}
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="px-8 py-4 text-lg border-white text-white hover:bg-white hover:text-blue-600"
                  onClick={() => router.push('/chart/new')}
                >
                  Try Demo
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Compass className="h-8 w-8 mr-3 text-blue-400" />
            <span className="text-2xl font-bold">Prerana Astro</span>
          </div>
          <p className="text-slate-400 mb-4">
            Professional astrology software powered by Swiss Ephemeris
          </p>
          <div className="flex justify-center space-x-6 text-sm text-slate-400">
            <span>© 2024 Prerana Astro</span>
            <span>•</span>
            <span>Privacy Policy</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>Support</span>
          </div>
        </div>
      </footer>


    </div>
  )
}
