import React from 'react'
import './homeStyles.css'
import { Modal } from '../StandardComponents'
import { RefreshIcon } from '../../Icons'
import PriceHistory from '../Accounts/PriceHistory'
import { handleGetSchwabData } from '../Accounts'
import { SelectDisplay } from '../StandardComponents'
import Accounts from '../Accounts'
import SymbolRatings from '../SymbolRatings'
import Trade from '../Trade'

const initialOrderObject = {
  defaultTrade: 'Stocks/ETFs',
  defaultValuesObject : {
    instruction: 'BUY',
    quantity: 1,
    symbol: ''
  }
}

const ModalContent = ({ openModal, setOpenModal, tokenObject, defaultOrderObject, updateDefaultOrderObject }) => {
  switch (openModal) {
    case 'trade':
      return <Trade tokenObject={tokenObject} defaultOrderObject={defaultOrderObject} setOpenModal={setOpenModal} updateDefaultOrderObject={updateDefaultOrderObject} />
    case 'priceHistory':
      return <PriceHistory tokenObject={tokenObject} defaultOrderObject={defaultOrderObject} setOpenModal={setOpenModal} />
    default:
      return null
  }
}

const Home = ({ tokenObject }) => {
  const [accountObject, setAccountObject] = React.useState({})
  const [accountNumbers, setAccountNumbers] = React.useState(null)
  const [openModal, setOpenModal] = React.useState('')
  const [defaultOrderObject, setDefaultOrderObject] = React.useState(initialOrderObject)
  const [refresh, setRefresh] = React.useState(null)

  const { securitiesAccount = {} } = accountObject || {}
  const { accountNumber = '', currentBalances = {} } = securitiesAccount || {}
  const { cashBalance = '' } = currentBalances || {}

  const accountOptions = accountNumbers && accountNumbers.length > 0 ? accountNumbers.map(({ accountNumber }) => accountNumber) : []

  const handleAccountChange = async (newAccountNumber) => {
    const { access_token = '' } = tokenObject || {}
    if (!access_token) return
    const { hashValue = '' } = accountNumbers.find(({ accountNumber }) => accountNumber === newAccountNumber) || {}
    if (!hashValue) return
    await handleGetSchwabData(access_token, `/accounts/${hashValue}`, { fields: 'positions' }, setAccountObject)
  }

  React.useEffect(() => {
    const { access_token = '' } = tokenObject || {}
    if (!access_token) return
    const asyncHandleGetSchwabData = async () => {
      if (!accountNumbers) await handleGetSchwabData(access_token, '/accounts/accountNumbers', {}, setAccountNumbers)
    }
    asyncHandleGetSchwabData()
  }, [tokenObject])
  
  React.useEffect(() => {
    refresh && handleAccountChange(accountNumber)
  }, [refresh])

  const updateDefaultOrderObject = (name, value) => {
    setDefaultOrderObject((defaultOrderObject) => {
      const newDefaultOrderObject = { ...defaultOrderObject }
      newDefaultOrderObject[name] = value
      return newDefaultOrderObject
  })
  }

  const handleTradeSymbol = (defaultTrade, defaultValuesObject) => {
    updateDefaultOrderObject('defaultTrade', defaultTrade)
    updateDefaultOrderObject('defaultValuesObject', defaultValuesObject)
    setOpenModal('trade')
  }

  return (
    <>
      <div style={{ display: 'flex', width: '100%', height: '80px', borderBottom: '1px solid grey', alignItems: 'center' }}>
        <h1>Home</h1>
      </div>
      <div style={{ display: 'flex', width: '100%', height: '80px', borderBottom: '1px solid grey', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className='trade-input-container'>
            <SelectDisplay value={accountNumber} options={accountOptions} handleChange={handleAccountChange} />
            <label className='trade-input-label'>account</label>
          </div>
          {accountObject && Object.keys(accountObject).length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', margin: '0px 40px' }}>
              <label>Cash Balance</label>
              <h3 style={{ margin: 0 }}>{`$${cashBalance.toFixed(2)}`}</h3>
            </div>)}
        </div>
        {accountObject && Object.keys(accountObject).length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {refresh && <label><b>Last Refresh: </b>{`${new Date(refresh).toLocaleDateString()} ${new Date(refresh).toLocaleTimeString()}`}</label>}
            <button style={{ margin: '0px 10px' }} onClick={() => setRefresh(Date.now())}>{RefreshIcon}</button>
          </div>)}
      </div>
      {accountObject && Object.keys(accountObject).length > 0 && (
        <div style={{ display: 'flex', width: '100%', height: 'calc(100% - 220px)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', width: '50%', borderRight: '1px solid black' }}>
            <Accounts accountObject={accountObject} handleTradeSymbol={handleTradeSymbol} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', width: '50%' }}>
            <SymbolRatings handleTradeSymbol={handleTradeSymbol} />
          </div>
        </div>)}
      <Modal
        state={openModal}
        setState={() => setOpenModal('')}
        content={
          <ModalContent
            openModal={openModal}
            setOpenModal={setOpenModal}
            tokenObject={tokenObject}
            defaultOrderObject={defaultOrderObject}
            setDefaultOrderObject={setDefaultOrderObject}
            updateDefaultOrderObject={updateDefaultOrderObject}
          />
        }
      />
    </>
  )
}

export default Home
