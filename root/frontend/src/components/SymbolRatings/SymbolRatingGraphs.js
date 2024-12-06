import React from 'react'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line } from 'react-chartjs-2'

const green = 'rgb(0,128,0)'
const greenShade = 'rgb(0,128,0,0.3)'

const red = 'rgb(255,0,0)'
const redShade = 'rgb(255,0,0,0.3)'

ChartJS.register(...registerables)

const getTabStyle = (state, value) => ({ padding: '8px', background: state === value ? 'var(--dark)' : null})

const getDataset = (graphData, symbol, labels, variant) => {
  const data = labels.reduce((acc, label, i) => {
    return [
      ...acc,
      {
        x: label,
        y: symbol in graphData[label]
          ? variant === 'rating' && i > 0
            ? acc[i - 1].y + parseInt(graphData[label][symbol][variant])
            : parseInt(graphData[label][symbol][variant])
          : variant === 'rating' ? i > 0 ? acc[i - 1].y : 0 : 0
      }
    ]
  }, [])
  const positive = data[0].y === data[data.length - 1].y ? data[0].y >= 0 : data[0].y <= data[data.length - 1].y 
  return [{
    data,
    borderColor: positive ? green : red,
    fill: true,
    lineTension: 0,
    fill: {
      target: 'origin',
      above: positive ? greenShade : redShade,
      below: positive ? greenShade : redShade
    }
  }]
}

const GraphDisplay = ({ graphData, symbol, variant }) => {
  const [chartData, setChartData] = React.useState({ datasets: [] })

  React.useEffect(() => {
    if (Object.keys(graphData).length > 0 && symbol) {
      const getChartData = async () => {
        const labels = Object.keys(graphData)
        const datasets = getDataset(graphData, symbol, labels, variant)
        const newChartData = { labels, datasets }
        setChartData(newChartData)
      }
      getChartData()
    }
  }, [graphData, symbol, variant])

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: { display: true, },
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 }
      }
    }
  }

  return (
    <div style={{ display: 'flex', width: '100%', height: 'calc(100% - 84px)' }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

const SymbolRatingGraphs = ({ graphData, symbol }) => {
  const [variant, setVariant] = React.useState('rating')

  return (
    <>
      <div style={{ display: 'flex', width: '100%', height: '84px', alignItems: 'space-between', background: 'white' }}>
        <div style={{ display: 'flex', flexDirection: 'column', margin: '8px 0px 0px 8px' }}>
          <div className='btn-group' style={{ display: 'flex', width: '100%', justifyContent: 'start', alignItems: 'center', marginBottom: '8px' }}>
            <button style={getTabStyle(variant, 'rating')} value='rating' onClick={(e) => setVariant(e.target.value)}>Ratings</button>
            <button style={getTabStyle(variant, 'aggregate')} value='aggregate' onClick={(e) => setVariant(e.target.value)}>Aggregates</button>
          </div>
        </div>
        <div style={{ display: 'flex', width: '100%', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'start' }}>
            <h3 style={{ display: 'flex', margin: 0, alignItems: 'center', paddingRight: '8px' }}>{symbol}</h3>
          </div>
        </div>
      </div>
      <GraphDisplay graphData={graphData} symbol={symbol} variant={variant} />
    </>
  )
}

export default SymbolRatingGraphs
