import { useEffect, useState, useRef } from 'react'
import * as d3 from 'd3'
import { Trash2 } from 'lucide-react'

const IntroAnimation = ({ onComplete }) => {
  const [stage, setStage] = useState('thoughts') // thoughts, shatter, dispose, complete
  const chartRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    // Stage 1: Show thought bubbles (4 seconds)
    const thoughtTimer = setTimeout(() => {
      setStage('shatter')
    }, 5000)

    return () => clearTimeout(thoughtTimer)
  }, [])

  useEffect(() => {
    if (stage === 'shatter' && chartRef.current) {
      // Stage 2: Shatter animation
      animateShatter()
    }
  }, [stage])

  const animateShatter = () => {
    const chart = d3.select(chartRef.current)
    const rect = chartRef.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

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
    const glassGradient = defs.append('linearGradient')
      .attr('id', 'glassGradient')
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
        const size = 20 + Math.random() * 30
        const points = [
          [0, -size],
          [size * 0.8, size * 0.5],
          [-size * 0.8, size * 0.5]
        ]
        return `M ${points.map(p => p.join(',')).join(' L ')} Z`
      })
      .attr('fill', 'url(#glassGradient)')
      .attr('stroke', '#818cf8')
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3))')

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
      setStage('complete')
      onComplete()
    }, 800)
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100"
    >
      {/* Thought Bubbles */}
      {stage === 'thoughts' && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative">
            {/* Thought Bubble 1 - Top Left */}
            <div
              className="absolute -top-32 -left-48 animate-in fade-in zoom-in duration-700"
              style={{ animationDelay: '500ms' }}
            >
              <ThoughtBubble text="Stuck with ugly Google Charts?" position="top-left" />
            </div>

            {/* Thought Bubble 2 - Top Right */}
            <div
              className="absolute -top-40 -right-52 animate-in fade-in zoom-in duration-700"
              style={{ animationDelay: '1500ms' }}
            >
              <ThoughtBubble text="Frustrated with configuration?" position="top-right" />
            </div>

            {/* Thought Bubble 3 - Bottom */}
            <div
              className="absolute -bottom-36 left-1/2 -translate-x-1/2 animate-in fade-in zoom-in duration-700"
              style={{ animationDelay: '2500ms' }}
            >
              <ThoughtBubble text="Wish there was a better way?" position="bottom" />
            </div>

            {/* Ugly Google Chart */}
            <div
              ref={chartRef}
              className="animate-in fade-in zoom-in duration-700"
              style={{ animationDelay: '200ms' }}
            >
              <UglyGoogleChart />
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
    </div>
  )
}

const ThoughtBubble = ({ text, position }) => {
  return (
    <div className="relative">
      {/* Main thought bubble */}
      <div className="relative bg-white border-2 border-slate-300 rounded-3xl px-6 py-4 shadow-lg max-w-[220px]">
        <p className="text-sm font-medium text-slate-700 text-center leading-tight">
          {text}
        </p>

        {/* Thought bubble tail circles */}
        {position === 'top-left' && (
          <>
            <div className="absolute bottom-[-20px] left-8 w-4 h-4 bg-white border-2 border-slate-300 rounded-full" />
            <div className="absolute bottom-[-30px] left-12 w-2.5 h-2.5 bg-white border-2 border-slate-300 rounded-full" />
          </>
        )}
        {position === 'top-right' && (
          <>
            <div className="absolute bottom-[-20px] right-8 w-4 h-4 bg-white border-2 border-slate-300 rounded-full" />
            <div className="absolute bottom-[-30px] right-12 w-2.5 h-2.5 bg-white border-2 border-slate-300 rounded-full" />
          </>
        )}
        {position === 'bottom' && (
          <>
            <div className="absolute top-[-20px] left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-2 border-slate-300 rounded-full" />
            <div className="absolute top-[-30px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-white border-2 border-slate-300 rounded-full" />
          </>
        )}
      </div>
    </div>
  )
}

const UglyGoogleChart = () => {
  return (
    <div className="bg-white border-2 border-slate-300 rounded-lg p-6 shadow-xl w-[500px]">
      {/* Ugly Google Chart Title */}
      <div className="mb-4">
        <h3 className="text-base font-bold text-black" style={{ fontFamily: 'Arial, sans-serif' }}>
          Company Sales
        </h3>
      </div>

      {/* Chart Area - Ugly styling */}
      <svg width="450" height="300" className="border border-slate-200">
        {/* White background */}
        <rect width="450" height="300" fill="#ffffff" />

        {/* Grid lines - harsh and thick */}
        {[0, 60, 120, 180, 240, 300].map(y => (
          <line
            key={y}
            x1="40"
            y1={y}
            x2="450"
            y2={y}
            stroke="#cccccc"
            strokeWidth="1"
          />
        ))}

        {/* Y-axis labels - ugly Arial font */}
        <text x="5" y="25" fontSize="11" fontFamily="Arial" fill="#666">100</text>
        <text x="5" y="85" fontSize="11" fontFamily="Arial" fill="#666">80</text>
        <text x="5" y="145" fontSize="11" fontFamily="Arial" fill="#666">60</text>
        <text x="5" y="205" fontSize="11" fontFamily="Arial" fill="#666">40</text>
        <text x="5" y="265" fontSize="11" fontFamily="Arial" fill="#666">20</text>

        {/* X-axis labels */}
        <text x="80" y="290" fontSize="11" fontFamily="Arial" fill="#666">Q1</text>
        <text x="180" y="290" fontSize="11" fontFamily="Arial" fill="#666">Q2</text>
        <text x="280" y="290" fontSize="11" fontFamily="Arial" fill="#666">Q3</text>
        <text x="380" y="290" fontSize="11" fontFamily="Arial" fill="#666">Q4</text>

        {/* Ugly bars with Google's default colors */}
        <rect x="60" y="120" width="60" height="120" fill="#3366cc" />
        <rect x="160" y="90" width="60" height="150" fill="#dc3912" />
        <rect x="260" y="150" width="60" height="90" fill="#ff9900" />
        <rect x="360" y="60" width="60" height="180" fill="#109618" />

        {/* Harsh black border */}
        <rect width="450" height="300" fill="none" stroke="#000000" strokeWidth="1" />
      </svg>

      {/* Legend - typical Google Charts style */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs" style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#3366cc]"></div>
          <span className="text-slate-700">Q1</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#dc3912]"></div>
          <span className="text-slate-700">Q2</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#ff9900]"></div>
          <span className="text-slate-700">Q3</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#109618]"></div>
          <span className="text-slate-700">Q4</span>
        </div>
      </div>
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

export default IntroAnimation
