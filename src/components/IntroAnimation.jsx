import { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'
import { Trash2, Sparkles } from 'lucide-react'

const IntroAnimation = ({ onComplete }) => {
  const [stage, setStage] = useState('thoughts') // thoughts, shatter, dispose, solution, complete
  const [visibleBubbles, setVisibleBubbles] = useState(0)
  const chartRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // Show thought bubbles consecutively
    const bubble1Timer = setTimeout(() => setVisibleBubbles(1), 500)
    const bubble2Timer = setTimeout(() => setVisibleBubbles(2), 2000)
    const bubble3Timer = setTimeout(() => setVisibleBubbles(3), 3500)

    // Stage 1: Show thought bubbles (6 seconds total)
    const thoughtTimer = setTimeout(() => {
      setStage('shatter')
    }, 6000)

    return () => {
      clearTimeout(bubble1Timer)
      clearTimeout(bubble2Timer)
      clearTimeout(bubble3Timer)
      clearTimeout(thoughtTimer)
    }
  }, [])

  useEffect(() => {
    if (stage === 'shatter' && chartRef.current) {
      // Stage 2: Shatter animation
      animateShatter()
    } else if (stage === 'dispose') {
      // Clean up any remaining shatter SVGs
      d3.select(containerRef.current).selectAll('.shatter-svg').remove()
    }
  }, [stage])

  const animateShatter = () => {
    const chart = d3.select(chartRef.current)
    const chartRect = chartRef.current.getBoundingClientRect()
    const containerRect = containerRef.current.getBoundingClientRect()

    // Calculate chart center relative to container
    const offsetX = chartRect.left - containerRect.left
    const offsetY = chartRect.top - containerRect.top
    const centerX = offsetX + chartRect.width / 2
    const centerY = offsetY + chartRect.height / 2

    // Create shatter pieces (irregular polygon shards)
    const pieces = []
    const numPieces = 20

    for (let i = 0; i < numPieces; i++) {
      const angle = (i / numPieces) * Math.PI * 2
      const radius = 30 + Math.random() * 40
      const x = centerX + Math.cos(angle) * radius
      const y = centerY + Math.sin(angle) * radius

      pieces.push({
        id: i,
        x,
        y,
        rotation: Math.random() * 360,
        velocityX: (Math.random() - 0.5) * 4,
        velocityY: (Math.random() - 0.5) * 4,
        rotationSpeed: (Math.random() - 0.5) * 10
      })
    }

    // Hide original chart
    chart.transition()
      .duration(100)
      .style('opacity', 0)

    // Create SVG for shatter pieces
    const svg = d3.select(containerRef.current)
      .append('svg')
      .attr('class', 'shatter-svg')
      .style('position', 'absolute')
      .style('top', 0)
      .style('left', 0)
      .style('width', '100%')
      .style('height', '100%')
      .style('pointer-events', 'none')
      .style('z-index', 10)

    // Create gradient for glass effect
    const defs = svg.append('defs')
    const gradientId = `glassGradient-${Date.now()}`
    const glassGradient = defs.append('linearGradient')
      .attr('id', gradientId)
      .attr('x1', '0%')
      .attr('y1', '0%')
      .attr('x2', '100%')
      .attr('y2', '100%')

    glassGradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#ffffff')
      .attr('stop-opacity', 0.9)

    glassGradient.append('stop')
      .attr('offset', '50%')
      .attr('stop-color', '#e0e7ff')
      .attr('stop-opacity', 0.7)

    glassGradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#c7d2fe')
      .attr('stop-opacity', 0.8)

    // Create shatter pieces
    const shards = svg.selectAll('.shard')
      .data(pieces)
      .enter()
      .append('g')
      .attr('class', 'shard')
      .attr('transform', d => `translate(${d.x}, ${d.y}) rotate(${d.rotation})`)

    // Each shard is an irregular triangle
    shards.append('path')
      .attr('d', () => {
        const size = 30 + Math.random() * 40
        const points = [
          [0, -size],
          [size * 0.8, size * 0.5],
          [-size * 0.8, size * 0.5]
        ]
        return `M ${points.map(p => p.join(',')).join(' L ')} Z`
      })
      .attr('fill', `url(#${gradientId})`)
      .attr('stroke', '#818cf8')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5))')
      .style('opacity', 1)

    // Animate shards flying out and fading
    shards.transition()
      .duration(1200)
      .ease(d3.easeQuadOut)
      .attr('transform', d => {
        const finalX = d.x + d.velocityX * 100
        const finalY = d.y + d.velocityY * 100 + 50 // Gravity effect
        const finalRotation = d.rotation + d.rotationSpeed * 50
        return `translate(${finalX}, ${finalY}) rotate(${finalRotation})`
      })
      .style('opacity', 0)
      .on('end', (d, i) => {
        if (i === pieces.length - 1) {
          // All shards animated, move to dispose stage
          setTimeout(() => setStage('dispose'), 300)
        }
      })
  }

  const handleDisposeComplete = () => {
    setTimeout(() => {
      setStage('solution')
    }, 500)
  }

  const handleSolutionComplete = () => {
    // After chat slides away, call onComplete
    setTimeout(onComplete, 500)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
    >
      {/* Chart and Thought Bubbles - visible during thoughts and shatter */}
      {(stage === 'thoughts' || stage === 'shatter') && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative flex flex-col items-center">
            {/* Frustrated Person - Top */}
            {stage === 'thoughts' && visibleBubbles >= 1 && (
              <div className="absolute -top-48 left-1/2 -translate-x-1/2 animate-in fade-in zoom-in duration-700 flex flex-col items-center gap-2">
                <div className="text-6xl animate-bounce">😫</div>
                <div className="text-xs text-slate-600 font-medium">*pulling hair out*</div>
              </div>
            )}

            {/* Main Question - Large Font */}
            {stage === 'thoughts' && visibleBubbles >= 2 && (
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 animate-in fade-in slide-in-from-top duration-700" style={{ animationDelay: '800ms' }}>
                <h3 className="text-4xl font-bold text-slate-800 text-center whitespace-nowrap">
                  Are you still using <span className="text-red-600">THIS?</span>
                </h3>
              </div>
            )}

            {/* Frustrated person on sides */}
            {stage === 'thoughts' && visibleBubbles >= 3 && (
              <>
                <div className="absolute top-1/2 -left-32 -translate-y-1/2 animate-in fade-in zoom-in duration-700" style={{ animationDelay: '1200ms' }}>
                  <div className="text-5xl transform -rotate-12">🤦</div>
                </div>
                <div className="absolute top-1/2 -right-32 -translate-y-1/2 animate-in fade-in zoom-in duration-700" style={{ animationDelay: '1400ms' }}>
                  <div className="text-5xl transform rotate-12">🤦‍♂️</div>
                </div>
              </>
            )}

            {/* Ugly Google Chart - visible during thoughts and shatter */}
            <div
              ref={chartRef}
              className="animate-in fade-in zoom-in duration-700 shadow-2xl rounded-lg overflow-hidden border-4 border-red-400 relative"
              style={{ animationDelay: '200ms' }}
            >
              {/* Warning stickers on chart */}
              {stage === 'thoughts' && visibleBubbles >= 3 && (
                <>
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded rotate-12 animate-pulse z-10">
                    OUTDATED
                  </div>
                  <div className="absolute bottom-2 left-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded -rotate-6 animate-pulse z-10">
                    HARD TO USE
                  </div>
                </>
              )}
              <img
                src="/ugly_gsheet.png"
                alt="Ugly Google Sheets Chart"
                className="w-[500px] h-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Dispose Stage */}
      {stage === 'dispose' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <TrashBinAnimation onComplete={handleDisposeComplete} />
        </div>
      )}

      {/* Solution Stage - Chat Console */}
      {stage === 'solution' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <SolutionAnimation onComplete={handleSolutionComplete} />
        </div>
      )}
    </div>
  )
}

