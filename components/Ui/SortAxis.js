import React from 'react'
import PropTypes from 'prop-types'

import SortAxisElem from './SortAxisElem'
import style from './SortAxis.css'

class SortAxis extends React.Component {
  render() {
    const { visState, features, dispatch, selectedSequence } = this.props
    const order = visState.order.slice().reverse()

    return (
      <div className={style.parent}>
        <div className={style.title}>
          Lane Order
        </div>
        <hr className={style.hr} />
        {order.map((elem, i, arr) => {
          return (
            <SortAxisElem
              name={features[elem].name}
              active={(elem === visState.selectedAxis)}
              key={elem}
              id={elem}
              pos={i}
              lastPos={arr.length - 1}
              dispatch={dispatch}
              selectedSequence={selectedSequence}
            />
          )
        })}
      </div>
    )
  }
}

SortAxis.propTypes = {
  visState: PropTypes.object.isRequired,
  features: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  selectedSequence: PropTypes.string.isRequired,
}

export default SortAxis
