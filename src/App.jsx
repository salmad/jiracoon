import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ChartDemo from '@/components/ChartDemo'
import { Sparkles } from 'lucide-react'

function App() {
  const [prompt, setPrompt] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)

  const handleGenerateDemo = () => {
    if (!prompt.trim()) return
    setIsPlaying(true)
    // This will trigger the demo playback
  }

  const handleReset = () => {
    setIsPlaying(false)
    setPrompt('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 py-8">
          <h1 className="text-4xl font-bold tracking-tight">Jiracoon</h1>
          <p className="text-muted-foreground text-lg">
            Product Demo as Executable UI
          </p>
        </div>

        {/* Prompt Input Card */}
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Generate Demo
            </CardTitle>
            <CardDescription>
              Describe the demo you want to create. For example: "show me a line chart of GDP of US where line runs from left to right"
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter your demo prompt..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleGenerateDemo()}
                disabled={isPlaying}
              />
              {!isPlaying ? (
                <Button onClick={handleGenerateDemo} disabled={!prompt.trim()}>
                  Generate
                </Button>
              ) : (
                <Button onClick={handleReset} variant="outline">
                  Reset
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Demo Display Area */}
        {isPlaying && (
          <Card className="max-w-5xl mx-auto">
            <CardHeader>
              <CardTitle>Demo Playback</CardTitle>
              <CardDescription>
                Watch your demo come to life
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartDemo prompt={prompt} onComplete={() => {}} />
            </CardContent>
          </Card>
        )}

        {/* Info Section */}
        {!isPlaying && (
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>How it works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong>Pixel-perfect fidelity:</strong> Demos use real React components and D3 visualizations, not mock videos.
                </p>
                <p>
                  <strong>Timeline-driven:</strong> Each demo is controlled by a timeline of actions (type, click, scroll, etc.) that manipulate the DOM.
                </p>
                <p>
                  <strong>Editable & reproducible:</strong> Demos are defined in code, making them easy to iterate and version control.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
