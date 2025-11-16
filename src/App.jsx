import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ChartDemo from '@/components/ChartDemo'
import IntroAnimation from '@/components/IntroAnimation'
import { Sparkles, Play, RotateCcw, Zap, Code2, LineChart } from 'lucide-react'

function App() {
  const [prompt, setPrompt] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [showChart, setShowChart] = useState(false)

  const handleGenerateDemo = () => {
    if (!prompt.trim()) return
    setIsPlaying(true)
    setShowIntro(true)
    setShowChart(false)
    // This will trigger the intro animation, then the demo playback
  }

  const handleReset = () => {
    setIsPlaying(false)
    setPrompt('')
    setShowIntro(true)
    setShowChart(false)
  }

  const handleIntroComplete = () => {
    setShowIntro(false)
    setShowChart(true)
  }

  return (
    <div className="min-h-screen gradient-subtle">
      <div className="container mx-auto p-6 space-y-8 max-w-7xl">
        {/* Premium Header */}
        <div className="text-center space-y-4 py-12">
          <div className="inline-flex items-center gap-2 mb-2">
            <Badge variant="accent" className="px-3 py-1">
              <Zap className="w-3 h-3 mr-1" />
              Beta
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            Jiracoon
          </h1>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Create pixel-perfect product demos with timeline-driven animations
          </p>
        </div>

        {/* Premium Prompt Input Card */}
        <Card className="max-w-3xl mx-auto shadow-premium-lg border-2">
          <CardHeader className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="w-6 h-6 text-primary" />
              Generate Your Demo
            </CardTitle>
            <CardDescription className="text-base">
              Describe the visualization you want to create. Try: "show me a line chart of GDP"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter your demo prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateDemo()}
                disabled={isPlaying}
                className="h-12 text-base"
              />
              {!isPlaying ? (
                <Button
                  onClick={handleGenerateDemo}
                  disabled={!prompt.trim()}
                  size="lg"
                  className="px-6"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Generate
                </Button>
              ) : (
                <Button onClick={handleReset} variant="outline" size="lg" className="px-6">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Demo Display Area */}
        {isPlaying && (
          <Card className="max-w-6xl mx-auto shadow-premium-lg border-2">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">
                    {showIntro ? 'The Problem' : 'Demo Playback'}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    {showIntro
                      ? 'Traditional charting tools leave much to be desired'
                      : 'Timeline-driven DOM manipulation in action'
                    }
                  </CardDescription>
                </div>
                <Badge variant="success">
                  <Play className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
              {showChart && <ChartDemo prompt={prompt} onComplete={() => {}} />}
            </CardContent>
          </Card>
        )}

        {/* Premium Info Section */}
        {!isPlaying && (
          <div className="max-w-3xl mx-auto grid gap-4 md:grid-cols-3">
            <Card className="shadow-premium hover:shadow-premium-lg transition-shadow">
              <CardHeader>
                <LineChart className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Pixel Perfect</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Real React components and D3 visualizations, not mock videos
              </CardContent>
            </Card>

            <Card className="shadow-premium hover:shadow-premium-lg transition-shadow">
              <CardHeader>
                <Code2 className="w-8 h-8 text-accent mb-2" />
                <CardTitle className="text-lg">Timeline Driven</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Controlled by actions that manipulate the DOM in sequence
              </CardContent>
            </Card>

            <Card className="shadow-premium hover:shadow-premium-lg transition-shadow">
              <CardHeader>
                <Zap className="w-8 h-8 text-primary mb-2" />
                <CardTitle className="text-lg">Reproducible</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                Defined in code for easy iteration and version control
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
