import React, { PropTypes } from 'react'

import SortAxisElem from './SortAxisElem'
import style from './SortAxis.css'

class SortAxis extends React.Component {
  render() {
    const { visState, uniprot, dispatch } = this.props
    const order = visState.order.slice().reverse()

    return (
      <div className={style.parent}>
        {order.map((elem, i) => {
          return (
            <SortAxisElem
              name={uniprot.data[elem].name}
              key={elem}
              id={elem}
              pos={i}
              dispatch={dispatch}
            />
          )
        })}
      </div>
    )
  }
}

SortAxis.propTypes = {
  visState: PropTypes.object.isRequired,
  uniprot: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default SortAxis
