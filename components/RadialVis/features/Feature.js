import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import uID from 'lodash.uniqueid'
import { FEATURESIZE, FEATURESTROKE,
        FEATUREFILLCOLOR, FEATURESTROKECOLOR,
      FEATUREWIDTH } from '../../Defaults'

/**
 * Matching Structure Component
 */
class Feature extends React.Component {

  componentWillMount() {
    const ID = uID('feature')
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
    const { axisGap, d,
            geneLength, fillColor, strokeColor, start, stop } = nextProps

    const group = d3.select(this.group)

    const r = Math.floor(d / 2)

    // Scale that maps nucleotides on arc
    const scale = d3.scaleLinear()
                      .domain([0, geneLength])
                      .range([0 + axisGap, 360 - axisGap])

    const arc = d3.arc()
                  .innerRadius(r - (FEATURESIZE / 2))
                  .outerRadius(r + (FEATURESIZE / 2))
                  .startAngle(scale(start - (FEATUREWIDTH / 2)) * (Math.PI / 180))
                  .endAngle(scale(stop + (FEATUREWIDTH / 2)) * (Math.PI / 180))

    group.selectAll('path')
        .attr('d', arc)
        .attr('stroke-width', `${FEATURESTROKE}px`)
        .attr('fill', fillColor)
        .attr('stroke', strokeColor)
        .attr('id', '')
        .data(Array(1))
        .enter()
        .append('path')
            .attr('d', arc)
            .attr('stroke-width', `${FEATURESTROKE}px`)
            .attr('fill', fillColor)
            .attr('stroke', strokeColor)
            .attr('id', '')
        .exit()
        .remove()

    const tooltip = d3.select(`#${this.state.ID}`)
    .text(`'${start} - '${stop} `)

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

Feature.defaultProps = {
  fillColor: FEATUREFILLCOLOR,
  strokeColor: FEATURESTROKECOLOR,
}

Feature.propTypes = {
  d: PropTypes.number.isRequired,
  axisGap: PropTypes.number.isRequired,
  geneLength: PropTypes.number.isRequired,
  fillColor: PropTypes.string,
  strokeColor: PropTypes.string,
}

export default Feature
