import React from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { handleGetSchwabData } from '../Accounts'
import { parseValue } from '../../Utils'

const green = 'rgb(0,128,0)'
const darkGreen = 'rgb(0,100,0)'
const greenShade = 'rgb(0,128,0,0.3)'

const red = 'rgb(255,0,0)'
const darkRed = 'rgb(139,0,0)'
const redShade = 'rgb(255,0,0,0.3)'

ChartJS.register(...registerables)

const getTabStyle = (state, value) => ({ padding: '8px', background: state === value ? 'var(--dark)' : null})

const getLabels = async (candles, selected) => await Promise.all(candles.map(({ datetime }) => {
  const date = new Date(datetime)
  return (
    selected === '1D'
      ? `${date.getHours().toString().padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}`
      : selected === '5D'
        ? `${(date.getMonth() + 1).toString().padStart(2, 0)}-${(date.getDate()).toString().padStart(2, 0)} ${date.getHours().toString().padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}`
        : selected === '1M' || selected === '6M' || selected === 'YTD'
          ? `${(date.getMonth() + 1).toString().padStart(2, 0)}-${(date.getDate()).toString().padStart(2, 0)}`
          : `${(date.getMonth() + 1).toString().padStart(2, 0)}-${(date.getDate()).toString().padStart(2, 0)}-${date.getFullYear().toString().padStart(4,0)}`
  )
}))

const getVariant1 = (candles, labels, priceChange) => [{
  data: candles.map(({ close }, i) => ({ x: labels[i], y: close })),
  borderColor: priceChange > 0 ? green : red,
  fill: true,
  lineTension: 0,
  fill: {
    target: 'origin',
    above: priceChange > 0 ? greenShade : redShade,
    below: priceChange > 0 ? greenShade : redShade,
  }
}]

const getVariant2 = (candles, labels) => candles.reduce((acc, { open, close }, i) => {
  const dataset = {
    data: [{ x: labels[i], y: open }, { x: labels[i], y: close }],
    borderColor: close > open ? green : red,
    backgroundColor: close > open ? darkGreen : darkRed,
    fill: false,
    lineTension: 1
  }
  return [...acc, dataset]
}, [])

const getPreviousClose = (previousClose, labels) => ({
  data: [{ x: labels[0], y: previousClose }, { x: labels[labels.length - 1], y: previousClose }],
  fill: false,
  lineTension: 1
})

const getVariant = (variant, candles, labels, priceChange) => {
  if (candles.length === 0) return []
  return variant === 'variant1' ? getVariant1(candles, labels, priceChange) : getVariant2(candles, labels)
}

const GraphDisplay = ({ selected, variant, data, quoteObject, priceChange }) => {
  const [chartData, setChartData] = React.useState({ datasets: [] })

  React.useEffect(() => {
    const getChartData = async () => {
      const { previousClose = '', candles = [] } = data || {}
      const labels = await getLabels(candles, selected)
      const datasets = getVariant(variant, candles, labels, priceChange)
      const newChartData = {
        labels,
        datasets: previousClose ? [...datasets, getPreviousClose(previousClose, labels)] : datasets
      }
      setChartData(newChartData)
    }
    getChartData()
  }, [data, variant, quoteObject])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
      },
      legend: {
        display: false
      }
    }
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: 'calc(100% - 84px)' }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

const getObjectValue = (selected) => {
  switch (selected) {
    case '1D':
      return { periodType: 'day', period: 1}
    case '5D':
      return { periodType: 'day', period: 5, frequency: 30 }
    case '1M':
      return { periodType: 'month', frequencyType: 'daily' }
    case '6M':
      return { periodType: 'month', period: 6, frequencyType: 'daily' }
    case 'YTD':
      return { periodType: 'ytd', frequencyType: 'daily' }
    case '1Y':
      return { periodType: 'year', frequencyType: 'daily', period: 1 }
    case '5Y':
      return { periodType: 'year', period: 5 }
    default:
      return { periodType: selected }
  }
}

