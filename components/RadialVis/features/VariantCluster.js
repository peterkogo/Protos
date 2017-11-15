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

  render() {
    const { cluster, geneLength, d, dispatch, id, selectedSequence, visState } = this.props
    const keys = Object.keys(cluster.variants)
    return (
      <g
        ref={(c) => { this.group = c }}
        className="variant"
      >
        {keys.map((key) => {
          return (
            <Variant
              key={key}
              id={key}
              d={d}
              geneLength={geneLength}
              variant={cluster.variants[key]}
              dispatch={dispatch}
              selectedSequence={selectedSequence}
              cluster={id}
              selectedVariant={visState.selectedVariant}
              selectedCluster={visState.selectedCluster}
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
  selectedSequence: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  // axisID: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  visState: PropTypes.object.isRequired,
  // selectedSequence: PropTypes.string.isRequired,
  cluster: PropTypes.object.isRequired,
}

export default VariantCluster
