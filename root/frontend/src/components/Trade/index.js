import React from 'react'
import './tradeStyles.css'
import { RefreshIcon } from '../../Icons'
import CustomOrder from './CustomOrder'
import { handleGetSchwabData } from '../Accounts'
import { SelectDisplay } from '../StandardComponents'
import StockOrder from './StockOrder'
import OptionOrder from './OptionOrder'

const TitleBlock = ({ name, postResult }) => {
  const { message: errorMessage = '', errors = [] } = postResult || {}
  return (
    <div style={{ display: 'flex', width: '100%', height: '80px', borderBottom: '1px solid grey', alignItems: 'center', justifyContent: 'space-between' }}>
      <h1 style={{ padding: '10px' }}>{name}</h1>
      {errorMessage
        ? errors && errors.length > 0
          ? (
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%'}}>
              {errors.map((message) => <div style={{ display: 'flex', padding: '10px', margin: '20px', borderRadius: '4px', backgroundColor: 'lightcoral', color: 'white' }}>{message}</div>)}
            </div>)
          : <div style={{ display: 'flex', width: '100%', padding: '10px', margin: '20px', borderRadius: '4px', backgroundColor: 'lightcoral', color: 'white' }}>{errorMessage}</div>
        : null}
    </div>
  )
}

const AccountBlock = ({
  selectedOrderType,
  handleSelectedOrderTypeChange,
  accountNumber,
  handleAccountChange,
  accountNumbers,
  accountObject,
  refresh,
  setRefresh
}) => {
  const { securitiesAccount = {} } = accountObject || {}
  const { currentBalances = {} } = securitiesAccount || {}
  const { cashBalance = 0 } = currentBalances || {}

  const accountOptions = accountNumbers && accountNumbers.length > 0 ? accountNumbers.map(({ accountNumber }) => accountNumber) : []

  return (
    <div style={{ display: 'flex', width: '100%', height: '80px', borderBottom: '1px solid grey', alignItems: 'center', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div className='trade-input-container'>
          <SelectDisplay value={selectedOrderType} options={['Stocks/ETFs', 'Options', 'Custom']} handleChange={handleSelectedOrderTypeChange} />
          <label className='trade-input-label'>trade</label>
        </div>
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
  )
}

const Trade = ({ tokenObject, defaultOrderObject, setOpenModal, updateDefaultOrderObject }) => {
  const [accountObject, setAccountObject] = React.useState({})
  const [accountNumbers, setAccountNumbers] = React.useState(null)
  const [quoteObject, setQuoteObject] = React.useState({})
  const [chainObject, setChainObject] = React.useState({})
  const [expirationChainArray, setExpirationChainArray] = React.useState([])
  const [postResult, setPostResult] = React.useState({})
  const [selectedOrderType, setSelectedOrderType] = React.useState('Stocks/ETFs')
  const [refresh, setRefresh] = React.useState(null)

  const { securitiesAccount = {} } = accountObject || {}
  const { accountNumber = ''} = securitiesAccount || {}

  const handleAccountChange = async (newAccountNumber) => {
    const { access_token = '' } = tokenObject || {}
    if (!access_token) return
    const { hashValue = '' } = accountNumbers.find(({ accountNumber }) => accountNumber === newAccountNumber) || {}
    if (!hashValue) return
    await handleGetSchwabData(access_token, `/accounts/${hashValue}`, {}, setAccountObject)
  }

  const handleSymbolChange = async (input) => {
    const { access_token = '' } = tokenObject || {}
    if (!access_token) return
    const symbol = input.toUpperCase()
    if (!symbol) return
    const handleQuote = (value) => setQuoteObject(value[symbol] || {})
    const handleExpirationChain = (value) => setExpirationChainArray(value.expirationList || [])
    await handleGetSchwabData(access_token, `${symbol.toUpperCase()}/quotes`, {}, handleQuote)
    await handleGetSchwabData(access_token, '/chains', { symbol: symbol }, setChainObject)
    await handleGetSchwabData(access_token, '/expirationchain', { symbol: symbol }, handleExpirationChain)
    const { defaultValuesObject = {} } = defaultOrderObject || {}
    const { symbol: defaultSymbol = '', instruction = 'BUY', quantity = 1 } = defaultValuesObject || {}
    defaultSymbol !== symbol && updateDefaultOrderObject('defaultValuesObject', { symbol, instruction, quantity })
  }

  const handleSelectedOrderTypeChange = (value) => {
    setSelectedOrderType(value)
    updateDefaultOrderObject('defaultTrade', value)
  }

  React.useEffect(() => {
    if (refresh) {
      handleAccountChange(accountNumber)
      const { defaultValuesObject = {} } = defaultOrderObject || {}
      const { symbol = '' } = defaultValuesObject || {}
      handleSymbolChange(symbol)
    }
  }, [refresh])

  React.useEffect(() => {
    const { access_token = '' } = tokenObject || {}
    if (!access_token) return
    const asynchandleGetSchwabData = async () => {
      if (!accountNumbers) await handleGetSchwabData(access_token, '/accounts/accountNumbers', {}, setAccountNumbers)
    }
    asynchandleGetSchwabData()
  }, [tokenObject])

  React.useEffect(() => {
    const { defaultTrade = '', defaultValuesObject = {} } = defaultOrderObject || {}
    const { symbol = '' } = defaultValuesObject || {}
    defaultTrade && setSelectedOrderType(defaultTrade)
    symbol && Object.keys(quoteObject).length === 0 && handleSymbolChange(symbol)
  }, [])

  return (
    <>
      <TitleBlock name='Trade' postResult={postResult} />
      <AccountBlock
        selectedOrderType={selectedOrderType}
        handleSelectedOrderTypeChange={handleSelectedOrderTypeChange}
        accountNumber={accountNumber}
        handleAccountChange={handleAccountChange}
        accountNumbers={accountNumbers}
        accountObject={accountObject}
        refresh={refresh}
        setRefresh={setRefresh}
      />
      {selectedOrderType === 'Stocks/ETFs'
        ? <StockOrder
          accountNumbers={accountNumbers}
          accountNumber={accountNumber}
          defaultOrderObject={defaultOrderObject}
          quoteObject={quoteObject}
          setPostResult={setPostResult}
          handleSymbolChange={handleSymbolChange}
          tokenObject={tokenObject}
          setOpenModal={setOpenModal}
        />
        : selectedOrderType === 'Options'
          ? <OptionOrder
            accountNumbers={accountNumbers}
            accountNumber={accountNumber}
            defaultOrderObject={defaultOrderObject}
            quoteObject={quoteObject}
            setPostResult={setPostResult}
            handleSymbolChange={handleSymbolChange}
            tokenObject={tokenObject}
            setOpenModal={setOpenModal}
            chainObject={chainObject}
            expirationChainArray={expirationChainArray}
          />
          : selectedOrderType === 'Custom'
            ? <CustomOrder tokenObject={tokenObject} accountNumbers={accountNumbers} accountNumber={accountNumber} />
            : null}
    </>
  )
}

export default Trade
