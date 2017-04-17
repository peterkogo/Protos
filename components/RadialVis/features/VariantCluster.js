import React from 'react'
import PropTypes from 'prop-types'
import * as d3 from 'd3'
import uID from 'lodash.uniqueid'
import { VARIANTWIDTH } from '../../Defaults'
import { selectAxisFeature, deselectAxisFeature } from '../../../actions/radialVis'

import Variant from './Variant'

/**
 * Matching Structure Component
 */
class VariantCluster extends React.Component {

  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount() {
    // const ID = uID('variantTooltip')
    // this.setState({
    //   ID,
    // })
    //
    // // TODO extract css
    // d3.select('body')
    // .append('div')
    // .attr('id', ID)
    // .style('position', 'absolute')
    // .style('top', '0')
    // .style('left', '0')
    // .style('z-index', '10')
    // .style('font-size', '1em')
    // .style('opacity', '0')
    // .style('background-color', 'rgba(250, 250, 250, 0.9)')
    // .style('padding', '1px 3px 1px 3px')
    // .style('border-radius', '2px')
    // .style('transition', 'opacity 0.2s ease')
    // .style('pointer-events', 'none')
    // .text('')
  }

  componentWillReceiveProps(nextProps) {
  }

  handleClick(e, id) {
    // const { selectedSequence } = this.props
    // if (this.props.visState.selectedAxis === this.props.axisID
    //     && this.props.visState.selectedFeature === id) {
    //   this.props.dispatch(deselectAxisFeature(selectedSequence))
    // } else {
    //   this.props.dispatch(selectAxisFeature(selectedSequence, this.props.axisID, id))
    // }
  }

  render() {
    const { cluster, geneLength, d, dispatch, id } = this.props
    const keys = Object.keys(cluster.variants)
    return (
      <g
        ref={(c) => { this.group = c }}
        className="variant"
        onClick={e => this.handleClick(e, id)}
      >
        {keys.map((key) => {
          return (
            <Variant
              key={key}
              d={d}
              geneLength={geneLength}
              variant={cluster.variants[key]}
              dispatch={dispatch}
            />
          )
        })}
      </g>
    )
  }
}

VariantCluster.propTypes = {
  d: PropTypes.number.isRequired,
  axisGap: PropTypes.number.isRequired,
  geneLength: PropTypes.number.isRequired,
  // id: PropTypes.string.isRequired,
  // axisID: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  // visState: PropTypes.object.isRequired,
  // selectedSequence: PropTypes.string.isRequired,
  cluster: PropTypes.object.isRequired,
}

export default VariantCluster
