import React from 'react'
import { handlePostSchwabData } from '../Accounts'
import { InputDisplay } from '../StandardComponents'

const orderSkeleton = {
  session: 'NORMAL',
  duration: 'DAY',
  orderStrategyType: 'SINGLE',
  orderLegCollection: [
    {
      instrument: {
        assetType: 'EQUITY'
      }
    }
  ]
}

const initialOrderValuesObject = {
  orderType: 'MARKET',
  price: 0,
  instruction: 'BUY',
  quantity: 1,
  symbol: ''
}

const ValueDisplay = ({ label, value, units }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <label style={{ width: '60px', fontSize: 'small', fontWeight: 'bold' }}>{label}</label>
      <div style={{ display: 'flex', width: '100px', justifyContent: 'space-between' }}>
        <label style={{ fontSize: 'small' }}>{value}</label>
        {units && <label style={{ fontSize: 'small' }}>{units}</label>}
      </div>
    </div>
  )
}

const SymbolBlock = ({ quoteObject, orderValuesObject, handleModalChange, symbolChangeHandler }) => {
  const { symbol } = orderValuesObject || {}
  const { reference = {}, quote = {}, regular = {} } = quoteObject || {}
  const { description = '' } = reference || {}
  const { regularMarketLastPrice = 0 } = regular || {}
  const { lastMICId, bidPrice, bidSize, bidMICId, askPrice, askSize, askMICId, totalVolume } = quote || {}
  return (
    <div style={{ display: 'flex', dlexDirection: 'row', width: '100%', height: '80px', borderBottom: '1px solid grey', alignItems: 'center' }}>
      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
        <div className='trade-input-container'>
          <InputDisplay value={symbol} handleChange={(v) => symbolChangeHandler('symbol', v)} />
          <label className='trade-input-label'>symbol</label>
        </div>
        {quoteObject && Object.keys(quoteObject).length > 0 && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '0px 40px' }}>
              <label>{description}</label>
              <div style={{ display: 'flex', width: '100px', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <h3 style={{ margin: 0 }}>{regularMarketLastPrice.toFixed(2)}</h3>
                <label style={{ fontSize: 'small' }}>{lastMICId}</label>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '0px 40px' }}>
              <ValueDisplay label='Bid/Size' value={`${bidPrice.toFixed(2)}/${bidSize}`} units={bidMICId} />
              <ValueDisplay label='Ask/Size' value={`${askPrice.toFixed(2)}/${askSize}`} units={askMICId} />
              <ValueDisplay label='Volume' value={totalVolume.toLocaleString()} />
            </div>
          </>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '10px' }}>
        <button style={{ border: '1px solid var(--dark)' }} className='trade-button-unselected' onClick={() => handleModalChange('priceHistory')}>Price History</button>
      </div>
    </div>
  )
}

const DetailsBlock = ({ orderValuesObject, amountUnits, handleUpdate, setAmountUnits }) => {
  const { orderType, price, instruction, quantity } = orderValuesObject || {}
  return (
    <div style={{ display: 'flex', width: '100%', height: '80px', borderBottom: '1px solid grey', alignItems: 'center' }}>
      <div className='trade-button-container'>
        <button className={instruction === 'BUY' ? 'trade-button-selected' : 'trade-button-unselected'} onClick={() => handleUpdate('instruction', 'BUY')}>Buy</button>
        <button className={instruction === 'SELL' ? 'trade-button-selected' : 'trade-button-unselected'} onClick={() => handleUpdate('instruction', 'SELL')}>Sell</button>
      </div>
      <div className='trade-button-container'>
        <button className={amountUnits === 'shares' ? 'trade-button-selected' : 'trade-button-unselected'} onClick={() => setAmountUnits('shares')}>Shares</button>
        <button
          disabled={orderType === 'LIMIT'}
          style={{ opacity: orderType === 'LIMIT' ? 0.5 : null, cursor: orderType === 'LIMIT' ? 'initial' : null }}
          className={amountUnits === 'dollars' ? 'trade-button-selected' : 'trade-button-unselected'}
          onClick={() => setAmountUnits('dollars')}
        >
          Dollars
        </button>
      </div>
      <div className='trade-input-container'>
        <InputDisplay value={quantity} type='number' handleChange={(v) => handleUpdate('quantity', v)} />
        <label className='trade-input-label'>amount</label>
      </div>
      <div className='trade-button-container'>
        <button className={orderType === 'MARKET' ? 'trade-button-selected' : 'trade-button-unselected'} onClick={() => handleUpdate('orderType', 'MARKET')}>Market</button>
        <button
          disabled={amountUnits === 'dollars'}
          style={{ opacity: amountUnits === 'dollars' ? 0.5 : null, cursor: amountUnits === 'dollars' ? 'initial' : null }}
          className={orderType === 'LIMIT' ? 'trade-button-selected' : 'trade-button-unselected'}
          onClick={() => handleUpdate('orderType', 'LIMIT')}
        >
          Limit
        </button>
      </div>
      {orderType === 'LIMIT' && (
        <div className='trade-input-container'>
          <InputDisplay value={price} type='number' handleChange={(v) => handleUpdate('price', v)} />
          <label className='trade-input-label'>price</label>
        </div>)}
    </div>
  )
}

