import React, { PropTypes } from 'react'

import { changeAxisPosFromTo, selectAxis, deselectAxis } from '../../actions/radialVis'
import style from './SortAxis.css'

class SortAxisElem extends React.Component {
  constructor() {
    super()
    this.handleUpDown = this.handleUpDown.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  handleUpDown(e, up) {
    if (up) {
      if (this.props) {
        this.props.dispatch(changeAxisPosFromTo(this.props.pos, this.props.pos - 1))
      }
    } else {
      this.props.dispatch(changeAxisPosFromTo(this.props.pos, this.props.pos + 1))
    }
  }

  handleClick(e) {
    e.preventDefault()
    if (this.props.active) {
      this.props.dispatch(deselectAxis())
    } else {
      this.props.dispatch(deselectAxis())
      this.props.dispatch(selectAxis(this.props.id))
    }
  }

  render() {
    const { name, pos, lastPos, active } = this.props
    const styleButtonUp = (pos === 0) ? { visibility: 'hidden' } : {}
    const styleButtonDown = (pos === lastPos) ? { visibility: 'hidden' } : {}
    const bold = (active) ? { fontWeight: 700 } : {}

    return (
      <div className={style.elem} >
        <button
          className={style.button}
          onClick={(e) => { this.handleUpDown(e, true) }}
          style={styleButtonUp}
        >
          <i className={style.icons}>keyboard_arrow_up</i>
        </button>
        <button
          className={style.button}
          onClick={(e) => { this.handleUpDown(e, false) }}
          style={styleButtonDown}
        >
          <i className={style.icons}>keyboard_arrow_down</i>
        </button>
        <a style={bold} onClick={(e => this.handleClick(e))}>
          {name}
        </a>
      </div>
    )
  }
}

SortAxisElem.propTypes = {
  name: PropTypes.string.isRequired,
  pos: PropTypes.number.isRequired,
  lastPos: PropTypes.number.isRequired,
  dispatch: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
}

export default SortAxisElem
