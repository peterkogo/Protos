import React, { PropTypes } from 'react'
import uID from 'lodash.uniqueid'

import MainAxis from './MainAxis'
import FeatureAxis from './FeatureAxis'
import style from './RadialVis.css'
import ProteinViewer from '../ProteinViewer'

import { SVGMARGIN, MAXNUMAXIS } from '../Defaults'
import { selectAxis, deselectAxis } from '../../actions/radialVis'

/**
 * Main Component for the D3 Visualization
 * TODO Inner Cirlce with something else, On Click => Lines, Protein Viewer
 * TODO GeneLength => Problems with arrays
 */
class RadialVis extends React.PureComponent {

  static getOpacity(feature, visState) {
    if (visState.selected.length < 1) {
      return 1
    }
    if (feature === visState.selected) {
      return 1
    }
    return 0.3
  }

  constructor(props) {
    super(props)
    this.calculateRadius = this.calculateRadius.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentWillMount() {
    // TODO probably useless
    this.setState({
      mainAxisKey: uID('mainAxis'),
    })
  }

  // componentWillReceiveProps(nextProps) {
  //   // Calculate new IDs for Features
  //   if (typeof nextProps.currentSequenceData.uniprot.data !== 'undefined') {
  //     const currentLength = this.state.featureAxisKeys.length
  //     const nextLength = nextProps.currentSequenceData.uniprot.data.length
  //
  //     if (nextLength > currentLength) {
  //       let featureAxisKeys = this.state.featureAxisKeys
  //
  //       for (let i = currentLength - 1; i < nextLength; i++) {
  //         featureAxisKeys = featureAxisKeys.concat(uID('featureAxis'))
  //       }
  //       this.setState(Object.assign({}, this.state,
  //         {
  //           featureAxisKeys,
  //         }))
  //     }
  //   }
  // }

  handleClick(e, feature) {
    if (feature === this.props.visState.selected) {
      this.props.dispatch(deselectAxis(feature))
    } else {
      this.props.dispatch(selectAxis(feature))
    }
  }

  calculateRadius(i) {
    const { ui } = this.props
    const margin = 50
    // const marginBetween = 100
    const size = ((ui.windowWidth > ui.windowHeight) ? ui.windowHeight : ui.windowWidth) - margin
    const a = 0
    const b = MAXNUMAXIS - 1
    const x = size / 2
    const y = size
    // const min = 300
    return Math.floor((((i - a) / (b - a)) * (y - x)) + x)
  }

  render() {
    const { ui, selectedSequence, currentSequenceData, visState } = this.props
    const { pdb, isFetchingPDB, aquaria, uniprot } = currentSequenceData

    const margin = 50
    const size = ((ui.windowWidth > ui.windowHeight) ? ui.windowHeight : ui.windowWidth) - margin

    const centerOrigin = `translate( ${this.calculateRadius(0) + (SVGMARGIN / 2)},
                                      ${this.calculateRadius(0) + (SVGMARGIN / 2)} )`

    let keys = []
    if (uniprot.data) {
      keys = Object.keys(uniprot.data)
    }

    return (
      <div className={style.parent}>
        <svg
          width={this.calculateRadius(MAXNUMAXIS - 1) + SVGMARGIN}
          height={this.calculateRadius(MAXNUMAXIS - 1) + SVGMARGIN}
          className={style.centered}
        >
          <g transform={centerOrigin} >
            {uniprot.data && keys.length > 0 && keys.slice(0, MAXNUMAXIS - 1).map((feature, i) => {
              const diameter = this.calculateRadius(i)
              return (
                <g
                  className={style.hovered}
                  key={feature}
                  style={{
                    opacity: RadialVis.getOpacity(feature, visState),
                  }}
                  onClick={e => this.handleClick(e, feature)}
                >
                  <FeatureAxis
                    ref={(c) => { this[feature.id] = c }}
                    d={diameter}
                    features={uniprot.data[feature].features}
                    geneLength={uniprot.chainLength}
                    id={feature}
                    name={uniprot.data[feature].name}
                  />
                </g>
              )
            })
            }
            {uniprot.data && aquaria.alignment &&
              <MainAxis
                ref={(c) => { this.mainAxis = c }}
                onClick={e => this.handleClick(e)}
                alignment={aquaria.alignment}
                d={this.calculateRadius(MAXNUMAXIS - 1)}
                geneLength={uniprot.chainLength}
                id={this.state.mainAxisKey}
              />
            }
          </g>
        </svg>
        <ProteinViewer
          d={Math.floor(this.calculateRadius(0) - (size / 5))}
          isFetchingPDB={isFetchingPDB}
          selectedSequence={selectedSequence}
          ui={ui} pdb={pdb}
        />
      </div>
    )
  }
}

RadialVis.propTypes = {
  currentSequenceData: PropTypes.shape({
    aquaria: PropTypes.object.isRequired,
    isFetchingAquaria: PropTypes.bool.isRequired,
    isFetchingPDB: PropTypes.bool.isRequired,
    isFetchingUniprot: PropTypes.bool.isRequired,
    pdb: PropTypes.string.isRequired,
    uniprot: PropTypes.object.isRequired,
  }).isRequired,
  dispatch: PropTypes.func.isRequired,
  selectedSequence: PropTypes.string.isRequired,
  ui: PropTypes.object.isRequired,
  visState: PropTypes.object.isRequired,
}

export default RadialVis
