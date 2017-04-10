import React, { PropTypes } from 'react'
import * as d3 from 'd3'
import { AXISGAP, AXISCOLOR, AXISSIZE,
        FONTCOLOR, FONTSIZE, FONTOFFSET,
        FEATUREFILLCOLOR, CLICKAREAWIDTH } from '../Defaults'

import Feature from './features/Feature'
import style from './RadialVis.css'

/**
 * Axis Element containing the numbers of the nucleotides
 */
class FeatureAxis extends React.Component {

  componentWillReceiveProps(nextProps) {
    const { d, geneLength, id, numLabels, axisColor,
            fontColor, axisSize, name, fontSize } = nextProps

    const fontOffset = FONTOFFSET

    const r = Math.floor(d * 0.5)

    // Scale that maps the nucleotides to the position on the arc
    const geneScale = d3.scaleLinear()
      .domain([0, geneLength])
      .range([0, ((2 * Math.PI * r) * ((360 - (AXISGAP * 2)) / 360))])

    const arc = d3.arc()
                  .innerRadius(r)
                  .outerRadius(r)
                  .startAngle((0 + AXISGAP) * (Math.PI / 180))
                  .endAngle((360 - AXISGAP) * (Math.PI / 180))

    const clickArea = d3.select(this.clickArea)

    clickArea.selectAll('path')
          .data(Array(1))
          .attr('d', arc)
          .attr('stroke', 'white')
          .attr('stroke-width', `${CLICKAREAWIDTH}px`)
          .attr('id', `#clickArea${id}`)
          .enter()
          .append('path')
            .attr('d', arc)
            .attr('stroke', 'white')
            .attr('stroke-width', `${CLICKAREAWIDTH}px`)
            .attr('id', `#clickArea${id}`)
          .exit()
          .remove()

    const group = d3.select(this.group)


    // Create axis path
    // Create path for handling labels inside arc gap
    group.selectAll('path')
        .data(Array(2))
        .attr('d', arc)
        .attr('stroke', axisColor)
        .attr('stroke-width', (x, i) => ((i === 0) ? `${axisSize}px` : 0))
        .attr('id', (x, i) => (`${id}curve${i}`))
        .attr('transform', (x, i) => ((i === 1) ? 'rotate(90)' : 'rotate(0)'))
        .enter()
        .append('path')
          .attr('d', arc)
          .attr('stroke', axisColor)
          .attr('stroke-width', (x, i) => ((i === 0) ? `${axisSize}px` : 0))
          .attr('id', (x, i) => (`${id}curve${i}`))
          .attr('transform', (x, i) => ((i === 1) ? 'rotate(90)' : 'rotate(0)'))
        .exit()
        .remove()


    // Get Array(numLabels) with labelpositions
    const labels = Array(numLabels)
                    .fill(undefined)
                    .map((x, i) => ((i < numLabels - 1)
                      ? (i + 1) * Math.floor(geneLength / numLabels)
                      : i * Math.floor(geneLength / numLabels)))

    group.selectAll('text')
    .data(labels)
    // UPDATE
    .attr('dy', fontOffset) // TODO Change depending on FontSize
    .attr('x', x => (geneScale(x)))
    .attr('fill', fontColor)
    .attr('text-anchor', 'middle')
    // ENTER
    .enter()
    .append('text')
    .attr('dy', fontOffset)
    .attr('x', x => (geneScale(x)))
    .attr('fill', fontColor)
    .attr('text-anchor', 'middle')
    .style('font-size', `${fontSize}em`)
    .append('textPath')
    .attr('xlink:href', (x, i, arr) => ((i < arr.length - 1) ? `#${id}curve0` : `#${id}curve1`))
    .text(() => name)
    // EXIT
    .exit()
    .remove()

    // Early Transition Code
    // if (d !== this.props.d) {
    //   const arc2 = d3.arc()
    //                 .innerRadius(r + 10)
    //                 .outerRadius(r + 10)
    //                 .startAngle((0 + axisGap) * (Math.PI / 180))
    //                 .endAngle((360 - axisGap) * (Math.PI / 180))
    //
    //   group.selectAll('path')
    //   .transition()
    //   .duration(2000)
    //   .attr('d', arc2)
    // }
  }

  render() {
    const { d, geneLength, features, fillColor, dispatch, id, visState } = this.props

    let keys = []
    if (features) {
      keys = Object.keys(features)
    }


    return (
      <g className={style.groups}>
        <g ref={(c) => { this.clickArea = c }} />
        <g ref={(c) => { this.group = c }} />
        {keys.length > 0 && keys.map(key => (
          <Feature
            key={key}
            id={key}
            axisID={id}
            d={d}
            start={features[key][0]}
            stop={features[key][1]}
            axisGap={AXISGAP}
            geneLength={geneLength}
            fillColor={fillColor}
            dispatch={dispatch}
            visState={visState}
          />
          ))
        }
      </g>
    )
  }
}

FeatureAxis.defaultProps = {
  numLabels: 4,
  axisColor: AXISCOLOR,
  axisSize: AXISSIZE,
  fontColor: FONTCOLOR,
  fontSize: FONTSIZE,
  fillColor: FEATUREFILLCOLOR,
}

FeatureAxis.propTypes = {
  d: PropTypes.number.isRequired,
  geneLength: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  features: PropTypes.object.isRequired,
  numLabels: PropTypes.number,
  axisColor: PropTypes.string,
  axisSize: PropTypes.number,
  fontColor: PropTypes.string,
  fontSize: PropTypes.number,
  fillColor: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  visState: PropTypes.object.isRequired,
}

export default FeatureAxis
