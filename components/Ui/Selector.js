import React from 'react'
import PropTypes from 'prop-types'
import { selectSequence, setVariants } from '../../actions/sequenceData'
import style from './Selector.css'

/**
 * Temporary selector for testing different sequences
 */
class Selector extends React.Component {

  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleFileSelect = this.handleFileSelect.bind(this)

    this.state = {
      matchingStructInput: '',
      proteinInput: '',
      chainInput: '',
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
    const { selectedSequence } = this.props
    const selSeq = selectedSequence.split('#')
    let protein = this.state.proteinInput.trim()
    let structure = this.state.matchingStructInput.trim()
    let chain = this.state.chainInput.trim()

    if (protein === '') {
      protein = selSeq[0]
    }

    if (structure === '') {
      structure = selSeq[1]
    }

    if (chain === '') {
      chain = selSeq[2]
    }

    const nextSequence = `${protein}#${structure}#${chain}`
    this.props.dispatch(selectSequence(nextSequence))
  }

  handleFileSelect(e) {
    const { dispatch, selectedSequence } = this.props
    const reader = new FileReader()
    reader.onload = ((x) => {
      const json = JSON.parse(x.currentTarget.result)
      dispatch(setVariants(selectedSequence, json))
    })
    reader.readAsText(this.fileInput.files[0])
  }

  render() {
    const { selectedSequence } = this.props
    const selSeq = selectedSequence.split('#')

    return (
      <div>
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
          <label
            className={style.label}
            htmlFor="chain"
          >
            Chain
                    </label>
          <br />
          <input
            className={style.input}
            id="chainInput"
            name="chainInput"
            type="text"
            placeholder={selSeq[2]}
            value={this.state.chainInput}
            onChange={e => this.handleChange(e)}
          />
          <br />
          <button type="submit" className={style.button} >
            Show Protein
          </button>
        </form>
        <br />
        <label
          htmlFor="proteinInput"
          className={style.label}
        >
        Variants
        <input
          type="file"
          id="fileInput"
          name="files[]"
          onChange={e => this.handleFileSelect(e)}
          ref={(c) => { this.fileInput = c }}
        />
        </label>
      </div>
    )
  }
}

Selector.propTypes = {
  selectedSequence: PropTypes.string.isRequired,
  dispatch: PropTypes.func.isRequired,
}

export default Selector
