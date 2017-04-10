/**
 * React Static Boilerplate
 * https://github.com/kriasoft/react-static-boilerplate
 *
 * Copyright © 2015-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react'
// import Layout from '../../components/Layout';
// import s from './styles.css';
import { title } from './index.md'
import MainApp from '../../components/MainApp'


class HomePage extends React.Component {

  componentDidMount() {
    document.title = title
  }

  render() {
    return (
      <MainApp />
    )
  }

}

export default HomePage
