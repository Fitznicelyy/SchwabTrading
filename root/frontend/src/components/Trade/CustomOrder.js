import React from 'react'
import { fullOrderObject, orderObjectTypes } from './OrderObjects'
import DisplayObjectValue from '../StandardComponents/DisplayObjectValue'
import { handlePostSchwabData } from '../Accounts'

const CustomOrder = ({ tokenObject, accountNumbers, accountNumber }) => {
  const [objectValue, setObjectValue] = React.useState(fullOrderObject)

  const update = (newValue) => {
    setObjectValue((objectValue) => Object.assign({}, objectValue, newValue))
  }

  const handlePlaceOrder = async () => {
    const { access_token = '' } = tokenObject || {}
    if (!access_token) return
    const { hashValue = '' } = accountNumbers.find(({ accountNumber: acctNum }) => acctNum === accountNumber) || {}
    if (hashValue) await handlePostSchwabData(access_token, `/accounts/${hashValue}/orders`, objectValue, () => {})
  }

  return (
    <>
      <dl style={{ display: 'flex', flexDirection: 'column', overflow: 'auto', borderBottom: '1px solid grey', padding: '8px' }}>
        <DisplayObjectValue object={objectValue} objectTypes={orderObjectTypes} update={update} />
      </dl>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '160px', borderBottom: '1px solid grey', alignItems: 'center', justifyContent: 'center' }}>
        <div className='trade-button-container'>
          <button
            disabled={!accountNumber}
            className='trade-button-selected'
            style={{ width: '160px', opacity: !accountNumber ? 0.5 : null, cursor: !accountNumber ? 'initial' : null }}
            onClick={handlePlaceOrder}
          >
            Place Order
          </button>
        </div>
      </div>
    </>
  )
}

export default CustomOrder
