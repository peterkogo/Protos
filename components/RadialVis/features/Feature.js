import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import uID from 'lodash.uniqueid'
import { FEATURESIZE, FEATURESTROKE,
        FEATUREFILLCOLOR, FEATURESTROKECOLOR,
      FEATUREWIDTH } from '../../Defaults'
import { selectAxisFeature, deselectAxisFeature } from '../../../actions/radialVis'

/**
 * Matching Structure Component
 */
class Feature extends React.Component {

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount() {
    const ID = uID('featureTooltip')
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
    .style('font-size', '1em')
    .style('opacity', '0')
    .style('background-color', 'rgba(250, 250, 250, 0.9)')
    .style('padding', '1px 3px 1px 3px')
    .style('border-radius', '2px')
    .style('transition', 'opacity 0.2s ease')
    .style('pointer-events', 'none')
    .text('')
  }

  componentWillReceiveProps(nextProps) {
    const { axisGap, d,
            geneLength, fillColor, strokeColor, start, stop } = nextProps

    const group = d3.select(this.group)

    const r = Math.floor(d * 0.5)

    // Scale that maps nucleotides on arc
    const scale = d3.scaleLinear()
                      .domain([0, geneLength])
                      .range([0 + axisGap, 360 - axisGap])

    const arc = d3.arc()
                  .innerRadius(r - (FEATURESIZE * 0.5))
                  .outerRadius(r + (FEATURESIZE * 0.5))
                  .startAngle(scale(start - (FEATUREWIDTH * 0.5)) * (Math.PI / 180))
                  .endAngle(scale(stop + (FEATUREWIDTH * 0.5)) * (Math.PI / 180))

    group.selectAll('path')
        .attr('d', arc)
        .attr('stroke-width', `${FEATURESTROKE}px`)
        .attr('fill', fillColor)
        .attr('stroke', strokeColor)
        .attr('id', '')
        .attr('class', 'feature')
        .data(Array(1))
        .enter()
        .append('path')
            .attr('d', arc)
            .attr('stroke-width', `${FEATURESTROKE}px`)
            .attr('fill', fillColor)
            .attr('stroke', strokeColor)
            .attr('id', '')
            .attr('class', 'feature')
        .exit()
        .remove()

    const tooltip = d3.select(`#${this.state.ID}`)
    .text(`'${start} - '${stop} `)

    group.selectAll('path')
    .on('mouseover', () => tooltip.style('opacity', '1'))
    .on('mousemove', () =>
          tooltip.style('top', `${event.pageY - 10}px`).style('left', `${event.pageX + 10}px`))
    .on('mouseout', () => tooltip.style('opacity', '0'))
  }

  handleClick(e, id) {
    const { selectedSequence } = this.props
    if (this.props.visState.selectedAxis === this.props.axisID
        && this.props.visState.selectedFeature === id) {
      this.props.dispatch(deselectAxisFeature(selectedSequence))
    } else {
      this.props.dispatch(selectAxisFeature(selectedSequence, this.props.axisID, id))
    }
  }

  render() {
    const { id } = this.props
    return (
      <g
        ref={(c) => { this.group = c }}
        className="feature"
        onClick={e => this.handleClick(e, id)}
      />
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
  start: PropTypes.number.isRequired,
  stop: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  axisID: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  visState: PropTypes.object.isRequired,
  selectedSequence: PropTypes.string.isRequired,
}

export default Feature
