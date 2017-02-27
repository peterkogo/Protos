import React, { PropTypes } from 'react'
import MainAxis from './MainAxis'
import FeatureAxis from './FeatureAxis'
import style from './RadialVis.css'
import ProteinViewer from '../ProteinViewer'

/**
 * Main Component for the D3 Visualization
 * TODO Inner Circle with Metal Ion Binding Size,
 * TODO Inner Cirlce with something else, On Click => Lines, Protein Viewer
 * TODO GeneLength => Problems with arrays
 */
class RadialVis extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      dataset: [
        1, 2, 3, 4,
      ],
    }
    this.calculateRadius = this.calculateRadius.bind(this)
  }

  calculateRadius(i) {
    const { ui } = this.props
    const margin = 50
    // const marginBetween = 100
    const size = ((ui.windowWidth > ui.windowHeight) ? ui.windowHeight : ui.windowWidth) - margin
    const a = 0
    const b = this.state.dataset.length - 1
    const x = size / 2
    const y = size
    // const min = 300
    return Math.floor(((i - a) / (b - a)) * (y - x) + x)
  }

  // TODO don't render Components if no Data is available (Best Practice?)
  render() {
    const { ui, selectedSequence, currentSequenceData } = this.props
    const { pdb, isFetchingPDB, aquaria, uniprot, isFetchingUniprot } = currentSequenceData
    const margin = 50
    const size = ((ui.windowWidth > ui.windowHeight) ? ui.windowHeight : ui.windowWidth) - margin
    return (
      <div className={style.parent}>
        {this.state.dataset.map((set, i, arr) => {
          const diameter = this.calculateRadius(i)
          if (i < arr.length - 1) {
            return (
              <FeatureAxis
                key={i}
                d={diameter}
                geneLength={393}
                id={i}
                uniprot={uniprot}
              />)
          }
          return (
            <MainAxis
              key={i}
              d={diameter}
              geneLength={393}
              id={i}
              alignment={aquaria.alignment}
            />
          )
        })}
        <ProteinViewer
          selectedSequence={selectedSequence}
          ui={ui} pdb={pdb}
          isFetchingPDB={isFetchingPDB}
          d={Math.floor(this.calculateRadius(0) - (size / 5))}
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
    uniprot: PropTypes.string.isRequired,
  }),
  selectedSequence: PropTypes.string,
  ui: PropTypes.object.isRequired,
}

export default RadialVis
