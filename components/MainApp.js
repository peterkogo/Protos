import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchSequenceIfNeeded } from '../actions/sequenceData'

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
    const { selectedSequence, ui, currentSequenceData, dispatch } = this.props
    return (
      <div className={style.maxHeight}>
        {typeof currentSequenceData.proteinData !== 'undefined' &&
          typeof currentSequenceData.proteinData.features !== 'undefined' &&
          typeof currentSequenceData.visState !== 'undefined' &&
          <div className={style.visWrapper}>
            <RadialVis
              ui={ui}
              selectedSequence={selectedSequence}
              dispatch={dispatch}
              visState={currentSequenceData.visState}
              proteinData={currentSequenceData.proteinData}
              proteinDataHealth={currentSequenceData.proteinDataHealth}
              variants={currentSequenceData.variants}
            />
          </div>
        }
        { typeof currentSequenceData.proteinData !== 'undefined' &&
        typeof currentSequenceData.proteinData.features !== 'undefined' &&
          typeof currentSequenceData.visState !== 'undefined' &&
          typeof currentSequenceData.visState.order !== 'undefined' &&
          <Ui
            selectedSequence={selectedSequence}
            currentSequenceData={currentSequenceData}
            dispatch={dispatch}
            visState={currentSequenceData.visState}
          />
        }
      </div>
    )
  }
}

MainApp.propTypes = {
  currentSequenceData: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  selectedSequence: PropTypes.string.isRequired,
  ui: PropTypes.object.isRequired,
}

MainApp.defaultProps = {
  currentSequenceData: {
    variants: {
      name1: {
        pos: 116,
        type: 'stop',
        known: false,
        knownType: {},
        refAA: 'S',
        varAA: 'T',
        class: 'uncharged?',
      },
    },
  },
}

function mapStateToProps(state) {
  const { selectedSequence, dataBySequence, ui } = state
  const currentSequenceData = dataBySequence[selectedSequence]
  return {
    selectedSequence,
    currentSequenceData,
    ui,
  }
}

export default connect(mapStateToProps)(MainApp)
