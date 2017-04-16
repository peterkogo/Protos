import React from 'react'
import PropTypes from 'prop-types'
import { selectSequence } from '../../actions/sequenceData'
import style from './Selector.css'

/**
 * Temporary selector for testing different sequences
 */
class Selector extends React.Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)

    this.state = {
      matchingStructInput: '',
      proteinInput: '',
    }
  }

  handleChange(e) {
    const name = e.target.name
    this.setState({
      [name]: e.target.value,
    })
  }

  handleSubmit(e) {
    e.preventDefault()
    const nextSequence = `${this.state.proteinInput}#${this.state.matchingStructInput}`
    this.props.dispatch(selectSequence(nextSequence))
  }

  render() {
    const { selectedSequence } = this.props
    const selSeq = selectedSequence.split('#')

    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <label
          htmlFor="proteinInput"
          className={style.label}
        >
          Protein
          <br />
          <input
            className={style.input}
            id="proteinInput"
            name="proteinInput"
            type="text"
            placeholder={selSeq[0]}
            value={this.state.proteinInput}
            onChange={e => this.handleChange(e)}
          />
        </label>
        <br />
        <label
          className={style.label}
          htmlFor="matchingStruct"
        >
          Matching Structure
                  </label>
          <br />
          <input
            className={style.input}
            id="matchingStructInput"
            name="matchingStructInput"
            type="text"
            placeholder={selSeq[1]}
            value={this.state.matchingStructInput}
            onChange={e => this.handleChange(e)}
          />
        <br />
        <button type="submit" className={style.button} >
          Show Protein
        </button>
      </form>
    )
  }
}

Selector.propTypes = {
  selectedSequence: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default Selector
