import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import style from './RadialVis.css'
import { AXISGAP, AXISCOLOR, AXISSIZE,
        FONTCOLOR, FONTSIZE, FONTOFFSET,
        SVGMARGIN } from '../Defaults'

import Feature from './features/Feature'

/**
 * Axis Element containing the numbers of the nucleotides
 */
class FeatureAxis extends React.Component {

  constructor(props) {
    super(props)
    this.getUniprotData = this.getUniprotData.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    const { d, geneLength, id, numLabels, axisColor,
            fontColor, axisSize, axisGap, uniprot } = nextProps

    const fontOffset = FONTOFFSET

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
                    .attr('transform',
                      `translate( ${r + (SVGMARGIN / 2)} ,  ${r + (SVGMARGIN / 2)} )`)

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

    const { name } = this.getUniprotData(uniprot)

    // Get Array(numLabels) with Labels
    const labels = Array(numLabels - 1)
                    .fill(undefined)
                    .map((x, i) => ((i + 1) * Math.floor(geneLength / numLabels)))

    group.selectAll('text')
    .data(labels)
    // UPDATE
    .attr('dy', fontOffset) // TODO Change depending on FontSize
    .attr('x', (x) =>
                (geneScale(x) - x.toString().length * 25)) // TODO Realistic Value
    .attr('fill', fontColor)
    // ENTER
    .enter()
    .append('text')
    .attr('dy', fontOffset)
    .attr('x', (x) =>
                (geneScale(x) - x.toString().length * 25))
    .attr('fill', fontColor)
    .append('textPath')
    .attr('xlink:href', `#curve${id}`)
    .text(() => name)
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

  getUniprotData(uniprot) {
    // if (window.DOMParser) {
    //   const parser = new DOMParser()
    //   const xmlDoc = parser.parseFromString(uniprot, 'text/xml')
    //   const features = xmlDoc.getElementsByTagName('feature')
    //   if (features.length > 0) {
    //     console.log(features.item(0))
    //     // const parser = parser.parseFromString
    //     // for (let i = 0; i < x.length; i++) {
    //     //   if (x[i].getAttribute('type') === 'metal ion-binding site') {
    //     //     console.log(x[i].childNodes[0].childNodes[0].getAttribute('position'))
    //     //     return true
    //     //   }
    //     // }
    //   }
    //
    // }
    return {
      name: 'Metal-Ion Binding Site',
      positions: [176, 179, 238, 242],
    }
  }

  render() {
    const { d, axisGap, geneLength } = this.props
    const { positions } = this.getUniprotData(this.props.uniprot)
    const svgSize = Math.floor((d + 2) / 2)
    const svgMargin = SVGMARGIN
    return (
      <svg ref="svg" width={d + svgMargin} height={d + svgMargin} className={style.centered} >
        <g ref="group"></g>
        {this.props.uniprot &&
          positions.map((x, i) => (
            <Feature
              key={i}
              d={d}
              position={x}
              axisGap={axisGap}
              svgSize={svgSize}
              geneLength={geneLength}
              id={i}
            />
          ))

        }
      </svg>
    )
  }
}

FeatureAxis.defaultProps = {
  axisGap: AXISGAP,
  numLabels: 4,
  axisColor: AXISCOLOR,
  axisSize: AXISSIZE,
  fontColor: FONTCOLOR,
  fontSize: FONTSIZE,
}

FeatureAxis.propTypes = {
  d: PropTypes.number.isRequired,
  geneLength: PropTypes.number.isRequired,
  id: PropTypes.number.isRequired,
  uniprot: PropTypes.string,
  axisGap: PropTypes.number,
  numLabels: PropTypes.number,
  axisColor: PropTypes.string,
  axisSize: PropTypes.number,
  fontColor: PropTypes.string,
  fontSize: PropTypes.number,
}

export default FeatureAxis
