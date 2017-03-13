import React, { PropTypes } from 'react'
import { selectSequence } from '../../actions/sequenceData'

/**
 * Temporary selector for testing different sequences
 */
class Selector extends React.Component {

  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(nextSequence) {
    this.props.dispatch(selectSequence(nextSequence))
  }

  render() {
    const { value, options } = this.props

    return (
      <span>
        <select
          onChange={e => this.handleChange(e.target.value)}
          value={value}
        >
          {options.map(option =>
            <option value={option} key={option}>
              {option}
            </option>)
          }
        </select>
      </span>
    )
  }
}

Selector.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.string.isRequired,
  ).isRequired,
  value: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default Selector
