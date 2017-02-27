import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import { STRUCTURESIZE, STRUCTURESTROKE,
        STRUCTUREFILLCOLOR, STRUCTURESTROKECOLOR, SVGMARGIN } from '../Defaults'

/**
 * Matching Structure Component
 */
class Structure extends React.Component {
  constructor(props) {
    super(props)
    this.getAngle = this.getAngle.bind(this)
  }

  componentDidMount() {
    d3.select('body')
    .append('div')
    .attr('id', 'tooltip') // TODO Unique ID
    .style('position', 'absolute')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .text('')
  }

  componentWillReceiveProps(nextProps) {
    const { svgSize, axisGap, d, alignment,
            geneLength, fillColor, strokeColor } = nextProps

    const group = d3.select(this.refs.structure)
              .attr('transform',
                `translate( ${svgSize + (SVGMARGIN / 2)} ,  ${svgSize + (SVGMARGIN / 2)} )`)

    const r = Math.floor(d / 2)

    const { start, end } = this.getAngle(alignment)

    // Scale that maps nucleotides on arc
    const scale = d3.scaleLinear()
                      .domain([0, geneLength])
                      .range([0 + axisGap, 360 - axisGap])

    const arc = d3.arc()
                  .innerRadius(r - (STRUCTURESIZE / 2))
                  .outerRadius(r + (STRUCTURESIZE / 2))
                  .startAngle(scale(start) * (Math.PI / 180))
                  .endAngle(scale(end) * (Math.PI / 180))

    group.selectAll('path')
        .attr('d', arc)
        .attr('stroke-width', `${STRUCTURESTROKE}px`)
        .attr('fill', fillColor)
        .attr('stroke', strokeColor)
        .data(Array(1))
        .enter()
        .append('path')
            .attr('d', arc)
            .attr('stroke-width', `${STRUCTURESTROKE}px`)
            .attr('fill', fillColor)
            .attr('stroke', strokeColor)
        .exit()
        .remove()

    const tooltip = d3.select('#tooltip')
    .text(`'${start} - '${end} `)

    group.selectAll('path')
    .on('mouseover', () => tooltip.style('visibility', 'visible'))
    .on('mousemove', () =>
          tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`))
    .on('mouseout', () => tooltip.style('visibility', 'hidden'))
  }

  // TODO Make generally applicable
  getAngle(alignment) {
    const first = new RegExp('(.*);.*;')
    const second = new RegExp('.*:.*:(.*):.*:(.*):.*,.*')
    const firstText = alignment.match(first)[1]
    const startStop = firstText.match(second)
    return {
      start: startStop[1],
      end: startStop[2],
    }
  }

  render() {
    return (
      <g ref="structure"></g>
    )
  }
}

Structure.defaultProps = {
  fillColor: STRUCTUREFILLCOLOR,
  strokeColor: STRUCTURESTROKECOLOR,
}

Structure.propTypes = {
  alignment: PropTypes.string.isRequired,
  d: PropTypes.number.isRequired,
  axisGap: PropTypes.number.isRequired,
  svgSize: PropTypes.number.isRequired,
  geneLength: PropTypes.number.isRequired,
  fillColor: PropTypes.string,
  strokeColor: PropTypes.string,
}

export default Structure
