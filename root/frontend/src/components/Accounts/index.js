import React from 'react'
import './accountStyles.css'
import axios from 'axios'

const labelStyles = {
  display: 'flex',
  width: '120px',
  justifyContent: 'end',
  fontSize: 'small'
}

export const handleGetSchwabData = async (accessToken, link, objectParams, setState) => {
  const params = JSON.stringify(objectParams)
  const isTrader = /accounts|orders|userPreferences/.test(link)
  const url =  `https://api.schwabapi.com/${isTrader ? 'trader' : 'marketdata'}/v1/${link}`
  await axios
    .get('https://127.0.0.1:8000/api/get_schwab_data/', { params: { accessToken, url, params }})
    .then(async (res) => setState(res.data))
    .catch((err) => console.log(err))
}

export const handlePostSchwabData = async (accessToken, link, objectParams, setState) => {
  const params = JSON.stringify(objectParams)
  const url = `https://api.schwabapi.com/trader/v1/${link}`
  await axios
    .get('https://127.0.0.1:8000/api/post_schwab_data/', { params: { accessToken, url, params }})
    .then(async (res) => setState(res.data))
    .catch((err) => console.log(err))
}

const sorter = (a, b) => (parseFloat(b.longOpenProfitLoss) / parseFloat(b.marketValue)) - (parseFloat(a.longOpenProfitLoss) / parseFloat(a.marketValue))

const PositionsDiplay = ({ type, positions, handleClick }) => {
  const total = positions.reduce((acc, { marketValue }) => (marketValue + acc), 0)
  const profit = positions.reduce((acc, { longOpenProfitLoss }) => (longOpenProfitLoss + acc), 0)
  return (
    <div style={{ margin: '24px' }}>
      <dt style={{ display: 'flex', justifyContent: 'start', borderBottom: '2px solid var(--dark)' }}>
        <h3 style={{ margin: 0 }}>{type}</h3>
      </dt>
      <dt style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: '1px solid var(--main)', paddingRight: '8px', paddingLeft: '8px' }}>
        <label style={{ fontSize: 'small', fontWeight: 'bold' }}>Symbol</label>
        <div style={{ display: 'flex' }}>
          <label style={{ ...labelStyles, fontWeight: 'bold' }}>Quantity(%)</label>
          <label style={{ ...labelStyles, fontWeight: 'bold' }}>Market Value($)</label>
          <label style={{ ...labelStyles, fontWeight: 'bold' }}>Profit Loss($)</label>
        </div>
      </dt>
      {positions.sort(sorter).map(({ longQuantity, marketValue, longOpenProfitLoss, instrument }, i) => {
        const { symbol = '', underlyingSymbol = '' } = instrument || {}
        return (
          <dt key={`${symbol}.${i}`} className='account-position' onClick={() => handleClick(symbol, longQuantity)}>
            <label style={{ fontSize: 'small' }}>{underlyingSymbol || symbol}</label>
            <div style={{ display: 'flex' }}>
              <label style={labelStyles}>{longQuantity}</label>
              <label style={labelStyles}>{`$${marketValue.toFixed(2)}`}</label>
              <label style={{ ...labelStyles, color: longOpenProfitLoss > 0 ? 'green' : longOpenProfitLoss < 0 ? 'red' : 'black' }}>
                {`${longOpenProfitLoss > 0 ? '+' : ''}${longOpenProfitLoss.toFixed(2)}`}
              </label>
            </div>
          </dt>
        )
      })}
      <dt style={{ display: 'flex', justifyContent: 'end', alignItems: 'baseline', fontSize: 'small', fontWeight: 'bold', paddingRight: '8px', paddingLeft: '8px' }}>
        <label>{'Total: '}</label>
        <label style={{ ...labelStyles, fontWeight: 'bold' }}>{`$${total.toFixed(2)}`}</label>
        <label style={{ ...labelStyles, fontWeight: 'bold', color: profit > 0 ? 'green' : profit < 0 ? 'red' : 'black' }}>{`${profit > 0 ? '+' : ''}${profit.toFixed(2)}`}</label>
      </dt>
    </div>
  )
}

const Account = ({ accountObject, handleTradeSymbol }) => {
  const { securitiesAccount = {} } = accountObject || {}
  const { positions = [] } = securitiesAccount || {}

  const handleStocksAndETFsClick = (symbol, longQuantity) => {
    handleTradeSymbol('Stocks/ETFs', { symbol, instruction: 'SELL', quantity: longQuantity })
  }

  const handleOptionsClick = (symbolString, longQuantity) => {
    const [symbol, order] = symbolString.split(/ .* /g)
    const strategy = order.includes('P') ? 'PUT' : 'CALL'
    const [dateString, priceString] = order.split(/[A-Z]/)
    const expirationDate = `20${dateString.substring(0, 2)}-${dateString.substring(2, 4)}-${dateString.substring(4, 6)}`
    const strike = (parseFloat(priceString) / 1000).toFixed(2)
    handleTradeSymbol('Options', { symbol, strategy, expirationDate, strike, instruction: 'SELL_TO_CLOSE', quantity: longQuantity })
  }

  const stocksAndETFs = positions && positions.length > 0 ? positions.filter(({ instrument: { symbol = '' } }) => !symbol.match(/\d/)) : []
  const options = positions && positions.length > 0 ? positions.filter(({ instrument: { symbol = '' } }) => symbol.match(/\d/)) : []

  return (
    <>
      <div className='account-toolbar'>
        <h3>Account</h3>
      </div>
      <dl style={{ width: '100%', margin: 0 }}>
        {stocksAndETFs && stocksAndETFs.length > 0 && <PositionsDiplay type='Stocks/ETFs' positions={stocksAndETFs} handleClick={handleStocksAndETFsClick} />}
        {options && options.length > 0 && <PositionsDiplay type='Options' positions={options} handleClick={handleOptionsClick} />}
      </dl>
    </>
  )
}

export default Account
