import React from 'react'
import PropTypes from 'prop-types'

import style from './UI.css'

import Header from './Header'
import Selector from './Selector'
import DataChecker from './DataChecker'
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
            dataHealth={currentSequenceData.proteinDataHealth}
            dispatch={dispatch}
            selectedSequence={selectedSequence}
          />
        </div>
      </div>
      {currentSequenceData.uniprot.data && visState.order &&
        <div className={style.right}>
          <SortAxis
            visState={visState}
            features={currentSequenceData.proteinData.features}
            dispatch={dispatch}
            selectedSequence={selectedSequence}
          />
          <DataViewer
            visState={currentSequenceData.visState}
            proteinData={currentSequenceData.proteinData}
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
