import React from 'react'
import PropTypes from 'prop-types'

import style from './DataCheckerItem.css'

class DataCheckerItem extends React.Component {
  render() {
    const { isFetching, didInvalidate, didFail, name } = this.props
    return (
      <div>
        <span className={style.name} >{name}</span>
        {isFetching &&
          <span className={`${style.elem} ${style.loading}`}>
            Fetching...
          </span>
        }
        {didFail &&
          <span className={`${style.elem} ${style.error}`}>
            Fetching failed. Please refresh.
          </span>
        }
        {!didFail && !isFetching && !didInvalidate &&
          <span className={`${style.elem} ${style.success}`}>
            Ready.
          </span>
        }
      </div>
    )
  }
}

DataCheckerItem.propTypes = {
  name: PropTypes.string.isRequired,
  isFetching: PropTypes.bool.isRequired,
  didInvalidate: PropTypes.bool.isRequired,
  didFail: PropTypes.bool.isRequired,
}

export default DataCheckerItem
