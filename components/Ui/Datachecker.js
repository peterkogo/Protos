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
          {isFetchingAquaria && <span> Aquaria: Loading </span>}
          {!isFetchingAquaria && lastUpdatedAquaria &&
            <span>Aquaria: Received at {new Date(lastUpdatedAquaria).toLocaleTimeString()} </span>
          }
          {isFailedAquaria &&
            <span>Aquaria: Failed </span>
          }
        </p>
        <p>
          {isFetchingPDB && <span> PDB: Loading </span>}
          {!isFetchingPDB && lastUpdatedPDB &&
            <span>PDB: Received at {new Date(lastUpdatedPDB).toLocaleTimeString()} </span>
          }
          {isFailedPDB &&
            <span>PDB: Failed </span>
          }
        </p>
        <p>
          {isFetchingUniprot && <span> Uniprot: Loading </span>}
          {!isFetchingUniprot && lastUpdatedUniprot &&
            <span>Uniprot: Received at {new Date(lastUpdatedUniprot).toLocaleTimeString()} </span>
          }
          {isFailedUniprot &&
            <span>Uniprot: Failed </span>
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
