import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import uID from 'lodash.uniqueid'

import MainAxis from './MainAxis'
import FeatureAxis from './FeatureAxis'
import style from './RadialVis.css'
import ProteinViewer from '../ProteinViewer'
import ParallelCoordinates from '../ParallelCoordinates'

import { SVGMARGIN, MAXNUMAXIS, FEATUREFILLCOLORS,
        OPACITYNOTSELECTED, STRUCTURESIZE, FEATURESIZE } from '../Defaults'
import { selectAxis, deselectAxisFeature, deselectFeature, createAxisOrder } from '../../actions/radialVis'

/**
 * Main Component for the D3 Visualization
 * TODO GeneLength => Problems with arrays
 */
class RadialVis extends React.PureComponent {

  static getOpacity(feature, visState) {
    if (visState.selectedAxis.length < 1) {
      return 1
    }
    if (feature === visState.selectedAxis) {
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
    this.handleScroll = this.handleScroll.bind(this)

    this.handle = [0, 0]
    this.oldAngle = 0
    this.drag = false
    this.beingDragged = false
    this.proteinViewerZoom = -1
    this.rotating = 0
    this.wasDragged = false
    this.scrollAllowed = true
    this.createdAxisOrder = false
    this.uniprotLastUpdated = 0
  }

  componentWillMount() {
    this.setState({
      mainAxisKey: uID('mainAxis'),
    })
  }

  componentWillReceiveProps(nextProps) {
    const proteinData = nextProps.proteinData
    const uniprot = nextProps.proteinDataHealth.uniprot
    if ((!this.createdAxisOrder || uniprot.lastUpdated.toString() !== this.uniprotLastUpdated)
          && proteinData.features) {
      this.createdAxisOrder = true
      this.uniprotLastUpdated = uniprot.lastUpdated.toString()
      this.props.dispatch(
        createAxisOrder(nextProps.selectedSequence, proteinData.features))
    }
  }

  handleClick(e, featureAxis) {
    const { selectedSequence, visState, dispatch } = this.props
    if (!this.wasDragged && e.nativeEvent.target.className.baseVal !== 'feature') {
      if (featureAxis === visState.selectedAxis) {
        if (visState.selectedFeature === '') {
          dispatch(deselectAxisFeature(selectedSequence))
        } else {
          dispatch(deselectFeature(selectedSequence))
        }
      } else {
        dispatch(deselectAxisFeature(selectedSequence))
        dispatch(selectAxis(selectedSequence, featureAxis))
      }
    }
    this.wasDragged = false
  }

  handleDrag(e) {
    e.preventDefault()
    if (this.drag) {
      const center = this.calculateRadius(MAXNUMAXIS - 1) * 0.5
      const v1 = [e.nativeEvent.offsetX - center, e.nativeEvent.offsetY - center]
      const v2 = [this.handle[0] - center, this.handle[1] - center]

      let newAngle = Math.atan2(v1[1], v1[0])
      newAngle -= Math.atan2(v2[1], v2[0])

      if (!this.beingDragged && newAngle !== 0) {
        this.beingDragged = true
        this.wasDragged = true
        this.forceUpdate()
      }

      newAngle += this.oldAngle

      const degree = (newAngle * (360 / (2 * Math.PI)))
      ReactDOM.findDOMNode(this.svg).style.transform = `translate(-50%, -50%) rotate(${degree}deg)`
      this.oldAngle = newAngle
    }
  }

  handleDragClick(e, mouseDown) {
    e.preventDefault()
    this.handle = [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
    this.drag = mouseDown
    if (!mouseDown) {
      this.beingDragged = false
    }
    this.forceUpdate()
  }

  handleScroll(e) {
    if (e.nativeEvent.deltaY < 0 && this.proteinViewerZoom !== -1 && this.scrollAllowed) {
      this.scrollAllowed = false
      setTimeout(() => {
        this.scrollAllowed = true
      }, 200)
      this.proteinViewerZoom -= 1
      this.forceUpdate()
    }
    if (e.nativeEvent.deltaY > 0 &&
          this.proteinViewerZoom !== MAXNUMAXIS - 1 && this.scrollAllowed) {
      this.scrollAllowed = false
      setTimeout(() => {
        this.scrollAllowed = true
      }, 200)
      this.proteinViewerZoom += 1
      this.forceUpdate()
    }
  }

  calculateRadius(i) {
    const { ui } = this.props
    const margin = SVGMARGIN - 1
    // const marginBetween = 100
    const size = ((ui.windowWidth > ui.windowHeight) ? ui.windowHeight : ui.windowWidth) - margin
    const a = 0
    const b = MAXNUMAXIS - 1
    const x = size * 0.5
    const y = size
    // const min = 300
    return Math.floor((((i - a) / (b - a)) * (y - x)) + x)
  }

  render() {
    const { ui, selectedSequence, visState, dispatch,
      proteinData, proteinDataHealth, variants } = this.props
    const { order } = visState

    const size = this.calculateRadius(MAXNUMAXIS - 1) + SVGMARGIN
    const pvDiameter = this.calculateRadius(this.proteinViewerZoom)

    const centerOrigin = `translate( ${this.calculateRadius(0) + (SVGMARGIN * 0.5)},
                                      ${this.calculateRadius(0) + (SVGMARGIN * 0.5)} )`
    const center = Math.floor(size * 0.5)

    return (
      <div className={style.parent} >
        {proteinData.pdb &&
        <ProteinViewer
          d={pvDiameter}
          selectedSequence={selectedSequence}
          ui={ui}
          pdb={proteinData.pdb}
          pdbHealth={proteinDataHealth.pdb}
          dispatch={dispatch}
        />
        }
        <svg
          width={size}
          height={size}
          className={`${style.svg} ${style.zindex}`}
          onMouseMove={e => this.handleDrag(e)}
          onMouseDown={e => this.handleDragClick(e, true)}
          onMouseUp={e => this.handleDragClick(e, false)}
          onWheel={e => this.handleScroll(e)}
          ref={(c) => { this.svg = c }}
        >
          <defs>
            <mask id="radialVisMask" x="0" y="0" width={`${size}px`} height={`${size}px`}>
              <rect
                x={`-${center}px`}
                y={`-${center}px`}
                width={`${size}px`}
                height={`${size}px`}
                fill="#ffffff"
              />
              <circle
                cx="0"
                cy="0"
                r={`${(this.calculateRadius(this.proteinViewerZoom) * 0.5) + Math.ceil((FEATURESIZE + 1) * 0.5)}`}
                className={this.mask}
              />
            </mask>
          </defs>
          <g transform={centerOrigin} mask="url(#radialVisMask)">
            {proteinData.features[order[1]] && visState.order &&
              order.slice(order.length - (MAXNUMAXIS - 1), order.length).map((feature, i) => {
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
                      d={diameter}
                      features={proteinData.features[feature].features}
                      geneLength={proteinData.length}
                      id={feature}
                      name={proteinData.features[feature].name}
                      fillColor={FEATUREFILLCOLORS[i % FEATUREFILLCOLORS.length]}
                      dispatch={dispatch}
                      visState={visState}
                      selectedSequence={selectedSequence}
                    />
                  </g>
                )
              })
            }
            {proteinData.features && proteinData.chains &&
              <MainAxis
                ref={(c) => { this.mainAxis = c }}
                onClick={e => this.handleClick(e)}
                chains={proteinData.chains}
                d={this.calculateRadius(MAXNUMAXIS - 1)}
                geneLength={proteinData.length}
                id={this.state.mainAxisKey}
                variants={variants}
                dispatch={dispatch}
              />
            }
          </g>
        </svg>
        {
          proteinData.features[order[1]] &&
          <ParallelCoordinates
            d={pvDiameter}
            maxD={this.calculateRadius(MAXNUMAXIS - 1) - STRUCTURESIZE}
            proteinData={proteinData}
            rotating={this.beingDragged}
            rotation={this.oldAngle}
            ui={ui}
            visState={visState}
          />
        }
      </div>
    )
  }
}

RadialVis.propTypes = {
  proteinData: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  selectedSequence: PropTypes.string.isRequired,
  ui: PropTypes.object.isRequired,
  visState: PropTypes.object.isRequired,
  proteinDataHealth: PropTypes.object.isRequired,
  variants: PropTypes.object,
}

export default RadialVis
