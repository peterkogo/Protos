import React, { PropTypes } from 'react'

import { changeAxisPosFromTo } from '../../actions/radialVis'
import style from './SortAxis.css'

class SortAxisElem extends React.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(e, up) {
    if (up) {
      if (this.props) {
        this.props.dispatch(changeAxisPosFromTo(this.props.pos, this.props.pos - 1))
      }
    } else {
      this.props.dispatch(changeAxisPosFromTo(this.props.pos, this.props.pos + 1))
    }
  }

  render() {
    const { name, pos } = this.props

    return (
      <div className={style.elem}>
        {this.props.pos !== 0 &&
          <button
            className={style.button}
            onClick={(e) => { this.handleClick(e, true) }}
          />
        }
        {name}
        <button
          className={style.button}
          onClick={(e) => { this.handleClick(e, false) }}
        />
      </div>
    )
  }
}

SortAxisElem.propTypes = {
  name: PropTypes.string.isRequired,
  pos: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
}

export default SortAxisElem
