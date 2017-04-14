import React from 'react'
import PropTypes from 'prop-types'
import style from './Header.css'

/**
 * @param {props} props React props
 * @return {StatelessComponent} Title with selected sequence
 */
const Header = (props) => {
  const seq = props.sequence.split('#')
  return (
    <div className={style.title}>
      <h1>{seq[0]}</h1>
      <h2>{seq[1]}</h2>
    </div>
  )
}

Header.propTypes = {
  sequence: PropTypes.string.isRequired,
}

export default Header
