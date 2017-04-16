import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import style from './ProteinViewer.css'
import { initProteinViewer, initProteinStructure } from '../../actions/radialVis'

const pv = require('bio-pv')

/**
 * Loads bio-pv protein viewer and initializes it with the currently selected
 * protein in the state.
 */
class ProteinViewer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.initStructure = this.initStructure.bind(this)
    this.initViewer = this.initViewer.bind(this)
    this.receivedAt = 0
  }

  componentDidMount() {
    const size = (this.props.ui.windowWidth > this.props.ui.windowHeight)
                    ? this.props.ui.windowHeight : this.props.ui.windowWidth
    this.initViewer(size)
  }

  componentWillReceiveProps(nextProps) {
    // Delete old object from viewer
    if (nextProps.selectedSequence !== this.props.selectedSequence) {
      this.viewer.rm(this.props.selectedSequence)
    }

    // Resize Viewer if needed
    const oldSize = (this.props.ui.windowWidth > this.props.ui.windowHeight)
                    ? this.props.ui.windowHeight : this.props.ui.windowWidth

    const newSize = (nextProps.ui.windowWidth > nextProps.ui.windowHeight)
                    ? nextProps.ui.windowHeight : nextProps.ui.windowWidth

    if (oldSize !== newSize) {
      ReactDOM.findDOMNode(this.pv).innerHTML = ''
      this.initViewer(newSize)
    }

    // Change Structure if needed
    if (nextProps.pdb && nextProps.pdb.length > 0
      && nextProps.pdbHealth.receivedAt !== this.receivedAt) {
      this.receivedAt = nextProps.pdbHealth.receivedAt
      this.initStructure(nextProps.selectedSequence, nextProps.pdb, this.viewer)
    }
  }

  initViewer(size) {
    const viewer = new pv.Viewer(this.pv, {
      width: size || 'auto',
      height: size || 'auto',
      antialias: true,
      quality: 'high',
    })
    this.viewer = viewer
    this.props.dispatch(initProteinViewer(this.props.selectedSequence, viewer))
  }

  initStructure(selectedSequence, pdb, optionalViewer) {
    let viewer = optionalViewer
    if (typeof optionalViewer === 'undefined') {
      viewer = this.viewer
    }
    // TODO Not generally applicable
    const structure = pv.io.pdb(pdb).select({ chain: 'B' }).select('protein')
    this.structure = structure

    viewer.cartoon(selectedSequence,
                    structure,
                    { color: pv.color.ssSuccession() },
                  )

    viewer.centerOn(structure)
    // viewer.autoZoom()
    viewer.setZoom(200)

    this.props.dispatch(initProteinStructure(this.props.selectedSequence, structure))
  }

  render() {
    const { d, ui } = this.props
    const size = ((ui.windowWidth > ui.windowHeight)
                  ? ui.windowHeight : ui.windowWidth) + 5
    const center = Math.floor(size * 0.5)

    return (
      <div>
        <div ref={(c) => { this.pv = c }} className={`${style.center} ${style.middlelay}`} />
        <div className={`${style.center} ${style.noPointerEvents} ${style.overlay}`}>
          <svg width={`${size}px`} height={`${size}px`} >
            <defs>
              <mask id="mask" x="0" y="0" width={`${size}px`} height={`${size}px`}>
                <rect x="0" y="0" width={`${size}px`} height={`${size}px`} fill="#ffffff" />
                <circle cx={center} cy={center} r={`${Math.floor(d * 0.5)}`} />
              </mask>
            </defs>
            <rect x="0" y="0" width={`${size}px`} height={`${size}px`} mask="url(#mask)" fill="#ffffff" className={`${style.pointerEventsPainted}`}/>
          </svg>
        </div>
      </div>
    )
  }
}

ProteinViewer.propTypes = {
  d: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  pdb: PropTypes.string.isRequired,
  pdbHealth: PropTypes.object.isRequired,
  selectedSequence: PropTypes.string.isRequired,
  ui: PropTypes.object.isRequired,
}

export default ProteinViewer
