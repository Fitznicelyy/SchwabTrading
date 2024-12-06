import React from 'react'
import './orderStyles.css'
import { defaultGetOrder, defaultGetOrderTypes } from './OrderObjects'
import { handleGetSchwabData } from '../Accounts'
import { DisplayObjectValue, SelectDisplay, TableDisplay } from '../StandardComponents'

const Orders = ({ tokenObject }) => {
  const [selectedAccountNumber, setSelectedAccountNumber] = React.useState('')
  const [data, setData] = React.useState([])
  const [objectValue, setObjectValue] = React.useState(defaultGetOrder)
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
        const { duration, enteredTime, orderLegCollection = [], orderType, price, quantity, status } = object || {}
        const { instruction, instrument = {} } = orderLegCollection[0] || {}
        const { symbol } = instrument || {}
        return [...acc, { Symbol: symbol, Status: status, Action: instruction, Quantity: quantity, Type: orderType, Price: price, Timing: duration, Created: enteredTime }]
      }, []))
    } else {
      setData([])
    }
  }

  const handleGetOrders = async () => {
    const { access_token = '' } = tokenObject || {}
    if (!access_token) return
    if (selectedAccountNumber) {
      const { hashValue = '' } = accountNumbers.find(({ accountNumber }) => accountNumber === selectedAccountNumber) || {}
      if (hashValue) await handleGetSchwabData(access_token, `/accounts/${hashValue}/orders`, objectValue, handleData)
    }
  }

  return (
    <>
      <div style={{ display: 'flex', width: '100%', height: '80px', borderBottom: '1px solid grey', alignItems: 'center' }}>
        <h1 style={{ padding: '10px' }}>Orders</h1>
      </div>
      <div style={{ display: 'flex', width: '100%', height: '80px', borderBottom: '1px solid grey', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className='orders-input-container'>
          <SelectDisplay value={selectedAccountNumber} options={accountOptions} handleChange={setSelectedAccountNumber} />
          <label className='orders-input-label'>account</label>
        </div>
        <div className='orders-button-container'>
          <button className='orders-button-selected' style={{ width: '160px' }} onClick={handleGetOrders}>Get Orders</button>
        </div>
      </div>
      <dl style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', borderBottom: '1px solid grey', padding: '8px' }}>
        <DisplayObjectValue object={objectValue} objectTypes={defaultGetOrderTypes} update={update} />
      </dl>
      <div style={{ display: 'flex', maxHeight: 'calc(100% - 370px)', overflow: 'auto', margin: '24px' }}>
        <TableDisplay data={data} />
      </div>
    </>
  )
}

export default Orders