const StockOrder = ({
  accountNumbers,
  accountNumber,
  defaultOrderObject,
  quoteObject,
  setPostResult,
  handleSymbolChange,
  tokenObject,
  setOpenModal
}) => {
  const [amountUnits, setAmountUnits] = React.useState('shares')
  const [orderValuesObject, setOrderValuesObject] = React.useState(initialOrderValuesObject)

  const { orderType, price, instruction, quantity, symbol } = orderValuesObject || {}
  const { regular = {} } = quoteObject || {}
  const { regularMarketLastPrice = 0 } = regular || {}

  const totalOrderPrice = quantity * (orderType === 'LIMIT' ? price : amountUnits === 'shares' ? regularMarketLastPrice : 1)

  const handleUpdate = (name, value) => {
    const newOrderValuesObject = { ...orderValuesObject }
    newOrderValuesObject[name] = value
    setOrderValuesObject(newOrderValuesObject)
  }

  const handlePlaceOrder = async (orderObject) => {
    const { access_token = '' } = tokenObject || {}
    if (!access_token) return
    if (accountNumber) {
      const { hashValue = '' } = accountNumbers.find(({ accountNumber: acctNum }) => acctNum === accountNumber) || {}
      if (hashValue) await handlePostSchwabData(access_token, `/accounts/${hashValue}/orders`, orderObject, setPostResult)
    }
  }

  const submitOrder = async () => {
    const orderObject = { ...orderSkeleton }
    orderObject.orderType = orderType
    const newOrderLegCollection = { ...orderObject.orderLegCollection[0] }
    const newInstrument = { ...newOrderLegCollection.instrument }
    newInstrument.symbol = symbol.toUpperCase()
    newOrderLegCollection.instrument = newInstrument
    newOrderLegCollection.instruction = instruction
    newOrderLegCollection.quantity = amountUnits === 'shares' ? quantity : quantity.toFixed(2)
    newOrderLegCollection.quantityType = amountUnits === 'shares' ? 'SHARES' : 'DOLLARS'
    if (orderType === 'LIMIT') orderObject.price = price
    orderObject.orderLegCollection = [newOrderLegCollection]
    await handlePlaceOrder(orderObject)
  }

  const handleSubmitOrder = async () => {
    if (window.confirm('Are you sure you want to place the order?')) submitOrder()
  }

  const symbolChangeHandler = (name, value) => {
    handleSymbolChange(value)
    handleUpdate(name, value)
  }

  const handleModalChange = (name) => {
    setOpenModal(name)
  }

  React.useEffect(() => {
    const { defaultValuesObject = {} } = defaultOrderObject || {}
    const {
      orderType = 'MARKET',
      price = 0,
      instruction = 'BUY',
      quantity = 1,
      symbol = ''
    } = defaultValuesObject || {}
    const newOrderValuesObject = { orderType, price, instruction, quantity, symbol }
    if (instruction !== 'BUY' && instruction !== 'SELL') newOrderValuesObject.instruction = initialOrderValuesObject.instruction
    setOrderValuesObject(newOrderValuesObject)
  }, [])

  return (
    <>
      <SymbolBlock quoteObject={quoteObject} orderValuesObject={orderValuesObject} handleModalChange={handleModalChange} symbolChangeHandler={symbolChangeHandler} />
      <DetailsBlock orderValuesObject={orderValuesObject} amountUnits={amountUnits} handleUpdate={handleUpdate} setAmountUnits={setAmountUnits} />
      {quoteObject && Object.keys(quoteObject).length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '160px', borderBottom: '1px solid grey', alignItems: 'center', justifyContent: 'center' }}>
          <h1>{`$${totalOrderPrice.toFixed(2)}`}</h1>
          <div className='trade-button-container'>
            <button
              disabled={!accountNumber}
              className='trade-button-selected'
              style={{ width: '160px', opacity: !accountNumber ? 0.5 : null, cursor: !accountNumber ? 'initial' : null }}
              onClick={handleSubmitOrder}
            >
              Place Order
            </button>
          </div>
        </div>)}
    </>
  )
}

export default StockOrder
