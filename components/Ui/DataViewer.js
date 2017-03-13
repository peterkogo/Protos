import React, { PropTypes } from 'react'
import style from './DataViewer.css'

class DataViewer extends React.Component {
  render() {
    return (
      <div className={style.dataViewerWrapper}>
        <p className={style.header}>Currently Selected:</p>
        {this.props.visState.selected && this.props.uniprot.data &&
          <p>
            {this.props.uniprot.data[this.props.visState.selected].name}
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
