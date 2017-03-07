import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import uID from 'lodash.uniqueid'
import { STRUCTURESIZE, STRUCTURESTROKE,
        STRUCTUREFILLCOLOR, STRUCTURESTROKECOLOR } from '../../Defaults'

/**
 * Matching AlignmentFeature Component
 */
class AlignmentFeature extends React.Component {

  // TODO Make generally applicable
  static getAngle(alignment) {
    const first = new RegExp('(.*);.*;')
    const second = new RegExp('.*:.*:(.*):.*:(.*):.*,.*')
    const firstText = alignment.match(first)[1]
    const startStop = firstText.match(second)
    return {
      start: startStop[1],
      end: startStop[2],
    }
  }

  componentWillMount() {
    const ID = uID('tooltip')
    this.setState({
      ID,
    })

    // TODO extract css
    d3.select('body')
    .append('div')
    .attr('id', ID)
    .style('position', 'absolute')
    .style('top', '0')
    .style('left', '0')
    .style('z-index', '10')
    .style('visibility', 'hidden')
    .style('background-color', 'white')
    .style('padding', '1px 3px 1px 3px')
    .style('border-style', 'solid')
    .text('')
  }

  componentWillReceiveProps(nextProps) {
    const { axisGap, d, alignment,
            geneLength, fillColor, strokeColor } = nextProps

    const group = d3.select(this.group)

    const r = Math.floor(d / 2)

    const { start, end } = AlignmentFeature.getAngle(alignment)

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
        .attr('id', '')
        .data(Array(1))
        .enter()
        .append('path')
            .attr('d', arc)
            .attr('stroke-width', `${STRUCTURESTROKE}px`)
            .attr('fill', fillColor)
            .attr('stroke', strokeColor)
            .attr('id', '')
        .exit()
        .remove()

    const tooltip = d3.select(`#${this.state.ID}`)
    .text(`'${start} - '${end} `)

    group.selectAll('path')
    .on('mouseover', () => tooltip.style('visibility', 'visible'))
    .on('mousemove', () =>
          tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`))
    .on('mouseout', () => tooltip.style('visibility', 'hidden'))
  }

  render() {
    return (
      <g ref={(c) => { this.group = c }} />
    )
  }
}

AlignmentFeature.defaultProps = {
  fillColor: STRUCTUREFILLCOLOR,
  strokeColor: STRUCTURESTROKECOLOR,
}

AlignmentFeature.propTypes = {
  alignment: PropTypes.string.isRequired,
  d: PropTypes.number.isRequired,
  axisGap: PropTypes.number.isRequired,
  geneLength: PropTypes.number.isRequired,
  fillColor: PropTypes.string,
  strokeColor: PropTypes.string,
}

export default AlignmentFeature
