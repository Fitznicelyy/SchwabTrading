import React from 'react'
import './symbolRatingsStyles.css'
import newsSentiment from './NewsSentiment'
import SymbolRatingsDisplay from './SymbolRatingsDisplay'

const getDate = (date) => {
  return date.toISOString().split('T')[0]
}

const SymbolRatings = ({ handleTradeSymbol }) => {

  const { handleLoadSymbolRatings, handleDeleteAllSymbolRatings, handleDateChange, data, loading } = newsSentiment()

  const handleStartDateChange = (value) => {
    const date = new Date(value)
    document.getElementById('endDate').value = getDate(date)
    handleDateChange()
  }

  React.useEffect(() => {
    const date = new Date(Date.now())
    document.getElementById('startDate').value = getDate(date)
    document.getElementById('endDate').value = getDate(date)
  }, [])

  return (
    <>
      <div style={{ display: 'flex', flexDirection: 'column', height: 'inherit', overflow: 'hidden' }}>
        <div className='account-toolbar'>
          <h3>Ratings</h3>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <input style={{ width: 'auto', borderRadius: '4px' }} type='date' id='startDate' onChange={(e) => handleStartDateChange(e.target.value)} />
                <label htmlFor='endDate' style={{ marginLeft: '8px', marginRight: '8px' }}>-</label>
                <input style={{ width: 'auto', borderRadius: '4px' }} type='date' id='endDate' onChange={handleDateChange} />
                <div style={{ display: 'flex', marginLeft: '8px' }}>
                  <button className='symbol-ratings-button' style={{ borderRadius: '4px 0px 0px 4px' }} onClick={handleLoadSymbolRatings}>load</button>
                  <button className='symbol-ratings-button' style={{ borderRadius: '0px 4px 4px 0px' }} onClick={handleDeleteAllSymbolRatings}>clear</button>
                </div>
              </div>
            </div>
            {loading && <div style={{ display: 'flex', justifyContent: 'flex-end' }}>Loading ...</div>}
          </div>
        </div>
        {data && data.length > 0 && <SymbolRatingsDisplay data={data} handleTradeSymbol={handleTradeSymbol} />}
      </div>
    </>
  )
}

export default SymbolRatings
