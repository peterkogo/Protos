import React, { PropTypes } from 'react'

import style from './UI.css'

import Header from './Header'
import Selector from './Selector'
import DataChecker from './Datachecker'


/**
 * Container Component for managing UI
 * @param {props} props React props
 * @return {StatelessComponent} General UI without Visualization
 */
const Ui = (props) => {
  const { selectedSequence, dispatch, currentSequenceData } = props

  return (
    <div className={style.container}>
      <Header sequence={selectedSequence} />
      <Selector
        value={selectedSequence}
        options={['4qo1', '4hhb']}
        dispatch={dispatch}
      />
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
  )
}

Ui.propTypes = {
  currentSequenceData: PropTypes.object.isRequired,
  selectedSequence: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}
export default Ui
