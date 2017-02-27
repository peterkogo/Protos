import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import { FEATURESIZE, FEATURESTROKE,
        FEATUREFILLCOLOR, FEATURESTROKECOLOR,
      FEATUREWIDTH, SVGMARGIN } from '../../Defaults'

/**
 * Matching Structure Component
 */
class Feature extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { svgSize, axisGap, d, position,
            geneLength, fillColor, strokeColor } = nextProps

    const group = d3.select(this.refs.feature)
              .attr('transform',
              `translate( ${svgSize + (SVGMARGIN / 2)} ,  ${svgSize + (SVGMARGIN / 2)} )`)

    const r = Math.floor(d / 2)

    // Scale that maps nucleotides on arc
    const scale = d3.scaleLinear()
                      .domain([0, geneLength])
                      .range([0 + axisGap, 360 - axisGap])

    const arc = d3.arc()
                  .innerRadius(r - (FEATURESIZE / 2))
                  .outerRadius(r + (FEATURESIZE / 2))
                  .startAngle(scale(position - (FEATUREWIDTH / 2)) * (Math.PI / 180))
                  .endAngle(scale(position + (FEATUREWIDTH / 2)) * (Math.PI / 180))

    group.selectAll('path')
        .attr('d', arc)
        .attr('stroke-width', `${FEATURESTROKE}px`)
        .attr('fill', fillColor)
        .attr('stroke', strokeColor)
        .data(Array(1))
        .enter()
        .append('path')
            .attr('d', arc)
            .attr('stroke-width', `${FEATURESTROKE}px`)
            .attr('fill', fillColor)
            .attr('stroke', strokeColor)
        .exit()
        .remove()
  }

  render() {
    return (
      <g ref="feature"></g>
    )
  }
}

Feature.defaultProps = {
  fillColor: FEATUREFILLCOLOR,
  strokeColor: FEATURESTROKECOLOR,
}

Feature.propTypes = {
  position: PropTypes.number.isRequired,
  d: PropTypes.number.isRequired,
  axisGap: PropTypes.number.isRequired,
  svgSize: PropTypes.number.isRequired,
  geneLength: PropTypes.number.isRequired,
  fillColor: PropTypes.string,
  strokeColor: PropTypes.string,
  id: PropTypes.number.isRequired,
}

export default Feature
