import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import uID from 'lodash.uniqueid'
import { STRUCTURESIZE, STRUCTURESTROKE,
        STRUCTUREFILLCOLOR, STRUCTURESTROKECOLOR } from '../../Defaults'

import style from './Feature.css'

/**
 * Matching AlignmentFeature Component
 */
class AlignmentFeature extends React.Component {

  componentWillMount() {
    const ID = uID('tooltip')
    this.setState({
      ID,
    })

    d3.select('body')
    .append('div')
    .attr('id', ID)
    .attr('class', style.tooltip)
  }

  componentWillReceiveProps(nextProps) {
    const { axisGap, d, alignment,
            geneLength, fillColor, strokeColor } = nextProps

    const group = d3.select(this.group)

    const r = Math.floor(d * 0.5)

    const { start, end } = alignment

    // Scale that maps nucleotides on arc
    const scale = d3.scaleLinear()
                      .domain([0, geneLength])
                      .range([0 + axisGap, 360 - axisGap])

    const arc = d3.arc()
                  .innerRadius(r - (STRUCTURESIZE * 0.5))
                  .outerRadius(r + (STRUCTURESIZE * 0.5))
                  .startAngle(scale(start) * (Math.PI / 180))
                  .endAngle(scale(end) * (Math.PI / 180))

    group.selectAll('path')
        .attr('d', arc)
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
    .on('mouseover', () => tooltip.style('opacity', 1))
    .on('mousemove', () =>
          tooltip.style('transform', `translate(${event.pageX + 10}px, ${event.pageY - 10}px)`))
    .on('mouseout', () => tooltip.style('opacity', 0))
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
  alignment: PropTypes.object.isRequired,
  d: PropTypes.number.isRequired,
  axisGap: PropTypes.number.isRequired,
  geneLength: PropTypes.number.isRequired,
  fillColor: PropTypes.string,
  strokeColor: PropTypes.string,
}

export default AlignmentFeature
