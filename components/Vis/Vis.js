import React, { PropTypes } from 'react'
// import ProteinViewer from '../PV'
import RadialVis from '../D3'
// import style from './Vis.css';

/**
 * Main Component for the Visualization
 * TODO Currently a pointless Component
 */
class Vis extends React.Component {


  componentDidMount() {}

  // <ProteinViewer
  //   selectedSequence={selectedSequence}
  //   ui={ui} pdb={currentSequenceData.pdb}
  //   isFetchingPDB={currentSequenceData.isFetchingPDB}
  // />f
  render() {
    const { selectedSequence, currentSequenceData, ui } = this.props

    return (
      <RadialVis
        ui={ui}
        selectedSequence={selectedSequence}
        aquaria={currentSequenceData.aquaria}
        isFetchingAquaria={currentSequenceData.isFetchingAquaria}
        isFetchingPDB={currentSequenceData.isFetchingPDB}
        isFetchingUniprot={currentSequenceData.isFetchingUniprot}
        pdb={currentSequenceData.pdb}
        uniprot={currentSequenceData.uniprot}
      />
    )
  }
}

Vis.propTypes = {
  selectedSequence: PropTypes.string.isRequired,
  currentSequenceData: PropTypes.shape({
    aquaria: PropTypes.object.isRequired,
    pdb: PropTypes.string.isRequired,
    uniprot: PropTypes.string.isRequired,
    isFetchingAquaria: PropTypes.bool.isRequired,
    isFetchingPDB: PropTypes.bool.isRequired,
    isFetchingUniprot: PropTypes.bool.isRequired,
  }),
  ui: PropTypes.object.isRequired,
}

export default Vis
