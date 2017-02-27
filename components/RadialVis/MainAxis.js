import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import style from './RadialVis.css'
import { AXISGAP, AXISCOLOR, AXISSIZE,
        FONTCOLOR, FONTSIZE, FONTOFFSET,
        SVGMARGIN } from '../Defaults'

import AlignmentFeature from './features/AlignmentFeature'

/**
 * Axis Element containing the numbers of the nucleotides
 */
class MainAxis extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { d, geneLength, id, numLabels, axisColor,
            fontColor, axisSize, axisGap } = nextProps

    const fontOffset = FONTOFFSET
    const svgMargin = SVGMARGIN

    const r = Math.floor(d / 2)

    // Scale that maps the nucleotides to the position on the arc
    const geneScale = d3.scaleLinear()
      .domain([0, geneLength])
      .range([0, ((2 * Math.PI * r) * ((360 - (axisGap * 2)) / 360))])

    const arc = d3.arc()
                  .innerRadius(r)
                  .outerRadius(r)
                  .startAngle((0 + axisGap) * (Math.PI / 180))
                  .endAngle((360 - axisGap) * (Math.PI / 180))

    // Center Origin
    const group = d3.select(this.refs.group)
                    .attr('transform', `translate( ${r + (svgMargin / 2)} ,  ${r + (svgMargin / 2)} )`)

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
    const labels = Array(numLabels)
                    .fill(undefined)
                    .map((x, i) => (i * Math.floor(geneLength / numLabels)))

    group.selectAll('text')
    .data(labels)
    // UPDATE
    .attr('dy', fontOffset) // TODO Change depending on FontSize
    .attr('x', x =>
                (geneScale(x) - (x.toString().length * 4)))
    .attr('fill', fontColor)
    // ENTER
    .enter()
    .append('text')
    .attr('dy', fontOffset)
    .attr('x', x =>
                (geneScale(x) - (x.toString().length * 4)))
    .attr('fill', fontColor)
    .append('textPath')
    .attr('xlink:href', `#curve${id}`)
    .text(x => `'${x}`)
    // EXIT
    .exit()
    .remove()
  }

  // shouldComponentUpdate(nextProps) {
  //   if (this.props.d !== nextProps.d) {
  //     return true
  //   }
  //   return false
  // }

  render() {
    const { d, axisGap, geneLength } = this.props
    const svgSize = Math.floor((d + 2) / 2)
    const svgMargin = SVGMARGIN
    return (
      <svg ref="svg" width={d + svgMargin} height={d + svgMargin} className={style.centered} >
        <g ref="group" />
        {this.props.alignment &&
          <AlignmentFeature
            d={d}
            alignment={this.props.alignment}
            axisGap={axisGap}
            svgSize={svgSize}
            geneLength={geneLength}
          />
        }
      </svg>
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
  d: PropTypes.number.isRequired,
  geneLength: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  alignment: PropTypes.string,
  axisGap: PropTypes.number,
  numLabels: PropTypes.number,
  axisColor: PropTypes.string,
  axisSize: PropTypes.number,
  fontColor: PropTypes.string,
  fontSize: PropTypes.number,
}

export default MainAxis
