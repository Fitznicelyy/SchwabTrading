import React from 'react'
import './transactionsStyles.css'
import { defaultGetTransaction, defaultGetTransactionTypes } from './TranactionObjects'
import { handleGetSchwabData } from '../Accounts'
import { DisplayObjectValue, SelectDisplay, TableDisplay } from '../StandardComponents'


const Transactions = ({ tokenObject }) => {
  const [selectedAccountNumber, setSelectedAccountNumber] = React.useState('')
  const [data, setData] = React.useState([])
  const [objectValue, setObjectValue] = React.useState(defaultGetTransaction)
  const [accountNumbers, setAccountNumbers] = React.useState(null)

  React.useEffect(() => {
    const { access_token = '' } = tokenObject || {}
    if (!access_token) return
    const asynchandleGetSchwabData = async () => {
      if (!accountNumbers) await handleGetSchwabData(access_token, '/accounts/accountNumbers', {}, setAccountNumbers)
    }
    asynchandleGetSchwabData()
  }, [tokenObject])

  const accountOptions = accountNumbers && accountNumbers.length > 0 ? accountNumbers.map(({ accountNumber }) => accountNumber) : []

  const update = (newValue) => {
    setObjectValue((objectValue) => Object.assign({}, objectValue, newValue))
  }

  const handleData = (array) => {
    if (Array.isArray(array)) {
      setData(array.reduce((acc, object) => {
        const { tradeDate, transferItems = [] } = object || {}
        const foundObject = transferItems.find(({ positionEffect }) => !positionEffect || (positionEffect !== 'COMMISSION' && !positionEffect.includes('FEE')))
        const newObject = {}
        if (foundObject) {
          const { amount, cost, instrument = {} } = foundObject || {}
          const { closingPrice, symbol } = instrument || {}
          newObject.Symbol = symbol
          newObject.Action = amount < 0 ? 'SELL' : 'BUY'
          newObject.Quantity = amount * -1
          newObject.Cost = cost
          newObject.Price = closingPrice
        }
        newObject.Date = tradeDate
        return [...acc, newObject]
      }, []))
    } else {
      setData([])
    }
  }

  const handleGetTransactions = async () => {
    const { access_token = '' } = tokenObject || {}
    if (!access_token) return
    if (selectedAccountNumber) {
      const { hashValue = '' } = accountNumbers.find(({ accountNumber }) => accountNumber === selectedAccountNumber) || {}
      if (hashValue) await handleGetSchwabData(access_token, `/accounts/${hashValue}/transactions`, objectValue, handleData)
    }
  }

  return (
    <>
      <div style={{ display: 'flex', width: '100%', height: '80px', borderBottom: '1px solid grey', alignItems: 'center' }}>
        <h1 style={{ padding: '10px' }}>Transactions</h1>
      </div>
      <div style={{ display: 'flex', width: '100%', height: '80px', borderBottom: '1px solid grey', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className='transactions-input-container'>
          <SelectDisplay value={selectedAccountNumber} options={accountOptions} handleChange={setSelectedAccountNumber} />
          <label className='transactions-input-label'>account</label>
        </div>
        <div className='transactions-button-container'>
          <button className='transactions-button-selected' style={{ width: '160px' }} onClick={handleGetTransactions}>Get Transactions</button>
        </div>
      </div>
      <dl style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', borderBottom: '1px solid grey', padding: '8px' }}>
        <DisplayObjectValue object={objectValue} objectTypes={defaultGetTransactionTypes} update={update} />
      </dl>
      <div style={{ display: 'flex', maxHeight: 'calc(100% - 370px)', overflow: 'auto', margin: '24px' }}>
        <TableDisplay data={data} />
      </div>
    </>
  )
}

export default Transactions
