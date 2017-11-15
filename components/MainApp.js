import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { fetchSequenceIfNeeded } from '../actions/sequenceData'

import RadialVis from '../components/RadialVis'
import Ui from '../components/Ui'

import { queriesToString, isValidSequence } from './Defaults'

import style from './MainApp.css'

/**
 * Main Application Entry Point
 */
class MainApp extends React.Component {

  componentDidMount() {
    const { dispatch, router } = this.props
    if (isValidSequence(router.queries)) {
      dispatch(fetchSequenceIfNeeded(queriesToString(router.queries)))
    }
  }

  componentWillReceiveProps(nextProps) {
    if (isValidSequence(nextProps.router.queries)) {
      const thisSequence = queriesToString(this.props.router.queries)
      const nextSequence = queriesToString(nextProps.router.queries)
      if (thisSequence !== nextSequence) {
        const { dispatch } = nextProps
        dispatch(fetchSequenceIfNeeded(nextSequence))
      }
    }
  }

  render() {
    const { ui, currentSequenceData, dispatch, router } = this.props
    const selectedSequence = queriesToString(router.queries)
    return (
      <div className={style.maxHeight}>
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
        <Ui
          selectedSequence={selectedSequence}
          currentSequenceData={currentSequenceData}
          dispatch={dispatch}
          visState={currentSequenceData.visState}
          proteinData={currentSequenceData.proteinData}
          ui={ui}
        />
      </div>
    )
  }
}

MainApp.propTypes = {
  currentSequenceData: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  selectedSequence: PropTypes.string.isRequired,
  ui: PropTypes.object.isRequired,
  router: PropTypes.object.isRequired,
}

MainApp.defaultProps = {
  currentSequenceData: {
    proteinDataHealth: {
      vcf: {
        loading: false,
        loaded: false,
      },
    },
  },
}

function mapStateToProps(state) {
  const { selectedSequence, dataBySequence, ui, router } = state
  const currentSequenceData = dataBySequence[queriesToString(router.queries)]
  return {
    selectedSequence,
    currentSequenceData,
    ui,
    router,
  }
}

export default connect(mapStateToProps)(MainApp)
