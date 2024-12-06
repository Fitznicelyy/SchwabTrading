import React from 'react'

const getTabStyle = (state, value) => ({ padding: '8px', background: state === value ? 'var(--dark)' : null})

const FilterBlock = ({ expirationDateFilter, setExpirationDateFilter, strikesShownFilter, setStrikesShownFilter }) => {
  return (
    <div style={{ display: 'flex', width: '100%', height: '80px', borderBottom: '1px solid grey', alignItems: 'center', justifyContent: 'end' }}>
      <div className='btn-group' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', margin: '10px' }}>
        <label style={{ fontSize: 'small', marginBottom: '8px' }}>Expiration Date (Days)</label>
        <div style={{ display: 'flex' }}>
          <button style={getTabStyle(expirationDateFilter, 60)} onClick={() => setExpirationDateFilter(60)}>60</button>
          <button style={getTabStyle(expirationDateFilter, 120)} onClick={() => setExpirationDateFilter(120)}>120</button>
          <button style={getTabStyle(expirationDateFilter, 'All')} onClick={() => setExpirationDateFilter('All')}>All</button>
        </div>
      </div>
      <div className='btn-group' style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignItems: 'center', margin: '10px' }}>
        <label style={{ fontSize: 'small', marginBottom: '8px' }}>Strikes Shown</label>
        <div style={{ display: 'flex' }}>
          <button style={getTabStyle(strikesShownFilter, 8)} value={8} onClick={() => setStrikesShownFilter(8)}>8</button>
          <button style={getTabStyle(strikesShownFilter, 16)} value={16} onClick={() => setStrikesShownFilter(16)}>16</button>
          <button style={getTabStyle(strikesShownFilter, 'All')} value='All' onClick={() => setStrikesShownFilter('All')}>All</button>
        </div>
      </div>
    </div>
  )
}

const StrikeListItem = ({ callStrikeObject, putStrikeObject, expirationDate, handleStrikeValueClick }) => {
  const { strikePrice = 0, bid: callBid = 0, ask: callAsk = 0, last: callLast = 0, inTheMoney: callInTheMoney = false } = callStrikeObject || {}
  const { bid: putBid = 0, ask: putAsk = 0, last: putLast = 0, inTheMoney: putInTheMoney = false } = putStrikeObject || {}
  return (
    <dt style={{ display: 'flex', justifyContent: 'space-evenly', borderBottom: '1px solid var(--dark)', fontSize: 'small' }}>
      <div className={callInTheMoney ? 'strike-ITM' : 'strike-not-ITM'}>
        <label className='strike-value' onClick={() => handleStrikeValueClick('CALL', expirationDate, strikePrice.toFixed(2), callBid.toFixed(2), 'SELL_TO_CLOSE')}>{callBid.toFixed(2)}</label>
        <label className='strike-value' onClick={() => handleStrikeValueClick('CALL', expirationDate, strikePrice.toFixed(2), callAsk.toFixed(2), 'BUY_TO_OPEN')}>{callAsk.toFixed(2)}</label>
        <label style={{ display: 'flex', minWidth: '40px', justifyContent: 'end' }}>{callLast.toFixed(2)}</label>
      </div>
      <label style={{ display: 'flex', minWidth: '120px', justifyContent: 'center', color: 'white', backgroundColor: 'var(--extraDark)' }}>{strikePrice.toFixed(2)}</label>
      <div className={putInTheMoney ? 'strike-ITM' : 'strike-not-ITM'}>
        <label className='strike-value' onClick={() => handleStrikeValueClick('PUT', expirationDate, strikePrice.toFixed(2), putBid.toFixed(2), 'SELL_TO_CLOSE')}>{putBid.toFixed(2)}</label>
        <label className='strike-value' onClick={() => handleStrikeValueClick('PUT', expirationDate, strikePrice.toFixed(2), putAsk.toFixed(2), 'BUY_TO_OPEN')}>{putAsk.toFixed(2)}</label>
        <label style={{ display: 'flex', minWidth: '40px', justifyContent: 'end' }}>{putLast.toFixed(2)}</label>
      </div>
    </dt>
  )
}

