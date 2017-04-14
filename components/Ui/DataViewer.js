import React from 'react'
import PropTypes from 'prop-types'
import style from './DataViewer.css'

class DataViewer extends React.Component {
  render() {
    return (
      <div className={style.dataViewerWrapper}>
        <p className={style.header}>Currently Selected:</p>
        {this.props.visState.selectedAxis && this.props.uniprot.data &&
          <p>
            {this.props.uniprot.data[this.props.visState.selectedAxis].name}
          </p>
        }
      </div>
    )
  }
}

DataViewer.propTypes = {
  aquaria: PropTypes.object.isRequired,
  pdb: PropTypes.string.isRequired,
  uniprot: PropTypes.object.isRequired,
  visState: PropTypes.object.isRequired,
}

export default DataViewer
