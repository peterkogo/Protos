import React, { PropTypes } from 'react'
import { connect } from 'react-redux'

import { fetchSequenceIfNeeded } from '../actions/sequenceData'

import DataViewer from '../components/DataViewer'
import Vis from '../components/Vis'
import Ui from '../components/Ui'

import style from './AsyncApp.css'

/**
 * Topmost React Component
 */
class AsyncApp extends React.Component {

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
    const { selectedSequence, dataVisibility, ui, currentSequenceData, dispatch } = this.props
    return (
      <div className={style.maxHeight}>
      {typeof currentSequenceData.aquaria !== 'undefined' &&
        <div className={style.visWrapper}>
          <Vis
            currentSequenceData={currentSequenceData}
            selectedSequence={selectedSequence}
            ui={ui}
          />
        </div>
        }
        <Ui
          selectedSequence={selectedSequence}
          currentSequenceData={currentSequenceData}
          dispatch={dispatch}
        />
        <DataViewer
          dataVisibility={dataVisibility}
          aquaria={currentSequenceData.aquaria}
          pdb={currentSequenceData.pdb}
        />
      </div>
    )
  }
}

AsyncApp.propTypes = {
  selectedSequence: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  ui: PropTypes.object.isRequired,
  dataVisibility: PropTypes.bool.isRequired,
  currentSequenceData: PropTypes.shape({
    aquaria: PropTypes.object.isRequired,
    pdb: PropTypes.string.isRequired,
    uniprot: PropTypes.string.isRequired,
    isFetchingAquaria: PropTypes.bool.isRequired,
    isFetchingPDB: PropTypes.bool.isRequired,
    isFetchingUniprot: PropTypes.bool.isRequired,
  }),
}

function mapStateToProps(state) {
  const { selectedSequence, dataBySequence, dataVisibility, ui } = state
  const currentSequenceData = dataBySequence[selectedSequence] || {
    isFetchingAquaria: true,
    isFetchingPDB: true,
    isFetchingUniprot: true,
    aquaria: {},
    pdb: '',
    uniprot: '',
  }
  return {
    selectedSequence,
    currentSequenceData,
    dataVisibility,
    ui,
  }
}

export default connect(mapStateToProps)(AsyncApp)
