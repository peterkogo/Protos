import React, { PropTypes } from 'react'
import style from './DataViewer.css'

/**
 * @param {props} props React props
 * @return {StatelessComponent}  Essentialy a fast Viewer for the Received DataViewer
 * TODO Either delete or make it useful
 */
const DataViewer = (props) =>
  <div className={`${style.dataViewerWrapper}`}>
    <div
      className={(`${style.dataViewerContent}`,
                  (props.dataVisibility) ? `${style.visible}` : `${style.invisible}`)}
    >
      <div>{JSON.stringify(props.aquaria, undefined, 4)}</div>
    </div>
  </div>

DataViewer.propTypes = {
  aquaria: PropTypes.object,
  pdb: PropTypes.string,
  dataVisibility: PropTypes.bool.isRequired,
}

export default DataViewer
