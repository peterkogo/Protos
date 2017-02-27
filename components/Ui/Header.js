import React, { PropTypes } from 'react'
import style from './Header.css'

/**
 * @param {props} props React props
 * @return {StatelessComponent} Title with selected sequence
 */
const Header = (props) =>
  <div className={style.title}>
    <h1>{props.sequence}</h1>
  </div>

Header.propTypes = {
  sequence: PropTypes.string.isRequired,
}

export default Header
