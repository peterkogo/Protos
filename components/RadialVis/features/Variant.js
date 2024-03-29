import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import uID from 'lodash.uniqueid'
import { FEATURESIZE, VARIANTCIRCLER, VARIANTFONTSIZE, PATHSIZE, KNOWNCOLOR,
  VARIANTDIST, VARIANTFONTCENTER, VARIANTSYMBOLSIZE, AXISGAP } from '../../Defaults'
import { selectVariant, deselectVariant, deselectAxisFeature } from '../../../actions/radialVis'

/**
 * Matching Structure Component
 */
class Variant extends React.Component {

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
    this.updateVariant = this.updateVariant.bind(this)
    this.initiated = false
  }

  componentDidMount() {
    this.updateVariant()
  }

  componentDidUpdate() {
    this.updateVariant()
  }

  updateVariant() {
    const { d, geneLength, variant } = this.props

    const group = d3.select(this.group)

    const r = Math.floor(d * 0.5)

    // Scale that maps nucleotides on arc
    const scale2 = d3.scaleLinear()
                      .domain([0, geneLength])
                      .range([(-90 + AXISGAP) * (Math.PI / 180),
                        ((270 - AXISGAP) * (Math.PI / 180))])

    const scale3 = d3.scaleLinear()
                      .domain([0, geneLength])
                      .range([(0 + AXISGAP),
                        ((360 - AXISGAP))])
    const x = ((r + (FEATURESIZE * 0.5)) * Math.cos(scale2(variant.pos)))
    const y = ((r + (FEATURESIZE * 0.5)) * Math.sin(scale2(variant.pos)))
    const rot = scale3(variant.pos)

    const poly = [{ x: 0.0, y: 7 },
                  { x: 5.0, y: -VARIANTDIST },
                  { x: -5.0, y: -VARIANTDIST }]

    group.selectAll('polygon')
                    .data([poly])
                    .enter().append('polygon')
                    .attr('points', ps => ps.map(p => [p.x, p.y].join(',')).join(' '))
                    .attr('fill', 'black')
                    // .attr('stroke-width', 0)

    group.append('circle')
            .attr('cx', 0)
            .attr('cy', -VARIANTDIST)
            .attr('r', VARIANTCIRCLER)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('stroke-width', '1')
    group.append('text')
            .attr('dy', -VARIANTFONTCENTER[0] + VARIANTDIST)
            .attr('dx', -VARIANTFONTCENTER[1])
            .text(variant.varAA)
            .style('font-size', VARIANTFONTSIZE)
            .style('font-weight', '500')
            .style('text-align', 'center')

    group.append('circle')
            .attr('cx', 0)
            .attr('cy', -(VARIANTCIRCLER * 2) - VARIANTDIST)
            .attr('r', VARIANTCIRCLER)
            .attr('fill', 'white')
            .attr('stroke', 'black')
            .attr('stroke-width', '1')

    group.append('text')
            .attr('dy', (-(VARIANTCIRCLER * 2) - VARIANTFONTCENTER[0]) + VARIANTDIST)
            .attr('dx', -VARIANTFONTCENTER[1])
            .text(variant.refAA)
            .style('font-size', VARIANTFONTSIZE)
            .style('font-weight', '500')
            .style('text-align', 'center')

    let symbol = d3.symbolSquare

    switch (variant.type) {
      case 'stop':
        symbol = d3.symbol().type(d3.symbolSquare).size(VARIANTSYMBOLSIZE)
        break
      case 'indel': {
        const height = PATHSIZE * 1.5
        const offset = height * 0.5
        symbol = `M 0 ${offset} L -${PATHSIZE} ${-height + offset}
                  L ${PATHSIZE} ${-height + offset} L 0 ${offset} Z`
        break
      }
      case 'deletion': {
        const offset = Math.floor(PATHSIZE * 0.3)
        const size = 2
        symbol = `M -${PATHSIZE} ${-offset + size} L -${PATHSIZE} ${-offset - size}
                  L ${PATHSIZE} ${-offset - size} L ${PATHSIZE} ${-offset + size}
                  L -${PATHSIZE} ${-offset + size} Z`
        break
      }
      case 'insertion':
        symbol = d3.symbol().type(d3.symbolCross).size(VARIANTSYMBOLSIZE)
        break
      case 'splice':
        symbol = d3.symbol().type(d3.symbolStar).size(VARIANTSYMBOLSIZE)
        break
      case 'frameshift':
        symbol = d3.symbol().type(d3.symbolWye).size(VARIANTSYMBOLSIZE)
        break
      case 'nonsynonym': {
        const offset = Math.floor(PATHSIZE * 0.3)
        const size = 2
        symbol = `M ${-offset + size} -${PATHSIZE} L ${-offset - size} -${PATHSIZE}
                  L ${-offset - size} ${PATHSIZE} L ${-offset + size} ${PATHSIZE}
                  L ${-offset + size} -${PATHSIZE} Z`
        break
      }
      default:
        break
    }

    let color = 'black'
    if (variant.known) {
      color = KNOWNCOLOR
    }
    group.append('path')
      .attr('d', symbol)
      .attr('fill', color)
      .attr('transform', `translate(0, -${(4 * VARIANTCIRCLER) + VARIANTDIST})`)

    group.attr('transform', `translate(${x},${y}) rotate(${rot})`)

    if (!this.initiated) {
      this.forceUpdate()
      this.initiated = true
    }
  }

  handleClick(e, id) {
    const { selectedSequence, selectedVariant, cluster, selectedCluster } = this.props
    if (selectedVariant === id && selectedCluster === cluster) {
      this.props.dispatch(deselectVariant(selectedSequence))
    } else {
      this.props.dispatch(deselectAxisFeature(selectedSequence))
      this.props.dispatch(selectVariant(selectedSequence, cluster, id))
    }
  }

  render() {
    const { id, selectedVariant, cluster, selectedCluster } = this.props
    let opacity = {}
    if (selectedVariant !== '' &&
      (selectedVariant !== id || cluster !== selectedCluster)) {
      opacity = {
        opacity: 0.5,
      }
    }
    return (
      <g
        ref={(c) => { this.group = c }}
        className="variant"
        onClick={e => this.handleClick(e, id)}
        style={opacity}
      />
    )
  }
}

Variant.propTypes = {
  d: PropTypes.number.isRequired,
  geneLength: PropTypes.number.isRequired,
  selectedSequence: PropTypes.string.isRequired,
  selectedVariant: PropTypes.string.isRequired,
  selectedCluster: PropTypes.string.isRequired,
  cluster: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  // axisID: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  // visState: PropTypes.object.isRequired,
  // selectedSequence: PropTypes.string.isRequired,
  variant: PropTypes.object.isRequired,
}

export default Variant
