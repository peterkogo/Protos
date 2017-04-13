import React, { PropTypes } from 'react'
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
      inputMapping: '',
      inputProtein: '',
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
    const nextSequence = `${this.state.inputProtein}#${this.state.inputMapping}`
    this.props.dispatch(selectSequence(nextSequence))
  }

  render() {
    const { selectedSequence } = this.props
    const selSeq = selectedSequence.split('#')

    return (
      <form onSubmit={e => this.handleSubmit(e)}>
        <label
          htmlFor="inputProtein"
          className={style.label}
        >
          Protein
          <br />
          <input
            className={style.input}
            id="inputProtein"
            name="inputProtein"
            type="text"
            placeholder={selSeq[0]}
            value={this.state.inputProtein}
            onChange={e => this.handleChange(e)}
          />
        </label>
        <br />
        <label
          className={style.label}
          htmlFor="inputMapping"
        >
          Mapping
          <br />
          <input
            className={style.input}
            id="inputMapping"
            name="inputMapping"
            type="text"
            placeholder={selSeq[1]}
            value={this.state.inputMapping}
            onChange={e => this.handleChange(e)}
          />
        </label>
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
