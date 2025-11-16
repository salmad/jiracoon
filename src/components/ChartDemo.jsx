import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import confetti from 'canvas-confetti'

const ChartDemo = ({ prompt, onComplete }) => {
  const svgRef = useRef(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!svgRef.current) return

    // Sample GDP data for US
    const data = [
      { year: 2014, gdp: 17.5 },
      { year: 2015, gdp: 18.2 },
      { year: 2016, gdp: 18.7 },
      { year: 2017, gdp: 19.5 },
      { year: 2018, gdp: 20.6 },
      { year: 2019, gdp: 21.4 },
      { year: 2020, gdp: 21.0 },
      { year: 2021, gdp: 23.0 },
      { year: 2022, gdp: 25.5 },
      { year: 2023, gdp: 27.0 },
    ]

    // Annotations for specific events
    const annotations = [
      {
        year: 2015,
        text: 'Strong growth period',
        description: 'Technology sector boom and low unemployment',
        position: 'bottom'
      },
      {
        year: 2020,
        text: 'COVID-19 pandemic impact',
        description: 'Global pandemic led to economic slowdown',
        position: 'top'
      },
      {
        year: 2021,
        text: 'Economic recovery begins',
        description: 'Stimulus packages and reopening drive growth',
        position: 'bottom'
      },
      {
        year: 2023,
        text: 'Continued expansion',
        description: 'Strong consumer spending and employment',
        position: 'top'
      }
    ]

    // Chart dimensions - increased margins for annotations
    const margin = { top: 120, right: 40, bottom: 140, left: 70 }
    const width = 900 - margin.left - margin.right
    const height = 450 - margin.top - margin.bottom

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove()

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create scales - use scaleBand for bar chart
    const xScale = d3
      .scaleBand()
      .domain(data.map((d) => d.year))
      .range([0, width])
      .padding(0.3)

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.gdp) * 1.1])
      .range([height, 0])
      .nice()

    // Add subtle grid lines (recharts style)
    const gridGroup = svg.append('g').attr('class', 'grid')

    // Horizontal grid lines
    gridGroup
      .selectAll('.grid-line-y')
      .data(yScale.ticks(5))
      .enter()
      .append('line')
      .attr('class', 'grid-line-y')
      .attr('x1', 0)
      .attr('x2', width)
      .attr('y1', (d) => yScale(d))
      .attr('y2', (d) => yScale(d))
      .attr('stroke', 'hsl(240, 6%, 90%)')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 0.5)

    // Add X axis with recharts-like styling
    const xAxis = svg
      .append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${height})`)
      .call(
        d3.axisBottom(xScale)
          .tickSize(0)
          .tickPadding(12)
      )

    // Style X axis
    xAxis.select('.domain').attr('stroke', 'hsl(240, 6%, 90%)')
    xAxis.selectAll('text')
      .style('font-size', '12px')
      .style('font-weight', '400')
      .style('fill', 'hsl(240, 4%, 46%)')
      .style('font-family', 'inherit')

    xAxis.style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1)

    // Add Y axis with recharts-like styling
    const yAxis = svg
      .append('g')
      .attr('class', 'y-axis')
      .call(
        d3.axisLeft(yScale)
          .ticks(5)
          .tickSize(0)
          .tickPadding(12)
          .tickFormat((d) => `$${d}T`)
      )

    // Style Y axis
    yAxis.select('.domain').attr('stroke', 'hsl(240, 6%, 90%)')
    yAxis.selectAll('text')
      .style('font-size', '12px')
      .style('font-weight', '400')
      .style('fill', 'hsl(240, 4%, 46%)')
      .style('font-family', 'inherit')

    yAxis.style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1)

    // Add Y axis label (recharts style - smaller, more subtle)
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -height / 2)
      .style('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '500')
      .style('fill', 'hsl(240, 4%, 46%)')
      .style('font-family', 'inherit')
      .text('GDP (Trillion USD)')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay(300)
      .style('opacity', 1)

    // Function to add value labels on top of bars with magic effect
    const addBarLabels = () => {
      data.forEach((d, i) => {
        const x = xScale(d.year) + xScale.bandwidth() / 2
        const y = yScale(d.gdp)

        // Create label group
        const labelGroup = svg
          .append('g')
          .attr('class', 'bar-label')
          .attr('transform', `translate(${x}, ${y - 12})`)
          .style('opacity', 0)

        // Add sparkle/star effect
        const sparkle = labelGroup
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('y', -8)
          .style('font-size', '16px')
          .text('✨')
          .style('opacity', 0)

        // Add value label
        const label = labelGroup
          .append('text')
          .attr('text-anchor', 'middle')
          .attr('y', 0)
          .style('font-size', '13px')
          .style('font-weight', '600')
          .style('fill', 'hsl(262, 83%, 58%)')
          .style('font-family', 'inherit')
          .text(`$${d.gdp}T`)

        // Animate sparkle
        sparkle
          .transition()
          .delay(i * 100)
          .duration(300)
          .ease(d3.easeBackOut)
          .style('opacity', 1)
          .transition()
          .duration(200)
          .style('opacity', 0)

        // Animate label with scale and fade
        labelGroup
          .transition()
          .delay(i * 100 + 150)
          .duration(400)
          .ease(d3.easeBackOut.overshoot(1.5))
          .style('opacity', 1)
          .attr('transform', `translate(${x}, ${y - 12}) scale(1)`)
          .on('start', function() {
            d3.select(this).attr('transform', `translate(${x}, ${y - 12}) scale(0.3)`)
          })
      })
    }

    // Function to add annotations with proper text wrapping
    const addAnnotations = () => {
      annotations.forEach((annotation, idx) => {
        const dataPoint = data.find(d => d.year === annotation.year)
        if (!dataPoint) return

        // Position at center of bar
        const x = xScale(dataPoint.year) + xScale.bandwidth() / 2
        const y = yScale(dataPoint.gdp)
        const arrowLength = 50
        const isTop = annotation.position === 'top'
        const arrowEndY = isTop ? y - arrowLength : y + arrowLength
        const cardWidth = 220
        const cardHeight = 70

        // Ensure cards fit within chart bounds
        let cardY = isTop ? arrowEndY - cardHeight - 10 : arrowEndY + 10

        // Clamp card position to stay within margins
        if (isTop && cardY < -margin.top + 20) {
          cardY = -margin.top + 20
        }
        if (!isTop && cardY + cardHeight > height + margin.bottom - 20) {
          cardY = height + margin.bottom - cardHeight - 20
        }

        // Create group for annotation
        const annotationGroup = svg
          .append('g')
          .attr('class', 'annotation')
          .style('opacity', 0)

        // Draw arrow line with curve (more elegant)
        const arrowPath = isTop
          ? `M ${x},${y - 8} Q ${x},${(y - 8 + arrowEndY) / 2} ${x},${arrowEndY}`
          : `M ${x},${y + 8} Q ${x},${(y + 8 + arrowEndY) / 2} ${x},${arrowEndY}`

        annotationGroup
          .append('path')
          .attr('d', arrowPath)
          .attr('stroke', 'hsl(213, 94%, 68%)')
          .attr('stroke-width', 2.5)
          .attr('fill', 'none')
          .attr('stroke-dasharray', '5,3')
          .style('filter', 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15))')

        // Add premium dot at the end of arrow
        annotationGroup
          .append('circle')
          .attr('cx', x)
          .attr('cy', arrowEndY)
          .attr('r', 4)
          .attr('fill', 'hsl(213, 94%, 68%)')
          .style('filter', 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2))')

        // Draw card background with premium styling
        annotationGroup
          .append('rect')
          .attr('x', x - cardWidth / 2)
          .attr('y', cardY)
          .attr('width', cardWidth)
          .attr('height', cardHeight)
          .attr('fill', 'white')
          .attr('stroke', 'hsl(213, 94%, 68%)')
          .attr('stroke-width', 2)
          .attr('rx', 8)
          .style('filter', 'drop-shadow(0 4px 16px rgba(0, 0, 0, 0.12))')

        // Use foreignObject for better text wrapping
        const foreignObject = annotationGroup
          .append('foreignObject')
          .attr('x', x - cardWidth / 2)
          .attr('y', cardY)
          .attr('width', cardWidth)
          .attr('height', cardHeight)

        foreignObject
          .append('xhtml:div')
          .style('width', '100%')
          .style('height', '100%')
          .style('padding', '12px')
          .style('display', 'flex')
          .style('flex-direction', 'column')
          .style('justify-content', 'center')
          .html(`
            <div style="font-size: 13px; font-weight: 600; color: hsl(240, 10%, 3.9%); margin-bottom: 4px; line-height: 1.3;">
              ${annotation.text}
            </div>
            <div style="font-size: 11px; color: hsl(240, 4%, 46%); line-height: 1.4;">
              ${annotation.description}
            </div>
          `)

        // Animate annotation appearance
        annotationGroup
          .transition()
          .duration(500)
          .delay(idx * 400)
          .style('opacity', 1)
          .on('end', () => {
            if (idx === annotations.length - 1) {
              // Annotations complete - set progress to 100%
              setProgress(100)
              // Trigger premium confetti explosion after a brief delay
              setTimeout(() => {
                // Single stunning confetti explosion from the center
                confetti({
                  particleCount: 150,
                  spread: 360,
                  startVelocity: 25,
                  gravity: 0.5,
                  ticks: 200,
                  origin: { x: 0.5, y: 0.5 },
                  colors: [
                    '#8b5cf6', // Primary purple
                    '#60a5fa', // Accent blue
                    '#34d399', // Green
                    '#fbbf24', // Orange
                    '#f87171', // Red
                  ]
                })

                // Call onComplete after confetti settles
                setTimeout(onComplete, 2000)
              }, 300)
            } else {
              // Update progress as annotations appear (70-100%)
              const annotationProgress = 70 + ((idx + 1) / annotations.length) * 30
              setProgress(Math.round(annotationProgress))
            }
          })
      })
    }


    // Add bars (recharts style)
    const bars = svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.year))
      .attr('y', height)
      .attr('width', xScale.bandwidth())
      .attr('height', 0)
      .attr('fill', 'hsl(262, 83%, 58%)')
      .attr('rx', 4)

    // Animate bars appearing left to right with bounce and settle effect
    let completedBars = 0
    bars.each(function(d, i) {
      const bar = d3.select(this)
      const finalY = yScale(d.gdp)
      const finalHeight = height - yScale(d.gdp)

      // First animation: rise with overshoot
      bar
        .transition()
        .duration(500)
        .delay(800 + i * 150)
        .ease(d3.easeBackOut.overshoot(1.3))
        .attr('y', finalY)
        .attr('height', finalHeight)
        .transition() // Chain a second transition for settle
        .duration(150)
        .ease(d3.easeQuadOut)
        .attr('y', finalY)
        .attr('height', finalHeight)
        .on('end', function() {
          completedBars++
          const progress = Math.round((completedBars / data.length) * 70)
          setProgress(progress)

          // After last bar completes, add labels then annotations
          if (i === data.length - 1) {
            setTimeout(() => {
              addBarLabels()
              // Wait for labels to finish before showing annotations
              setTimeout(() => addAnnotations(), 1200)
            }, 200)
          }
        })
    })

    // Add title (recharts style - more subtle)
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -90)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', 'hsl(240, 10%, 3.9%)')
      .style('font-family', 'inherit')
      .text('US GDP Over Time')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay(200)
      .style('opacity', 1)

  }, [prompt, onComplete])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-muted-foreground">
            Animation Progress
          </span>
          <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-sm font-semibold text-primary">{progress}%</span>
        </div>
      </div>
      <div className="flex justify-center bg-gradient-to-br from-white to-muted/30 dark:from-slate-950 dark:to-slate-900 rounded-xl p-8 shadow-premium">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  )
}

export default ChartDemo
