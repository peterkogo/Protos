import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import style from './ProteinViewer.css'

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
  }

  componentDidMount() {
    const size = (this.props.ui.windowWidth > this.props.ui.windowHeight)
                    ? this.props.ui.windowHeight : this.props.ui.windowWidth
    this.initViewer(size)
  }

  componentWillReceiveProps(nextProps) {
    // Delete old object from viewer
    if (nextProps.selectedSequence !== this.props.selectedSequence) {
      this.state.viewer.rm(this.props.selectedSequence)
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
    if (nextProps.pdb && nextProps.pdb.length > 0 && nextProps.pdb !== this.props.pdb) {
      this.initStructure(nextProps.selectedSequence, nextProps.pdb)
    }
  }

  initViewer(size) {
    const viewer = new pv.Viewer(this.pv, {
      width: size || 'auto',
      height: size || 'auto',
      antialias: true,
      quality: 'high',
    })
    this.setState({ viewer })
    if (this.props.pdb && this.props.pdb.length > 0) {
      this.initStructure(this.props.selectedSequence, this.props.pdb, viewer)
    }
  }

  initStructure(selectedSequence, pdb, optionalViewer) {
    let viewer = optionalViewer
    if (typeof optionalViewer === 'undefined') {
      viewer = this.state.viewer
    }
    const structure = pv.io.pdb(pdb)
    viewer.cartoon(selectedSequence,
                              structure,
                              { color: pv.color.ssSuccession() }
                            )


    const atom = structure //.select({ chain: 'A' })
    console.log(atom)
    //
    // const options = {
    //  fontSize : 16, fontColor: '#f22', backgroundAlpha : 0.4
    // }
    // const test = this.state.viewer.label('label', 'text', atom._atoms[5].pos(), options)
    // console.log(viewer._cam)

    const ligands = structure.select({ rnames: ['SAH', 'RVP'] })
    viewer.ballsAndSticks('ligands', ligands)
    viewer.centerOn(structure)
    viewer.autoZoom()
  }

  render() {
    const { d, ui } = this.props
    const size = (ui.windowWidth > ui.windowHeight)
                  ? ui.windowHeight : ui.windowWidth

    return (
      <div>
        <div ref={(c) => { this.pv = c }} className={`${style.center}`} />
        <div className={`${style.center} ${style.noPointerEvents}`}>
          <svg width={`${size}px`} height={`${size}px`} className={style.noPointerEvents}>
            <defs>
              <mask id="mask" x="0" y="0" width={`${size}px`} height={`${size}px`}>
                <rect x="0" y="0" width={`${size}px`} height={`${size}px`} fill="#ffffff" />
                <circle cx={`${Math.floor(size / 2)}`} cy={`${Math.floor(size / 2)}`} r={`${Math.floor(d / 2)}`} />
              </mask>
            </defs>
            <rect x="0" y="0" width={`${size}px`} height={`${size}px`} mask="url(#mask)" fill="#ffffff"/>
          </svg>
        </div>
      </div>
    )
  }
}

ProteinViewer.propTypes = {
  d: PropTypes.number.isRequired,
  // focusedFeature: PropTypes.object,
  pdb: PropTypes.string.isRequired,
  selectedSequence: PropTypes.string.isRequired,
  ui: PropTypes.object.isRequired,
}

export default ProteinViewer
