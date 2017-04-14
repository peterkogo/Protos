import React, { PropTypes } from 'react'

import style from './UI.css'

import Header from './Header'
import Selector from './Selector'
import DataChecker from './Datachecker'
import DataViewer from './DataViewer'
import SortAxis from './SortAxis'


/**
 * Container Component for managing UI
 * @param {props} props React props
 * @return {StatelessComponent} General UI without Visualization
 */
const Ui = (props) => {
  const { selectedSequence, dispatch, currentSequenceData, visState } = props

  return (
    <div className={style.container}>
      <div className={style.left}>
        <Header sequence={selectedSequence} />
        <Selector
          selectedSequence={selectedSequence}
          dispatch={dispatch}
        />
        <div className={style.bottom}>
          <DataChecker
            isFetchingPDB={currentSequenceData.isFetchingPDB}
            isFailedPDB={currentSequenceData.isFailedPDB}
            lastUpdatedPDB={currentSequenceData.lastUpdatedPDB}
            isFetchingAquaria={currentSequenceData.isFetchingAquaria}
            isFailedAquaria={currentSequenceData.isFailedAquaria}
            lastUpdatedAquaria={currentSequenceData.lastUpdatedAquaria}
            isFetchingUniprot={currentSequenceData.isFetchingUniprot}
            isFailedUniprot={currentSequenceData.isFailedUniprot}
            lastUpdatedUniprot={currentSequenceData.lastUpdatedUniprot}
            dispatch={dispatch}
            selectedSequence={selectedSequence}
          />
        </div>
      </div>
      {currentSequenceData.uniprot.data && visState.order &&
        <div className={style.right}>
          <SortAxis
            visState={visState}
            uniprot={currentSequenceData.uniprot}
            dispatch={dispatch}
          />
          <DataViewer
            uniprot={currentSequenceData.uniprot}
            aquaria={currentSequenceData.aquaria}
            pdb={currentSequenceData.pdb}
            visState={visState}
            dispatch={dispatch}
          />
        </div>
      }
    </div>
  )
}

Ui.propTypes = {
  currentSequenceData: PropTypes.object.isRequired,
  selectedSequence: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
  visState: PropTypes.object.isRequired,
}
export default Ui