const ExpirationDatesListItem = ({ expirationDate, daysToExpiration, callExpirationDateObject, putExpirationDateObject, strikesShownFilter, handleStrikeValueClick }) => {
  const [open, setOpen] = React.useState(false)

  const allStrikes = Object.keys(callExpirationDateObject)
  const filterIndex = allStrikes && allStrikes.length > 0 && strikesShownFilter !== 'All'
    ? Object.entries(callExpirationDateObject).findIndex(([,v]) => !v[0].inTheMoney)
    : 'All'
  const strikes = filterIndex === 'All' || filterIndex < 0
    ? allStrikes
    : allStrikes.splice(filterIndex - (strikesShownFilter / 2) < 0 ? 0 : filterIndex - (strikesShownFilter / 2), strikesShownFilter)
  return (
    <>
      <dt className={open ? 'expiration-open' : 'expiration-closed'} onClick={() => setOpen(!open)}>
        <div style={{ marginRight: '8px', transform: open ? 'rotate(90deg)' : '' }}>{'>'}</div>
        <label>{`${expirationDate} (${daysToExpiration} days)`}</label>
      </dt>
      {open && (
        <dl style={{ margin: '0px 20px' }}>
          <dt style={{ display: 'flex', justifyContent: 'space-evenly' }}>
            <h3 style={{ margin: 0 }}>Calls</h3>
            <div style={{ width: '120px' }} />
            <h3 style={{ margin: 0 }}>Puts</h3>
          </dt>
          <dt style={{ display: 'flex', justifyContent: 'space-evenly', borderBottom: '2px solid var(--dark)' }}>
            <h5 style={{ display: 'flex', minWidth: '40px', justifyContent: 'end', margin: 0 }}>Bid</h5>
            <h5 style={{ display: 'flex', minWidth: '40px', justifyContent: 'end', margin: 0 }}>Ask</h5>
            <h5 style={{ display: 'flex', minWidth: '40px', justifyContent: 'end', margin: 0 }}>Last</h5>
            <h5 style={{ display: 'flex', minWidth: '120px', justifyContent: 'center', margin: 0 }}>Strike</h5>
            <h5 style={{ display: 'flex', minWidth: '40px', justifyContent: 'end', margin: 0 }}>Bid</h5>
            <h5 style={{ display: 'flex', minWidth: '40px', justifyContent: 'end', margin: 0 }}>Ask</h5>
            <h5 style={{ display: 'flex', minWidth: '40px', justifyContent: 'end', margin: 0 }}>Last</h5>
          </dt>
          {strikes && strikes.length > 0 && strikes.map((strike) => {
            const callStrikeObject = callExpirationDateObject[strike][0]
            const putStrikeObject = putExpirationDateObject[strike][0]
            return <StrikeListItem key={strike} callStrikeObject={callStrikeObject} putStrikeObject={putStrikeObject} expirationDate={expirationDate} handleStrikeValueClick={handleStrikeValueClick} />
          })}
        </dl>)}
    </>
  )
}

const OptionChain = ({ chainObject, orderValuesObject, setOrderValuesObject, setShowOptionChain, expirationChainArray }) => {
  const [expirationDateFilter, setExpirationDateFilter] = React.useState(60)
  const [strikesShownFilter, setStrikesShownFilter] = React.useState(8)

  const { callExpDateMap = {}, putExpDateMap = {} } = chainObject || {}

  const handleStrikeValueClick = (strategy, expirationDate, strike, price, instruction) => {
    const valuesObject = { strategy, expirationDate, strike, price, instruction}
    const newOrderValuesObject = Object.assign({}, orderValuesObject, valuesObject)
    setOrderValuesObject(newOrderValuesObject)
    setShowOptionChain(false)
  }

  return (
    <>
      <FilterBlock
        expirationDateFilter={expirationDateFilter}
        setExpirationDateFilter={setExpirationDateFilter}
        strikesShownFilter={strikesShownFilter}
        setStrikesShownFilter={setStrikesShownFilter}
      />
      <dl style={{ width: '100%' }}>
        {expirationChainArray && expirationChainArray.length > 0 &&
          expirationChainArray.filter(({ daysToExpiration }) => expirationDateFilter === 'All' || daysToExpiration <= expirationDateFilter).map(({ expirationDate, daysToExpiration }) => {
            const [, callExpirationDateObject] = Object.entries(callExpDateMap).find(([k]) => k.includes(expirationDate))
            const [, putExpirationDateObject] = Object.entries(putExpDateMap).find(([k]) => k.includes(expirationDate))
            return (
              <ExpirationDatesListItem
                key={expirationDate}
                expirationDate={expirationDate}
                daysToExpiration={daysToExpiration}
                callExpirationDateObject={callExpirationDateObject}
                putExpirationDateObject={putExpirationDateObject}
                strikesShownFilter={strikesShownFilter}
                handleStrikeValueClick={handleStrikeValueClick}
              />
            )
          })}
      </dl>
    </>
  )
}

export default OptionChain
