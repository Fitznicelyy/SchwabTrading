import React from 'react'
import { sortByName } from '../../Utils'

const TableColumnHeader = ({ name, sortBy, setSortBy }) => {
  const label = name.charAt(0).toUpperCase() + name.slice(1)
  const { sortName, order, type } = sortBy || {}
  return (
    <th style={{ display: '33%%', padding: '0px' }}>
      <button style={{ width: '100%', border: '0px', cursor: 'pointer' }} onClick={() => setSortBy({ sortName: name, order: sortName === name ? order === 'asc' ? 'desc' : 'asc' : 'asc', type: type })}>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', alignItems: 'center' }}>
          {label}
          <div style={{ width: '20px', margin: order === 'desc' ? '-4px 0px 0px 4px' : '0px 0px -4px 4px', transform: order === 'desc' ? 'rotate(180deg)' : '' }}>{name === sortName ? '^' : ''}</div>
        </div>
      </button>
    </th>
  )
}

const TableDisplay = ({ data = [] }) => {
  const [sortBy, setSortBy] = React.useState([])

  const { sortName, order, type } = sortBy || {}

  const displayData = sortName ? data.sort((a, b) => sortByName(order === 'asc' ? a : b, order === 'asc' ? b : a, sortName, type)) : data

  React.useEffect(() => {
    if (data && data.length > 0) {
      const [key, value] = Object.entries(data[0])[0]
      setSortBy({ sortName: key, order: 'asc', type: typeof value })
    } else {
      setSortBy({})
    }
  }, [data])

  return (
    <table style={{ width: '100%' }}>
      <thead>
        <tr>
          {displayData && displayData.length > 0 && Object.keys(displayData[0]).map((name) => <TableColumnHeader key={name} name={name} sortBy={sortBy} setSortBy={setSortBy} />)}
        </tr>
      </thead>
      <tbody>
        {displayData && displayData.length > 0 && displayData.map((object, index) => (
          <tr key={index}>
            {Object.entries(object).map(([k, v]) => <td key={k} style={{ textAlign: 'center', fontSize: 'x-small' }}>{v}</td>)}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default TableDisplay
