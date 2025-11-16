import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

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

    // Chart dimensions
    const margin = { top: 100, right: 30, bottom: 120, left: 60 }
    const width = 800 - margin.left - margin.right
    const height = 400 - margin.top - margin.bottom

    // Clear previous chart
    d3.select(svgRef.current).selectAll('*').remove()

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year))
      .range([0, width])

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.gdp) * 1.1])
      .range([height, 0])

    // Add X axis
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1)

    // Add Y axis
    svg
      .append('g')
      .call(d3.axisLeft(yScale))
      .style('opacity', 0)
      .transition()
      .duration(500)
      .style('opacity', 1)

    // Add Y axis label
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .text('GDP (Trillion USD)')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay(300)
      .style('opacity', 1)

    // Function to add annotations
    const addAnnotations = () => {
      annotations.forEach((annotation, idx) => {
        const dataPoint = data.find(d => d.year === annotation.year)
        if (!dataPoint) return

        const x = xScale(dataPoint.year)
        const y = yScale(dataPoint.gdp)
        const arrowLength = 60
        const isTop = annotation.position === 'top'
        const arrowEndY = isTop ? y - arrowLength : y + arrowLength
        const cardWidth = 200
        const cardHeight = 60
        const cardY = isTop ? arrowEndY - cardHeight - 10 : arrowEndY + 10

        // Create group for annotation
        const annotationGroup = svg
          .append('g')
          .attr('class', 'annotation')
          .style('opacity', 0)

        // Draw arrow line
        annotationGroup
          .append('line')
          .attr('x1', x)
          .attr('y1', y - 8)
          .attr('x2', x)
          .attr('y2', arrowEndY)
          .attr('stroke', 'hsl(217.2, 91.2%, 59.8%)')
          .attr('stroke-width', 2)
          .attr('marker-end', 'url(#arrowhead)')

        // Draw card background
        annotationGroup
          .append('rect')
          .attr('x', x - cardWidth / 2)
          .attr('y', cardY)
          .attr('width', cardWidth)
          .attr('height', cardHeight)
          .attr('fill', 'white')
          .attr('stroke', 'hsl(217.2, 91.2%, 59.8%)')
          .attr('stroke-width', 2)
          .attr('rx', 6)
          .style('filter', 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))')

        // Add annotation title
        annotationGroup
          .append('text')
          .attr('x', x)
          .attr('y', cardY + 22)
          .attr('text-anchor', 'middle')
          .style('font-size', '13px')
          .style('font-weight', '600')
          .style('fill', 'hsl(222.2, 47.4%, 11.2%)')
          .text(annotation.text)

        // Add annotation description
        annotationGroup
          .append('text')
          .attr('x', x)
          .attr('y', cardY + 42)
          .attr('text-anchor', 'middle')
          .style('font-size', '11px')
          .style('fill', 'hsl(215.4, 16.3%, 46.9%)')
          .text(annotation.description)

        // Animate annotation appearance
        annotationGroup
          .transition()
          .duration(500)
          .delay(idx * 400)
          .style('opacity', 1)
          .on('end', () => {
            if (idx === annotations.length - 1) {
              setProgress(100)
              setTimeout(onComplete, 500)
            }
          })
      })
    }

    // Create arrow marker definition
    svg
      .append('defs')
      .append('marker')
      .attr('id', 'arrowhead')
      .attr('markerWidth', 10)
      .attr('markerHeight', 10)
      .attr('refX', 5)
      .attr('refY', 5)
      .attr('orient', 'auto')
      .append('polygon')
      .attr('points', '0 0, 10 5, 0 10')
      .attr('fill', 'hsl(217.2, 91.2%, 59.8%)')

    // Create line generator
    const line = d3
      .line()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.gdp))
      .curve(d3.curveMonotoneX)

    // Add the line path
    const path = svg
      .append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'hsl(222.2, 47.4%, 11.2%)')
      .attr('stroke-width', 3)
      .attr('d', line)

    // Animate the line drawing from left to right
    const totalLength = path.node().getTotalLength()

    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .delay(800)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0)
      .on('end', () => {
        // Add data points after line is drawn
        svg
          .selectAll('.dot')
          .data(data)
          .enter()
          .append('circle')
          .attr('class', 'dot')
          .attr('cx', (d) => xScale(d.year))
          .attr('cy', (d) => yScale(d.gdp))
          .attr('r', 0)
          .attr('fill', 'hsl(222.2, 47.4%, 11.2%)')
          .transition()
          .duration(300)
          .delay((d, i) => i * 100)
          .attr('r', 5)
          .on('end', (d, i) => {
            if (i === data.length - 1) {
              // After all dots are drawn, add annotations
              addAnnotations()
            }
          })
      })
      .tween('progress', function () {
        return function (t) {
          setProgress(Math.round(t * 100))
        }
      })

    // Add title
    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -80)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('US GDP Over Time')
      .style('opacity', 0)
      .transition()
      .duration(500)
      .delay(200)
      .style('opacity', 1)

  }, [prompt, onComplete])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Animation Progress: {progress}%</span>
      </div>
      <div className="flex justify-center bg-white dark:bg-slate-950 rounded-lg p-6">
        <svg ref={svgRef}></svg>
      </div>
    </div>
  )
}

export default ChartDemo
