import React from 'react'
import PropTypes from 'prop-types'
import style from './SortAxis.css'

class DataViewer extends React.Component {
  render() {
    const { visState, proteinData } = this.props
    return (
      <div className={style.parent}>
        <div className={style.title}>Currently Selected</div>
        <hr className={style.hr} />
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
