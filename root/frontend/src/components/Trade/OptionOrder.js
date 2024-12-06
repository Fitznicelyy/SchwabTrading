import React from 'react'
import OptionChain from './OptionChain'
import { handlePostSchwabData } from '../Accounts'
import { InputDisplay, SelectDisplay } from '../StandardComponents'

const orderSkeleton = {
  session: 'NORMAL',
  duration: 'DAY',
  orderStrategyType: 'SINGLE',
  orderLegCollection: [
    {
      instrument: {
        assetType: 'OPTION'
      }
    }
  ]
}

const initialOrderValuesObject = {
  orderType: 'MARKET',
  price: 0,
  instruction: 'BUY_TO_OPEN',
  quantity: 1,
  symbol: '',
  strike: 0,
  expirationDate: '',
  strategy: 'CALL'
}

const instructionOptions = ['BUY_TO_OPEN', 'BUY_TO_CLOSE', 'SELL_TO_OPEN', 'SELL_TO_CLOSE']

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

const OptionBlockDetails = ({ orderValuesObject, expirationDateObject }) => {
  const { strike } = orderValuesObject || {}
  const strikeObject = expirationDateObject && expirationDateObject.length > 0 ? Object.entries(expirationDateObject[1]).find(([k]) => parseFloat(strike) === parseFloat(k)) : []
  const { ask = 0, askSize = 0, bid = 0, bidSize = 0, delta, theta, gamma, vega } = strikeObject && strikeObject.length > 0 ? strikeObject[1][0] : {}
  return (
    <>
      {strikeObject && strikeObject.length > 0 && (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '0px 20px' }}>
            <ValueDisplay label='Bid/Size' value={`${bid.toFixed(2)}/${bidSize}`} />
            <ValueDisplay label='Ask/Size' value={`${ask.toFixed(2)}/${askSize}`} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '0px 20px' }}>
            <ValueDisplay label='Delta' value={delta} />
            <ValueDisplay label='Gamma' value={gamma} />
            <ValueDisplay label='Theta' value={theta} />
            <ValueDisplay label='Vega' value={vega} />
          </div>
        </>)}
    </>
  )
}

const OptionBlock = ({ orderValuesObject, handleUpdate, chainObject, showOptionChain, setShowOptionChain }) => {
  const { strategy, strike, expirationDate } = orderValuesObject || {}
  const { callExpDateMap = {}, putExpDateMap = {} } = chainObject || {}

  const expirationDates = Object.keys((strategy === 'CALL' ? callExpDateMap : putExpDateMap)).map((date) => date.split(':')[0])
  const expirationDateObject = Object.entries((strategy === 'CALL' ? callExpDateMap : putExpDateMap)).find(([k]) => k.includes(expirationDate))
  const strikes = expirationDateObject && expirationDateObject.length > 0 ? Object.keys(expirationDateObject[1]).map((price) => parseFloat(price).toFixed(2)) : []
  return (
    <div style={{ display: 'flex', width: '100%', height: '80px', borderBottom: '1px solid grey', alignItems: 'center' }}>
      <div style={{ display: 'flex', width: '100%', alignItems: 'center' }}>
        <div className='trade-button-container'>
          <button className={strategy === 'CALL' ? 'trade-button-selected' : 'trade-button-unselected'} onClick={() => handleUpdate('strategy', 'CALL')}>Call</button>
          <button className={strategy === 'PUT' ? 'trade-button-selected' : 'trade-button-unselected'} onClick={() => handleUpdate('strategy', 'PUT')}>Put</button>
        </div>
        <div className='trade-input-container'>
          <SelectDisplay value={expirationDate} options={expirationDates} handleChange={(value) => handleUpdate('expirationDate', value)} />
          <label className='trade-input-label'>expiration date</label>
        </div>
        <div className='trade-input-container' style={{ opacity: !expirationDate ? 0.5 : null, cursor: !expirationDate ? 'initial' : null }} >
          <SelectDisplay disabled={!expirationDate} value={strike} options={strikes} handleChange={(value) => handleUpdate('strike', value)} />
          <label className='trade-input-label'>strike</label>
        </div>
        <OptionBlockDetails orderValuesObject={orderValuesObject} expirationDateObject={expirationDateObject} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', margin: '10px' }}>
        <button style={{ border: '1px solid var(--dark)' }} className={showOptionChain ? 'trade-button-selected' : 'trade-button-unselected'} onClick={() => setShowOptionChain(!showOptionChain)}>Option Chains</button>
      </div>
    </div>
  )
}

const DetailsBlock = ({ orderValuesObject, handleUpdate }) => {
  const { orderType, price, instruction, quantity } = orderValuesObject || {}
  return (
    <div style={{ display: 'flex', width: '100%', height: '80px', borderBottom: '1px solid grey', alignItems: 'center' }}>
      <div className='trade-input-container'>
        <SelectDisplay value={instruction} options={instructionOptions} handleChange={(value) => handleUpdate('instruction', value)} />
        <label className='trade-input-label'>instruction</label>
      </div>
      <div className='trade-input-container'>
        <InputDisplay value={quantity} type='number' handleChange={(v) => handleUpdate('quantity', v)} />
        <label className='trade-input-label'>quantity</label>
      </div>
      <div className='trade-button-container'>
        <button className={orderType === 'MARKET' ? 'trade-button-selected' : 'trade-button-unselected'} onClick={() => handleUpdate('orderType', 'MARKET')}>Market</button>
        <button className={orderType === 'LIMIT' ? 'trade-button-selected' : 'trade-button-unselected'} onClick={() => handleUpdate('orderType', 'LIMIT')}>Limit</button>
      </div>
      {orderType === 'LIMIT' && (
        <div className='trade-input-container'>
          <InputDisplay value={price} type='number' handleChange={(v) => handleUpdate('price', v)} />
          <label className='trade-input-label'>price</label>
        </div>)}
    </div>
  )
}

