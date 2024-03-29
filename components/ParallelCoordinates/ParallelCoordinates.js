import React from 'react'
import PropTypes from 'prop-types'
import { vec4 } from 'gl-matrix'
import * as d3 from 'd3'
import style from '../ProteinViewer/ProteinViewer.css'
import { AXISGAP } from '../Defaults'

/* eslint no-underscore-dangle: 0 */
class ParallelCoordinates extends React.PureComponent {

  constructor(props) {
    super(props)
    this.refresh = this.refresh.bind(this)
    this.updateFeaturePositions = this.updateFeaturePositions.bind(this)
    this.updateVariantPosition = this.updateVariantPosition.bind(this)
    this.updateScale = this.updateScale.bind(this)

    this.oldView = new Float32Array(4).fill(1)
    this.running = false
    this.currentDiameterInner = 0
    this.currentDiameterOuter = 0
    this.refreshedScale = false
    this.refreshedPositions = false
    this.currentRotation = 0
    this.currentGeneLength = 0
    this.wasSelected = false
  }

  componentWillReceiveProps(nextProps) {
    const { visState, proteinData, d, rotation, maxD, variants } = nextProps

    if (proteinData.length !== this.currentGeneLength || !this.scale) {
      this.updateScale(proteinData.length)
    }

    if (typeof visState.viewer !== 'undefined' &&
        typeof visState.structure !== 'undefined') {
      this.viewer = visState.viewer
      this.structure = visState.structure

      if (!this.running) {
        this.running = true
        this.refresh()
      }

      if (proteinData && visState.selectedAxis && visState.selectedVariant === '') {
        this.updateFeaturePositions(d, maxD, proteinData.features, visState.selectedAxis,
          visState.selectedFeature, rotation, proteinData.length,
          proteinData.chains.B)
      }

      if (visState.selectedVariant !== '') {
        this.updateVariantPosition(variants, visState.selectedCluster, visState.selectedVariant,
          d, maxD, proteinData.chains.B, rotation)
      }
    }
  }

  updateVariantPosition(variants, cluster, variant, d, maxD, alignment, rotation) {
    const pos = variants[cluster].variants[variant].pos
    const rInner = Math.floor(d * 0.5)
    const rOuter = Math.floor((maxD + 5) * 0.5)

    if (pos >= alignment.start && pos <= alignment.end) {
      const point = this.scale(pos) + rotation
      const featurePositions = [{
        start: pos,
        end: pos,
        centerResidue: pos - alignment.start,
        innerXY: [
          Math.floor((this.canvasInner.width * 0.5) + (Math.cos(point) * rInner)),
          Math.floor((this.canvasInner.height * 0.5) + (Math.sin(point) * rInner)),
        ],
        outerXY: [
          (this.canvasInner.width * 0.5) + (Math.cos(point) * rOuter),
          (this.canvasInner.height * 0.5) + (Math.sin(point) * rOuter),
        ],
      }]
      this.featurePositions = featurePositions
      this.refreshedPositions = true
    } else {
      this.featurePositons = {}
      this.featurePositions = []
      this.refreshedPositions = true
    }
  }

  updateScale(geneLength) {
    if (geneLength !== this.currentGeneLength || !this.scale) {
      // TODO for some reason calculation is shifted 90deg
      this.scale = d3.scaleLinear()
        .domain([0 + (geneLength * 0.25), geneLength * 1.25])
        .range([0, ((2 * Math.PI) * ((360 - (AXISGAP * 2)) / 360))])
      this.refreshedScale = true
    }
  }

  updateFeaturePositions(d, maxD, data, selectedAxis, selectedFeature,
    rotation, geneLength, alignment) {
    // Update scale if diameter changes
    if (geneLength !== this.currentGeneLength || !this.scale) {
      // TODO for some reason calculation is shifted 90deg
      this.scale = d3.scaleLinear()
        .domain([0 + (geneLength * 0.25), geneLength * 1.25])
        .range([0, ((2 * Math.PI) * ((360 - (AXISGAP * 2)) / 360))])
      this.refreshedScale = true
    }

    // Update Positions if scale is initialized and no positions initialized yet
    // or if the selected Feature is changed
    if (this.scale &&
      (!this.featurePositions || selectedAxis !== this.props.visState.selectedAxis
        || this.refreshedScale || rotation !== this.currentRotation
        || d !== this.currentDiameterInner || maxD !== this.currentDiameterOuter)) {
      this.refreshedScale = false

      const rInner = Math.floor(d * 0.5)
      const rOuter = Math.floor(maxD * 0.5)

      const filteredFeatures = []
      if (selectedFeature !== '') {
        const feature = data[selectedAxis].features[selectedFeature]
        const center = feature[0] + Math.floor(((feature[1] - feature[0]) * 0.5))
        if (center >= alignment.start && center <= alignment.end) {
          filteredFeatures.push(feature)
        }
        // filteredFeatures.push(data[selectedAxis].features[selectedFeature])
      } else {
        const keys = Object.keys(data[selectedAxis].features)
        keys.forEach((key) => {
          const feature = data[selectedAxis].features[key]
          const center = feature[0] + Math.floor(((feature[1] - feature[0]) * 0.5))
          if (center >= alignment.start && center <= alignment.end) {
            filteredFeatures.push(feature)
          }
        })
      }

      const featurePositions = filteredFeatures.map((feature) => {
        const centerResidue = feature[0] + Math.floor(((feature[1] - feature[0]) * 0.5))
        const center = this.scale(feature[0] +
                                    Math.floor(((feature[1] - feature[0]) * 0.5))) + rotation
        return {
          start: feature[0],
          end: feature[1],
          centerResidue: centerResidue - alignment.start,
          innerXY: [
            Math.floor((this.canvasInner.width * 0.5) + (Math.cos(center) * rInner)),
            Math.floor((this.canvasInner.height * 0.5) + (Math.sin(center) * rInner)),
          ],
          outerXY: [
            (this.canvasInner.width * 0.5) + (Math.cos(center) * rOuter),
            (this.canvasInner.height * 0.5) + (Math.sin(center) * rOuter),
          ],
        }
      })
      this.featurePositions = featurePositions
      this.refreshedPositions = true
    }
  }

