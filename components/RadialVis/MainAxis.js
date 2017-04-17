import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import { AXISGAP, AXISCOLOR, AXISSIZE,
        FONTCOLOR, FONTSIZE, FONTOFFSET } from '../Defaults'

import AlignmentFeature from './features/AlignmentFeature'
import Variant from './features/Variant'
import VariantCluster from './features/VariantCluster'

import style from './RadialVis.css'

/**
 * Axis Element containing the numbers of the nucleotides
 */
class MainAxis extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { d, geneLength, id, numLabels, axisColor,
            fontColor, fontSize, axisSize, axisGap } = nextProps

    const fontOffset = FONTOFFSET

    const r = Math.floor(d * 0.5)

    // Scale that maps the nucleotides to the position on the arc
    const geneScale = d3.scaleLinear()
      .domain([0, geneLength])
      .range([0, ((2 * Math.PI * r) * ((360 - (axisGap * 2)) / 360))])

    const arc = d3.arc()
                  .innerRadius(r)
                  .outerRadius(r)
                  .startAngle((0 + axisGap) * (Math.PI / 180))
                  .endAngle((360 - axisGap) * (Math.PI / 180))

    const group = d3.select(this.group)

    group.selectAll('path')
        .attr('d', arc)
        .attr('stroke-width', `${axisSize}px`)
        .attr('id', `curve${id}`)
        .attr('stroke', axisColor)
        .data(Array(1)) // TODO ??? Other way?
        .enter()
        .append('path')
          .attr('d', arc)
          .attr('stroke-width', `${axisSize}px`)
          .attr('id', `curve${id}`)
          .attr('stroke', axisColor)
        .exit()
        .remove()

    // Get Array(numLabels) with Labels
    const labels = Array(numLabels + 1)
                    .fill(undefined)
                    .map((x, i) => (i * Math.floor(geneLength / numLabels)))

    group.selectAll('text')
    .data(labels)
    // UPDATE
    .attr('dy', fontOffset) // TODO Change depending on FontSize
    .attr('x', (x, i) => {
      if (i === 0) {
        return (geneScale(x) - (x.toString().length * 4)) + 10
      }
      if (i === numLabels) {
        return (geneScale(x) - (x.toString().length * 4)) - 10
      }
      return geneScale(x) - (x.toString().length * 4)
    })
    .attr('fill', fontColor)
    // ENTER
    .enter()
    .append('text')
    .attr('dy', fontOffset)
    .attr('x', (x, i) => {
      if (i === 0) {
        return (geneScale(x) - (x.toString().length * 4)) + 10
      }
      if (i === numLabels) {
        return (geneScale(x) - (x.toString().length * 4)) - 10
      }
      return geneScale(x) - (x.toString().length * 4)
    })
    .attr('fill', fontColor)
    .style('font-size', `${fontSize}em`)
    .append('textPath')
    .attr('xlink:href', `#curve${id}`)
    .text(x => `'${x}`)
    // EXIT
    .exit()
    .remove()
  }

  render() {
    const { d, axisGap, geneLength, variants, dispatch } = this.props
    const keys = Object.keys(variants)
    return (
      <g className={style.groups}>
        <g ref={(c) => { this.group = c }} />
        {this.props.chains.B &&
          <AlignmentFeature
            d={d}
            alignment={this.props.chains.B}
            axisGap={axisGap}
            geneLength={geneLength}
          />
        }
        { this.props.variants &&
          keys.map((key) => {
            return (
              <VariantCluster
                key={key}
                d={d}
                axisGap={axisGap}
                geneLength={geneLength}
                cluster={variants[key]}
                dispatch={dispatch}
              />
            )
          })
        }
      </g>
    )
  }
}

MainAxis.defaultProps = {
  axisGap: AXISGAP,
  numLabels: 8,
  axisColor: AXISCOLOR,
  axisSize: AXISSIZE,
  fontColor: FONTCOLOR,
  fontSize: FONTSIZE,
}

MainAxis.propTypes = {
  chains: PropTypes.object.isRequired,
  axisColor: PropTypes.string,
  axisGap: PropTypes.number,
  axisSize: PropTypes.number,
  d: PropTypes.number.isRequired,
  fontColor: PropTypes.string,
  fontSize: PropTypes.number,
  geneLength: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  numLabels: PropTypes.number,
  variants: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
}

export default MainAxis
