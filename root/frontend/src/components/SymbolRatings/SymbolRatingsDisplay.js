import React from 'react'
import { Modal } from '../StandardComponents'
import { sortByName } from '../../Utils'
import SymbolRatingGraphs from './SymbolRatingGraphs'

const symbolStyles = {
  display: 'flex',
  width: '120px',
  justifyContent: 'start',
  fontSize: 'small'
}

const labelStyles = {
  display: 'flex',
  width: '120px',
  justifyContent: 'end',
  fontSize: 'small'
}

const labelButtonStyles = {
  display: 'flex',
  width: '60px',
  justifyContent: 'end',
  fontSize: 'small',
  cursor: 'pointer'
}

const TableColumnHeader = ({ name, label, type, styles, sortByObject, setSortByObject }) => {
  const { sortName, order } = sortByObject || {}
  return (
    <label style={{ ...styles, fontWeight: 'bold' }} onClick={() => setSortByObject({ sortName: name, order: sortName === name ? order === 'asc' ? 'desc' : 'asc' : 'asc', type: type })}>
      {label}
      <div style={{ margin: order === 'desc' ? '-4px 0px 0px 4px' : '0px 0px -4px 4px', transform: order === 'desc' ? 'rotate(180deg)' : '' }}>{name === sortName ? '^' : ''}</div>
    </label>
  )
}

const SymbolRatingsDisplay = ({ data = [], handleTradeSymbol }) => {
  const [displayData, setDisplayData] = React.useState([])
  const [graphData, setGraphData] = React.useState({})
  const [openSymbolRatingGraph, setOpenSymbolRatingGraph] = React.useState('')
  const [sortByObject, setSortByObject] = React.useState({ sortName: 'rating', order: 'asc', type: 'number' })

  const { sortName, order, type } = sortByObject || {}

  const handleGraphClick = (e, symbol) => {
    e.stopPropagation()
    setOpenSymbolRatingGraph(symbol)
  }

  const mergeData = () => {
    const mergeDataObject = data && data.length > 0
      ? data.reduce((acc, { symbol, rating, aggregate }) => {
        const newAcc = { ...acc }
        newAcc[symbol] = symbol in newAcc
          ? { rating: parseInt(newAcc[symbol].rating) + parseInt(rating), aggregate: parseInt(newAcc[symbol].aggregate) + parseInt(aggregate) }
          : { rating: parseInt(rating), aggregate: parseInt(aggregate) }
        return newAcc
      }, {})
      : {}
    const mergeDataArray = Object.entries(mergeDataObject).map(([k, v]) => ({ symbol: k, ...v }))
    setDisplayData(mergeDataArray)
  }

  const formatData = () => {
    const newGraphData = data.reduce((acc, { date, symbol, rating, aggregate }) => {
      const newAcc = { ...acc }
      newAcc[date] = date in newAcc ? { ...acc[date] } : {}
      newAcc[date][symbol] = { rating, aggregate }
      return newAcc
    }, {})
    setGraphData(newGraphData)
  }

  React.useEffect(() => {
    mergeData()
    formatData()
  }, [data])

  return (
    <>
      <dl style={{ width: '100%', height: '100%', overflow: 'auto' }}>
        <dt style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--main)', paddingRight: '8px', paddingLeft: '8px' }}>
          <TableColumnHeader name='symbol' label='Symbol' type='string' styles={symbolStyles} sortByObject={sortByObject} setSortByObject={setSortByObject} />
          <div style={{ display: 'flex' }}>
            <div style={labelButtonStyles} />
            <TableColumnHeader name='rating' label='Rating' type='number' styles={labelStyles} sortByObject={sortByObject} setSortByObject={setSortByObject} />
            <TableColumnHeader name='aggregate' label='Aggregate' type='number' styles={labelStyles} sortByObject={sortByObject} setSortByObject={setSortByObject} />
          </div>
        </dt>
        {displayData && displayData.length > 0 && displayData.sort((a, b) => sortByName(order === 'asc' ? a : b, order === 'asc' ? b : a, sortName, type)).map(({ symbol, rating, aggregate }, i) => {
          return (
            <dt key={`${symbol}.${i}`} className='account-position' onClick={() => handleTradeSymbol('Stocks/ETFs', { symbol, instruction: 'BUY' })}>
              <label style={{ fontSize: 'small' }}>{symbol}</label>
              <div style={{ display: 'flex' }}>
                <label style={labelButtonStyles} onClick={(e) => handleGraphClick(e, symbol)}>- graph -</label>
                <label style={labelStyles}>{rating}</label>
                <label style={labelStyles}>{aggregate}</label>
              </div>
            </dt>
          )
        })}
      </dl>
       <Modal state={openSymbolRatingGraph} setState={setOpenSymbolRatingGraph} content={<SymbolRatingGraphs graphData={graphData} symbol={openSymbolRatingGraph} />} />
    </>
  )
}

export default SymbolRatingsDisplay