  refresh() {
    const newView = this.viewer._cam._camModelView

    if ((this.props.visState.selectedAxis || this.props.visState.selectedVariant)
        && this.featurePositions
        && (newView.toString() !== this.oldView || this.refreshedPositions)) {
      // Rects get only cleared if something was selected before
      if (!this.wasSelected) {
        this.wasSelected = true
      }
      // Clear Canvas on PV
      const ctxInner = this.canvasInner.getContext('2d')
      ctxInner.clearRect(0, 0, this.canvasInner.width, this.canvasInner.height)
      // Clear canvas on RadialVis
      const ctxOuter = this.canvasOuter.getContext('2d')
      ctxOuter.clearRect(0, 0, this.canvasOuter.width, this.canvasOuter.height)

      this.featurePositions.forEach((feature) => {
        const atom = this.structure._chains[0]._residues[feature.centerResidue]._atoms[1]._atom

        const atomPos = new Float32Array(4)
        atomPos.set(atom.pos())
        atomPos[3] = 1.0

        let transformed = new Float32Array(4)
        transformed = vec4.transformMat4(transformed, atomPos, this.viewer._cam._camModelView)
        transformed = vec4.transformMat4(transformed, transformed, this.viewer._cam._projection)
        const wClip = transformed[3]

        const clipped = transformed.map(elem => (elem / wClip))

        const window = new Float32Array(3)
        window[0] = (this.viewer._cam._width * 0.5) + (clipped[0] * 0.5 * this.viewer._cam._width)
        window[1] = (this.viewer._cam._height * 0.5) + (clipped[1] * 0.5 * this.viewer._cam._height)

        // Draw lines on inner canvas
        ctxInner.beginPath()
        ctxInner.moveTo(window[0], this.viewer._cam._height - window[1])
        ctxInner.lineTo(feature.innerXY[0], feature.innerXY[1])
        ctxInner.stroke()
        ctxInner.closePath()

        ctxOuter.beginPath()
        ctxOuter.moveTo(feature.innerXY[0], feature.innerXY[1])
        ctxOuter.lineTo(feature.outerXY[0], feature.outerXY[1])
        ctxOuter.stroke()
        ctxOuter.closePath()
      })

      this.oldView = newView.toString()
      this.refreshedPositions = false
    }

    if (!this.props.visState.selectedAxis && !this.props.visState.selectedVariant
        && this.wasSelected) {
      // // Rects get only cleared if something was selected before
      const ctxInner = this.canvasInner.getContext('2d')
      ctxInner.clearRect(0, 0, this.canvasInner.width, this.canvasInner.height)

      const ctxOuter = this.canvasOuter.getContext('2d')
      ctxOuter.clearRect(0, 0, this.canvasOuter.width, this.canvasOuter.height)

      this.wasSelected = false
    }

    window.requestAnimationFrame(this.refresh)
  }

  render() {
    const { ui, rotating } = this.props
    const size = (ui.windowWidth > ui.windowHeight)
                  ? ui.windowHeight : ui.windowWidth

    const opacity = (rotating) ? 0 : 1
    const opac = { opacity }

    return (
      <div>
        <canvas
          ref={(c) => { this.canvasInner = c }}
          width={`${size}px`}
          height={`${size}px`}
          style={opac}
          className={`${style.center} ${style.noPointerEvents} ${style.paco} ${style.underlay}`}
        />
        <canvas
          ref={(c) => { this.canvasOuter = c }}
          width={`${size}px`}
          height={`${size}px`}
          style={opac}
          className={`${style.center} ${style.noPointerEvents} ${style.paco} ${style.top}`}
        />
      </div>
    )
  }
}

ParallelCoordinates.propTypes = {
  d: PropTypes.number.isRequired,
  maxD: PropTypes.number.isRequired,
  proteinData: PropTypes.object.isRequired,
  rotating: PropTypes.bool.isRequired,
  rotation: PropTypes.number.isRequired,
  ui: PropTypes.object.isRequired,
  visState: PropTypes.object.isRequired,
  variants: PropTypes.object,
}

export default ParallelCoordinates
