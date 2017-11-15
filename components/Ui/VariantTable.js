import React from 'react'
import PropTypes from 'prop-types'
import ReactTable from 'react-table'
import style from './VariantTable.css'

const columns = [
  {
    Header: 'Gene',
    accessor: 'Gene',
  },
  {
    Header: 'Transcript',
    accessor: 'Transcript',
  },
  {
    Header: 'Impact',
    accessor: 'Impact',
  },
]

class VariantTable extends React.Component {

  render() {
    const { vcf, showTable, ui } = this.props
    return (
      <div
        className={style.container}
        style={{
          display: (showTable) ? 'initial' : 'none',
          pointerEvents: (showTable) ? 'initial' : 'none',
        }}
      >
        {vcf.length > 0 &&
          <ReactTable
            data={vcf}
            columns={columns}
            pivotBy={['Gene']}
            style={{ height: `${ui.windowHeight - 100}px` }}
          />
        }
      </div>
    )
  }
}

VariantTable.defaultProps = {
  vcf: [],
}

VariantTable.propTypes = {
  showTable: PropTypes.bool.isRequired,
  vcf: PropTypes.array,
  ui: PropTypes.object.isRequired,
}

export default VariantTable