const PriceHistory = ({ tokenObject, defaultOrderObject, setOpenModal }) => {
  const [data, setData] = React.useState({})
  const [quoteObject, setQuoteObject] = React.useState({})
  const [variant, setVariant] = React.useState('variant1')
  const [selected, setSelected] = React.useState('1D')

  const { defaultValuesObject = {} } = defaultOrderObject || {}
  const { symbol = '' } = defaultValuesObject || {}
  const { candles = [] } = data || {}
  const { reference = {}, quote = {}, regular = {} } = quoteObject || {}
  const { closePrice = 0 } = quote || {}
  const { description = '' } = reference || {}
  const { regularMarketTradeTime = 0, regularMarketLastPrice = 0 } = regular || {}
  const date = String(new Date(regularMarketTradeTime || Date.now()))
  const firstClose = candles && candles.length > 0 ? candles[0].close : 0
  const priceChange = (parseValue(regularMarketLastPrice) - parseValue(selected === '1D' ? closePrice : firstClose)).toFixed(2)
  const percentChange = ((parseValue(priceChange) / parseValue(selected === '1D' ? closePrice : firstClose)) * 100).toFixed(2)
  
  const handleGetPriceHistory = async () => {
    const { access_token = '' } = tokenObject || {}
    if (!access_token) return
    const objectValue = getObjectValue(selected)
    const handleQuote = (value) => setQuoteObject(value[symbol] || {})
    await handleGetSchwabData(access_token, '/pricehistory', { symbol: symbol, endDate: Date.now(), ...objectValue }, setData)
    await handleGetSchwabData(access_token, '/quotes', { symbols: [symbol] }, handleQuote)
  }

  const handleTradeClick = () => {
    setOpenModal('trade')
  }

  React.useEffect(() => {
    if (selected && symbol) {
      handleGetPriceHistory()
    } else {
      setData({})
      setQuoteObject({})
    }
  }, [selected])

  React.useEffect(() => {
    setSelected(symbol ? '1D' : '')
  }, [symbol])

  return (
    <>
      <div style={{ display: 'flex', width: '100%', height: '84px', background: 'white' }}>
        <div style={{ display: 'flex', flexDirection: 'column', margin: '8px 0px 0px 8px' }}>
          <div className='btn-group' style={{ display: 'flex', width: '100%', justifyContent: 'start', alignItems: 'center', marginBottom: '8px' }}>
            <button style={getTabStyle(variant, 'variant1')} value='variant1' onClick={(e) => setVariant(e.target.value)}>Variant 1</button>
            <button style={getTabStyle(variant, 'variant2')} value='variant2' onClick={(e) => setVariant(e.target.value)}>Variant 2</button>
          </div>
          <div className='btn-group' style={{ display: 'flex', width: '100%', justifyContent: 'start', alignItems: 'center' }}>
            {['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y'].map((name) => <button key={name} style={getTabStyle(selected, name)} value={name} onClick={(e) => setSelected(e.target.value)}>{name}</button>)}
          </div>
        </div>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <h3 style={{ display: 'flex', margin: 0, alignItems: 'center', paddingRight: '8px' }}>{`${symbol} (${regularMarketLastPrice.toFixed(2, 0)})`}</h3>
              <h5 style={{ display: 'flex', margin: 0, alignItems: 'center', color: priceChange > 0 ? green : red }}>
                {priceChange > 0 ? `+${priceChange} (${percentChange}%)` : `${priceChange} (${percentChange}%)`}
              </h5>
            </div>
            <small style={{ display: 'flex', margin: 0, alignItems: 'center' }}>{description}</small>
            <small style={{ display: 'flex', margin: 0, alignItems: 'center' }}>{date.substring(0, date.length - 42)}</small>
          </div>
        </div>
        <div className='btn-group' style={{ display: 'flex', justifyContent: 'end', alignItems: 'center', marginRight: '8px'  }}>
          <button style={{ padding: '8px', borderRadius: '4px' }} onClick={handleTradeClick}>Trade</button>
        </div>
      </div>
      <GraphDisplay selected={selected} variant={variant} data={data} quoteObject={quoteObject} priceChange={priceChange} />
    </>
  )
}

export default PriceHistory
