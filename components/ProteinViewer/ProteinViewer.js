import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import style from './ProteinViewer.css'

const pv = require('bio-pv')

/**
 * Loads bio-pv protein viewer and initializes it with the currently selected
 * protein in the state.
 * TODO autoresize, circular overlay
 */
class ProteinViewer extends React.PureComponent {

  constructor(props) {
    super(props)
    this.initRenderer = this.initRenderer.bind(this)
    this.initMask = this.initMask.bind(this)
  }

  componentDidMount() {
    const viewer = new pv.Viewer(this.refs.pv, {
      width: this.props.d || 'auto',
      height: this.props.d || 'auto',
      antialias: true,
      quality: 'high',
    })
    this.setState({ viewer }) // eslint-disable-line
  }

  // componentDidUpdate(props, state) {
  //   // this.initMask()
  // }

  componentWillReceiveProps(nextProps) {
    // Delete old object from viewer
    if (nextProps.selectedSequence !== this.props.selectedSequence) {
      this.state.viewer.rm(this.props.selectedSequence)
    }
    if (nextProps.d !== this.props.d) {
      ReactDOM.findDOMNode(this.refs.pv).innerHTML = ''
      const viewer = new pv.Viewer(this.refs.pv, {
        width: nextProps.d || 'auto',
        height: nextProps.d || 'auto',
        antialias: true,
        quality: 'high',
      })
      this.setState({ viewer })
    }
  }

  initRenderer() {
    const structure = pv.io.pdb(this.props.pdb)
    this.state.viewer.cartoon(this.props.selectedSequence,
                              structure,
                              { color: pv.color.ssSuccession() }
                            )
    const ligands = structure.select({ rnames: ['SAH', 'RVP'] })
    this.state.viewer.ballsAndSticks('ligands', ligands)
    this.state.viewer.centerOn(structure)
    this.state.viewer.autoZoom()
  }

  initMask() {
    const ctx = this.refs.canvas.getContext('2d')
    ctx.beginPath()
    ctx.arc(this.props.d / 2, this.props.d / 2, this.props.d / 2, 0, 2 * Math.PI)
    ctx.rect(this.props.d, 0, -this.props.d, this.props.d)
    // ctx.fillStyle = 'white'
    ctx.fill()
  }

  render() {
    if (this.props.pdb && this.props.pdb.length > 0 && this.state.viewer) {
      this.initRenderer()
      // this.initMask()
    }

    const d = this.props.d
    const size = {
      width: d,
      height: d,
    }

    // <div className={style.center}>
    //   <div id="pv" ref="pv" className={`${style.center} ${style.z0}`} style={size}></div>
    //   <canvas ref="canvas" height={d} width={d} className={`${style.overlay} ${style.z1}`} />
    // </div>
    return (
      <div id="pv" ref="pv" className={`${style.center} ${style.z0}`} style={size}></div>
    )
  }
}

ProteinViewer.propTypes = {
  pdb: PropTypes.string.isRequired,
  selectedSequence: PropTypes.string.isRequired,
  focusedFeature: PropTypes.object,
  ui: PropTypes.object.isRequired,
  d: PropTypes.number,
}

export default ProteinViewer
