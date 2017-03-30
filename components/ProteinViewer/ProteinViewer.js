import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { vec4 } from 'gl-matrix'
import * as d3 from 'd3'
import style from './ProteinViewer.css'
import { AXISGAP } from '../Defaults'

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
    this.refresh = this.refresh.bind(this)
    this.updatePositions = this.updatePositions.bind(this)

    this.oldAtomPos = [0, 0, 0]
    this.oldView = new Float32Array(4).fill(1)
    this.xy = [[0, 0]]
    this.lastxy = [[0, 0]].toString()
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
    if (nextProps.pdb && nextProps.pdb.length > 0 && nextProps.pdb !== this.props.pdb
        && this.props.data && this.props.geneLength) {
      this.initStructure(nextProps.selectedSequence, nextProps.pdb, this.viewer)
    }

    if (this.props.data && this.props.geneLength) {
      this.updateScale(this.props.d, this.props.geneLength, this.props.data)
    }

    if (this.props.selected !== nextProps.selected) {
      this.updatePositions(nextProps.selected, nextProps.data)
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

    if (this.props.pdb && this.props.pdb.length > 0) {
      this.initStructure(this.props.selectedSequence, this.props.pdb, viewer)
    }
  }

  updatePositions(selected, data) {
//    data[selected].features.forEach((feature) => {
//      
//    })
  }

  updateScale(d, geneLength, data) {
    const r = Math.floor(d / 2)

    this.scale = d3.scaleLinear()
      .domain([0, geneLength])
      .range([0, ((2 * Math.PI) * ((360 - (AXISGAP * 2)) / 360))])

    const x = Math.floor(this.canvas.width / 2) + (Math.cos(this.scale(0)) * r)
    const y = Math.floor(this.canvas.height / 2) + (Math.sin(this.scale(0)) * r)

    const x2 = Math.floor(this.canvas.width / 2) + (Math.cos(this.scale(60)) * r)
    const y2 = Math.floor(this.canvas.height / 2) + (Math.sin(this.scale(60)) * r)

    this.xy = [[x, y], [x2, y2]]

    console.log(this.scale(0), this.scale(392))
  }

  refresh() {
    window.requestAnimationFrame(this.refresh)

    const oldView = this.oldView
    const newView = this.viewer._cam._camModelView

    if (newView.toString() !== oldView || this.xy.toString() !== this.lastxy) {
      const ctx = this.canvas.getContext('2d')

      const atom = this.structure.select({ chain: 'A' })._chains[0]._residues[5]._atoms[3]._atom.pos()
      const newAtomPos = new Float32Array(4)
      newAtomPos[0] = atom[0]
      newAtomPos[1] = atom[1]
      newAtomPos[2] = atom[2]
      newAtomPos[3] = 1.0

      let out = new Float32Array(4)
      out = vec4.transformMat4(out, newAtomPos, this.viewer._cam._camModelView)
      // console.log(out)
      out = vec4.transformMat4(out, out, this.viewer._cam._projection)
      const wClip = out[3]
      out[0] /= wClip
      out[1] /= wClip
      out[2] /= wClip

      let window = new Float32Array(3)
      window[0] =  (this.viewer._cam._width / 2) + (out[0] * 0.5 * this.viewer._cam._width)
      window[1] =  (this.viewer._cam._height / 2) + (out[1] * 0.5 * this.viewer._cam._height)
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.xy.forEach((pos) => {

        ctx.beginPath()
        ctx.moveTo(pos[0], pos[1])
        ctx.lineTo(window[0], this.viewer._cam._height - window[1])
        ctx.stroke()
        ctx.closePath()
      })


      // ctx.fillRect(window[0], this.viewer._cam._height - window[1], 1, 1)

      this.oldView = newView.toString()
      this.lastxy = this.xy.toString()
    }
  }

  initStructure(selectedSequence, pdb, optionalViewer, data, geneLength) {
    let viewer = optionalViewer
    if (typeof optionalViewer === 'undefined') {
      viewer = this.viewer
    }
    const structure = pv.io.pdb(pdb)
    this.structure = structure
    viewer.cartoon(selectedSequence,
                              structure,
                              { color: pv.color.ssSuccession() }
                            )

    const atom = structure.select({ chain: 'A' })._chains[0]._residues[5]._atoms[3]._atom.pos()

    const options = {
      fontSize: 16,
      fontColor: '#f22',
      backgroundAlpha: 0.4,
    }
    viewer.label('label', 'text', atom, options)
    const ligands = structure.select({ rnames: ['SAH', 'RVP'] })
    viewer.ballsAndSticks('ligands', ligands)
    viewer.centerOn(structure)
    viewer.autoZoom()

    this.refresh()
  }

  render() {
    const { d, ui } = this.props
    const size = (ui.windowWidth > ui.windowHeight)
                  ? ui.windowHeight : ui.windowWidth

    return (
      <div>
        <div ref={(c) => { this.pv = c }} className={`${style.center}`} />
        <canvas ref={(c) => { this.canvas = c }} width={`${size}px`} height={`${size}px`} className={`${style.center} ${style.noPointerEvents}`} />
        <div className={`${style.center} ${style.noPointerEvents}`}>
          <svg width={`${size}px`} height={`${size}px`} className={style.noPointerEvents} >
            <defs>
              <mask id="mask" x="0" y="0" width={`${size}px`} height={`${size}px`}>
                <rect x="0" y="0" width={`${size}px`} height={`${size}px`} fill="#ffffff" />
                <circle cx={`${Math.floor(size / 2)}`} cy={`${Math.floor(size / 2)}`} r={`${Math.floor(d / 2)}`} />
              </mask>
            </defs>
            <rect x="0" y="0" width={`${size}px`} height={`${size}px`} mask="url(#mask)" fill="#ffffff" />
          </svg>
        </div>
      </div>
    )
  }
}

ProteinViewer.propTypes = {
  d: PropTypes.number.isRequired,
  data: PropTypes.object.isRequired,
  geneLength: PropTypes.number.isRequired,
  pdb: PropTypes.string.isRequired,
  selected: PropTypes.string.isRequired, //rename to selectedFeature
  selectedSequence: PropTypes.string.isRequired,
  ui: PropTypes.object.isRequired,
}

export default ProteinViewer
