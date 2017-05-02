import React from 'react'
import PropTypes from 'prop-types'
import style from './DataViewer.css'
import styl from './SortAxis.css'

class DataViewer extends React.Component {
  render() {
    const { visState, proteinData } = this.props
    return (
      <div className={styl.parent}>
        <div className={styl.title}>Currently Selected</div>
        <hr className={styl.hr} />
        {visState.selectedAxis && proteinData.features &&
          <p>
            {proteinData.features[visState.selectedAxis].name}
          </p>
        }
      </div>
    )
  }
}

DataViewer.propTypes = {
  visState: PropTypes.object.isRequired,
  proteinData: PropTypes.object.isRequired,
}

export default DataViewer
