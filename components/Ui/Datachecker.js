import React, { PropTypes } from 'react'

import style from './DataChecker.css'
import { fetchSequenceIfNeeded, invalidateSequenceData } from '../../actions/sequenceData'


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
    const { isFetchingAquaria,
            isFailedAquaria,
            lastUpdatedAquaria,
            isFetchingPDB,
            isFailedPDB,
            lastUpdatedPDB,
            isFetchingUniprot,
            isFailedUniprot,
            lastUpdatedUniprot,
             } = this.props
    return (
      <div className={style.dataChecker}>
        <p>
          {isFetchingAquaria && <span> <b>Aquaria:</b> Loading </span>}
          {!isFetchingAquaria && lastUpdatedAquaria &&
            <span><b>Aquaria:</b> Received at {
              new Date(lastUpdatedAquaria).toLocaleTimeString()
            } </span>
          }
          {isFailedAquaria &&
            <span><b>Aquaria:</b> Failed </span>
          }
        </p>
        <p>
          {isFetchingPDB && <span> <b>PDB:</b> Loading </span>}
          {!isFetchingPDB && lastUpdatedPDB &&
            <span><b>PDB:</b> Received at {new Date(lastUpdatedPDB).toLocaleTimeString()} </span>
          }
          {isFailedPDB &&
            <span><b>PDB:</b> Failed </span>
          }
        </p>
        <p>
          {isFetchingUniprot && <span> <b>Uniprot:</b> Loading </span>}
          {!isFetchingUniprot && lastUpdatedUniprot &&
            <span><b>Uniprot:</b> Received at {
              new Date(lastUpdatedUniprot).toLocaleTimeString()
            } </span>
          }
          {isFailedUniprot &&
            <span><b>Uniprot:</b> Failed </span>
          }
        </p>
        <p>
          {!isFetchingAquaria && !isFetchingPDB && !isFetchingUniprot &&
            <a
              href="#"
              onClick={this.handleRefreshClick}
            >
              Refresh
            </a>
          }
        </p>
      </div>
    )
  }
}

DataChecker.propTypes = {
  isFetchingPDB: PropTypes.bool.isRequired,
  isFailedPDB: PropTypes.bool,
  lastUpdatedPDB: PropTypes.number,
  isFetchingAquaria: PropTypes.bool,
  isFailedAquaria: PropTypes.bool,
  lastUpdatedAquaria: PropTypes.number,
  isFetchingUniprot: PropTypes.bool.isRequired,
  isFailedUniprot: PropTypes.bool,
  lastUpdatedUniprot: PropTypes.number,
  dispatch: PropTypes.func.isRequired,
  selectedSequence: PropTypes.string.isRequired,
}

export default DataChecker