const TrashBinAnimation = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [hasDropped, setHasDropped] = useState(false)

  useEffect(() => {
    // Open trash lid
    setTimeout(() => setIsOpen(true), 200)

    // Drop animation
    setTimeout(() => setHasDropped(true), 800)

    // Close lid and complete
    setTimeout(() => {
      setIsOpen(false)
      setTimeout(onComplete, 500)
    }, 1800)
  }, [onComplete])

  return (
    <div className="relative flex flex-col items-center">
      {/* Falling text */}
      <div
        className={`mb-8 text-2xl font-bold transition-all duration-1000 ${
          hasDropped ? 'opacity-0 translate-y-32' : 'opacity-100 translate-y-0'
        }`}
      >
        <span className="bg-gradient-to-r from-slate-600 to-slate-400 bg-clip-text text-transparent">
          Old, Ugly Charts
        </span>
      </div>

      {/* Trash Bin */}
      <div className="relative">
        {/* Trash bin body */}
        <div className="relative w-32 h-40 bg-gradient-to-b from-slate-700 to-slate-800 rounded-lg shadow-2xl border-4 border-slate-600">
          {/* Trash bin opening */}
          <div className="absolute top-0 left-0 right-0 h-8 bg-slate-900/50 rounded-t-lg overflow-hidden">
            <div className={`w-full h-full bg-slate-900/30 transition-all duration-500 ${
              hasDropped ? 'opacity-0' : 'opacity-100'
            }`}>
              {/* Trash pieces falling in */}
            </div>
          </div>

          {/* Trash bin ridges */}
          <div className="absolute top-12 left-0 right-0 h-0.5 bg-slate-600"></div>
          <div className="absolute top-20 left-0 right-0 h-0.5 bg-slate-600"></div>
          <div className="absolute top-28 left-0 right-0 h-0.5 bg-slate-600"></div>
        </div>

        {/* Trash bin lid */}
        <div
          className={`absolute -top-4 left-1/2 -translate-x-1/2 w-36 h-6 bg-gradient-to-b from-slate-600 to-slate-700 rounded-lg shadow-xl border-2 border-slate-500 transition-all duration-500 origin-left ${
            isOpen ? '-rotate-45 -translate-y-4 translate-x-2' : 'rotate-0'
          }`}
        >
          {/* Lid handle */}
          <div className="absolute top-1 left-1/2 -translate-x-1/2 w-12 h-3 bg-slate-800 rounded-full"></div>
        </div>

        {/* Trash icon on bin */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Trash2 className="w-12 h-12 text-slate-400/30" />
        </div>
      </div>

      {/* Success message */}
      <div
        className={`mt-8 text-lg font-semibold transition-all duration-700 ${
          hasDropped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          ✓ Gone for good!
        </span>
      </div>
    </div>
  )
}

const SolutionAnimation = ({ onComplete }) => {
  const [showHeading, setShowHeading] = useState(false)
  const [chatPosition, setChatPosition] = useState('right') // right, racing, braking, center, button-press, loading, slide-out
  const [typedText, setTypedText] = useState('')
  const [buttonState, setButtonState] = useState('idle') // idle, pressing, loading
  const fullText = "can you plot US GDP by year and highlight covid period"

  useEffect(() => {
    // Step 1: Show heading (1s)
    setTimeout(() => setShowHeading(true), 300)

    // Step 2: Racing car enters from right (fast)
    setTimeout(() => setChatPosition('racing'), 1500)

    // Step 3: Braking/wiggling effect
    setTimeout(() => setChatPosition('braking'), 2200)

    // Step 4: Finally settle at center
    setTimeout(() => setChatPosition('center'), 2600)

    // Step 5: Start typing after chat settles (3s)
    setTimeout(() => {
      let currentIndex = 0
      const typingInterval = setInterval(() => {
        if (currentIndex <= fullText.length) {
          setTypedText(fullText.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(typingInterval)
          // Step 6: Animate button press after typing (wait 500ms)
          setTimeout(() => {
            setButtonState('pressing')
            // Step 7: Show loading state
            setTimeout(() => {
              setButtonState('loading')
              // Step 8: Slide out after loading (1.5s)
              setTimeout(() => {
                setChatPosition('slide-out')
                // Complete after slide out animation (1s)
                setTimeout(onComplete, 1000)
              }, 1500)
            }, 300)
          }, 500)
        }
      }, 50) // 50ms per character for typing effect
    }, 3000)
  }, [onComplete, fullText])

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      {/* "There is a better way..." heading */}
      <div
        className={`mb-16 transition-all duration-1000 ${
          showHeading ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
        }`}
      >
        <h2 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent text-center">
          There is a better way...
        </h2>
      </div>

      {/* Chat Console */}
      <div
        className={`${
          chatPosition === 'right'
            ? 'translate-x-[1000px] opacity-0'
            : chatPosition === 'racing'
            ? 'translate-x-0 opacity-100 transition-all duration-700 ease-in'
            : chatPosition === 'braking'
            ? 'translate-x-0 opacity-100 animate-wiggle'
            : chatPosition === 'center'
            ? 'translate-x-0 opacity-100 transition-all duration-300 ease-out'
            : chatPosition === 'slide-out'
            ? 'translate-x-[1000px] opacity-0 transition-all duration-1000 ease-in'
            : 'translate-x-0 opacity-100'
        }`}
      >
        <div className="bg-white rounded-2xl shadow-premium-lg border-2 border-primary/20 p-6 w-[600px]">
          {/* Chat Header */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">Jiracoon AI</div>
              <div className="text-xs text-slate-500">Your chart assistant</div>
            </div>
          </div>

          {/* Chat Input Area */}
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <div className="text-sm text-slate-700 font-mono">
                  {typedText}
                  {typedText.length < fullText.length && (
                    <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse"></span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Send Button */}
          <div className="mt-4 flex justify-end">
            <button
              className={`px-4 py-2 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-medium shadow-lg transition-all flex items-center gap-2 ${
                buttonState === 'pressing'
                  ? 'scale-95 shadow-md'
                  : buttonState === 'loading'
                  ? 'scale-100 shadow-xl cursor-wait'
                  : 'scale-100'
              }`}
              disabled={buttonState !== 'idle'}
            >
              {buttonState === 'loading' && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {buttonState === 'loading' ? 'Generating...' : 'Generate Chart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default IntroAnimation
