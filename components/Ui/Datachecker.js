import React from 'react'
import PropTypes from 'prop-types'

import style from './DataChecker.css'
import { fetchSequenceIfNeeded, invalidateSequenceData } from '../../actions/sequenceData'

import DataCheckerItem from './DataCheckerItem'


/**
 * DataChecker shows the status of fetched data
 * Currently of {Aquaria, PDB}
 * TODO Fix Refresh, Make Pure Components
 */
class DataChecker extends React.Component {
  constructor(props) {
    super(props)
    this.handleRefreshClick = this.handleRefreshClick.bind(this)
  }

  handleRefreshClick(e) {
    e.preventDefault()
    const { dispatch, selectedSequence } = this.props
    dispatch(invalidateSequenceData(selectedSequence))
    dispatch(fetchSequenceIfNeeded(selectedSequence))
  }

  render() {
    const { dataHealth } = this.props
    const { aquaria, uniprot, pdb } = dataHealth
    if (!aquaria) {
      return (<div />)
    }
    const failed = (aquaria.didFail || uniprot.didFail || pdb.didFail)
    const ready = ((!aquaria.isFetching && !aquaria.didFail && !aquaria.didInvalidate)
                    || (!uniprot.isFetching && !uniprot.didFail && !uniprot.didInvalidate)
                    || (!pdb.isFetching && !pdb.didFail && !pdb.didInvalidate))
    return (
      <div className={style.dataChecker}>
        {(failed || ready) && dataHealth.aquaria &&
          <a
            href="#"
            className={style.refresh}
            onClick={e => this.handleRefreshClick(e)}
          ><i className="material-icons">refresh</i></a>
        }
        <DataCheckerItem
          name="Aquaria"
          didFail={dataHealth.aquaria.didFail}
          isFetching={dataHealth.aquaria.isFetching}
          didInvalidate={dataHealth.aquaria.didInvalidate}
        />
        <DataCheckerItem
          name="PDB"
          didFail={dataHealth.pdb.didFail}
          isFetching={dataHealth.pdb.isFetching}
          didInvalidate={dataHealth.pdb.didInvalidate}
        />
        <DataCheckerItem
          name="Uniprot"
          didFail={dataHealth.uniprot.didFail}
          isFetching={dataHealth.uniprot.isFetching}
          didInvalidate={dataHealth.uniprot.didInvalidate}
        />
      </div>
    )
  }
}

DataChecker.propTypes = {
  dataHealth: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  selectedSequence: PropTypes.string.isRequired,
}

export default DataChecker
