import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import uID from 'lodash.uniqueid'

import MainAxis from './MainAxis'
import FeatureAxis from './FeatureAxis'
import style from './RadialVis.css'
import ProteinViewer from '../ProteinViewer'

import { SVGMARGIN, MAXNUMAXIS, FEATUREFILLCOLORS, OPACITYNOTSELECTED } from '../Defaults'
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
    return OPACITYNOTSELECTED
  }

  constructor(props) {
    super(props)
    this.calculateRadius = this.calculateRadius.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.handleDrag = this.handleDrag.bind(this)
    this.handleDragClick = this.handleDragClick.bind(this)

    this.handle = [0, 0]
    this.oldAngle = 0
    this.drag = false
  }

  componentWillMount() {
    this.setState({
      mainAxisKey: uID('mainAxis'),
    })
  }

  handleClick(e, feature) {
    if (feature === this.props.visState.selected) {
      this.props.dispatch(deselectAxis(feature))
    } else {
      this.props.dispatch(selectAxis(feature))
    }
  }

  handleDrag(e) {
    if (this.drag) {
      const center = Math.floor(this.calculateRadius(MAXNUMAXIS - 1) / 2)
      const v1 = [e.nativeEvent.offsetX - center, e.nativeEvent.offsetY - center]
      const v2 = [this.handle[0] - center, this.handle[1] - center]

      let newAngle = Math.atan2(v1[1], v1[0])
      newAngle -= Math.atan2(v2[1], v2[0])
      newAngle += this.oldAngle

      const degree = (newAngle * (360 / (2 * Math.PI)))
      ReactDOM.findDOMNode(this.svg).style.transform = `rotate(${degree}deg)`

      this.oldAngle = newAngle
    }
  }

  handleDragClick(e, mouseDown) {
    this.handle = [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
    this.drag = mouseDown
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
      <div
        className={style.parent}
        ref={(c) => { this.svg = c }}
      >
        <svg
          width={this.calculateRadius(MAXNUMAXIS - 1) + SVGMARGIN}
          height={this.calculateRadius(MAXNUMAXIS - 1) + SVGMARGIN}
          className={style.svg}
          onMouseMove={e => this.handleDrag(e)}
          onMouseDown={e => this.handleDragClick(e, true)}
          onMouseUp={e => this.handleDragClick(e, false)}
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
                    fillColor={FEATUREFILLCOLORS[i % FEATUREFILLCOLORS.length]}
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
