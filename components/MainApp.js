import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { fetchSequenceIfNeeded } from '../actions/sequenceData'

import DataViewer from '../components/Ui/DataViewer'
import RadialVis from '../components/RadialVis'
import Ui from '../components/Ui'

import style from './MainApp.css'

/**
 * Topmost React Component
 */
class MainApp extends React.Component {

  componentDidMount() {
    const { dispatch, selectedSequence } = this.props
    dispatch(fetchSequenceIfNeeded(selectedSequence))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedSequence !== this.props.selectedSequence) {
      const { dispatch, selectedSequence } = nextProps
      dispatch(fetchSequenceIfNeeded(selectedSequence))
    }
  }

  render() {
    const { selectedSequence, ui,
            currentSequenceData, dispatch, visState } = this.props
    return (
      <div className={style.maxHeight}>
        {typeof currentSequenceData.aquaria !== 'undefined' &&
        <div className={style.visWrapper}>
          <RadialVis
            ui={ui}
            selectedSequence={selectedSequence}
            currentSequenceData={currentSequenceData}
            dispatch={dispatch}
            visState={visState}
          />
        </div>
        }
        <Ui
          selectedSequence={selectedSequence}
          currentSequenceData={currentSequenceData}
          dispatch={dispatch}
          visState={visState}
        />
        <DataViewer
          uniprot={currentSequenceData.uniprot}
          aquaria={currentSequenceData.aquaria}
          pdb={currentSequenceData.pdb}
          visState={visState}
        />
      </div>
    )
  }
}

MainApp.propTypes = {
  currentSequenceData: PropTypes.shape({
    aquaria: PropTypes.object.isRequired,
    didInvalidate: PropTypes.bool.isRequired,
    isFetchingAquaria: PropTypes.bool.isRequired,
    isFetchingPDB: PropTypes.bool.isRequired,
    isFetchingUniprot: PropTypes.bool.isRequired,
    pdb: PropTypes.string.isRequired,
    uniprot: PropTypes.object.isRequired,
  }),
  dispatch: PropTypes.func.isRequired,
  selectedSequence: PropTypes.string.isRequired,
  ui: PropTypes.object.isRequired,
  visState: PropTypes.object.isRequired,
}

MainApp.defaultProps = {
  currentSequenceData: {
    aquaria: {},
    pdb: '',
    uniprot: {},
    isFetchingAquaria: true,
    isFetchingPDB: true,
    isFetchingUniprot: true,
    didInvalidate: false,
  },
}

function mapStateToProps(state) {
  const { selectedSequence, dataBySequence, dataVisibility, ui, visState } = state
  const currentSequenceData = dataBySequence[selectedSequence]
  return {
    selectedSequence,
    currentSequenceData,
    dataVisibility,
    ui,
    visState,
  }
}

export default connect(mapStateToProps)(MainApp)