const getStrikeValue = (chainObject, orderValuesObject, value) => {
  const { callExpDateMap = {}, putExpDateMap = {} } = chainObject || {}
  const { strategy, strike, expirationDate } = orderValuesObject || {}
  const expirationDateObject = Object.entries((strategy === 'CALL' ? callExpDateMap : putExpDateMap)).find(([k]) => k.includes(expirationDate))
  const strikeObject = expirationDateObject && expirationDateObject.length > 0 ? Object.entries(expirationDateObject[1]).find(([k]) => parseFloat(strike) === parseFloat(k)) : []
  const strikeValue = strikeObject && strikeObject.length > 0 ? strikeObject[1][0] : {}
  return strikeValue[value] || ''
}

const OrderDisplay = ({ tokenObject, chainObject, quoteObject, orderValuesObject, accountNumber, accountNumbers, handleUpdate, setPostResult }) => {
  const { orderType, price, instruction, quantity } = orderValuesObject || {}

  const optionBuyPrice = getStrikeValue(chainObject, orderValuesObject, instruction.includes('BUY') ? 'ask' : 'bid')
  const totalOrderPrice = quantity * ((orderType === 'LIMIT' ? price : (optionBuyPrice ? parseFloat(optionBuyPrice) : 0)) * 100)

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
    newInstrument.symbol = getStrikeValue(chainObject, orderValuesObject, 'symbol')
    newOrderLegCollection.instrument = newInstrument
    newOrderLegCollection.instruction = instruction
    newOrderLegCollection.quantity = quantity
    if (orderType === 'LIMIT') orderObject.price = price
    orderObject.orderLegCollection = [newOrderLegCollection]
    await handlePlaceOrder(orderObject)
  }

  const handleSubmitOrder = async () => {
    if (window.confirm('Are you sure you want to place the order?')) submitOrder()
  }

  return (
    <>
      <DetailsBlock orderValuesObject={orderValuesObject} handleUpdate={handleUpdate} />
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

const OptionOrder = ({
  accountNumbers,
  accountNumber,
  defaultOrderObject,
  quoteObject,
  setPostResult,
  handleSymbolChange,
  tokenObject,
  setOpenModal,
  chainObject,
  expirationChainArray
}) => {
  const [orderValuesObject, setOrderValuesObject] = React.useState(initialOrderValuesObject)
  const [showOptionChain, setShowOptionChain] = React.useState(false)

  const handleUpdate = (name, value) => {
    const newOrderValuesObject = { ...orderValuesObject }
    newOrderValuesObject[name] = value
    const { instruction = '' } = newOrderValuesObject || {}
    if (name === 'orderType' && value === 'LIMIT') newOrderValuesObject.price = parseFloat(getStrikeValue(chainObject, newOrderValuesObject, instruction.includes('BUY') ? 'ask' : 'bid') || 0).toFixed(2)
    setOrderValuesObject(newOrderValuesObject)
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
      instruction = 'BUY_TO_OPEN',
      quantity = 1,
      symbol = '',
      strike = 0,
      expirationDate = '',
      strategy = 'CALL'
    } = defaultValuesObject || {}
    const newOrderValuesObject = { orderType, price, instruction, quantity, symbol, strike, expirationDate, strategy }
    if (!instructionOptions.includes(instruction)) newOrderValuesObject.instruction = initialOrderValuesObject.instruction
    if (!Number.isInteger(quantity)) newOrderValuesObject.quantity = initialOrderValuesObject.quantity
    setOrderValuesObject(newOrderValuesObject)
  }, [])

  return (
    <>
      <SymbolBlock quoteObject={quoteObject} orderValuesObject={orderValuesObject} handleModalChange={handleModalChange} symbolChangeHandler={symbolChangeHandler} />
      <OptionBlock orderValuesObject={orderValuesObject} handleUpdate={handleUpdate} chainObject={chainObject} showOptionChain={showOptionChain} setShowOptionChain={setShowOptionChain} />
      {showOptionChain
        ? (
          <OptionChain
            chainObject={chainObject}
            orderValuesObject={orderValuesObject}
            setOrderValuesObject={setOrderValuesObject}
            setShowOptionChain={setShowOptionChain}
            expirationChainArray={expirationChainArray}
          />)
        : (
          <OrderDisplay
            tokenObject={tokenObject}
            chainObject={chainObject}
            quoteObject={quoteObject}
            orderValuesObject={orderValuesObject}
            accountNumber={accountNumber}
            accountNumbers={accountNumbers}
            handleUpdate={handleUpdate}
            setPostResult={setPostResult}
          />)}
    </>
  )
}

export default OptionOrder
