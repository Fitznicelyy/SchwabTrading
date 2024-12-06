import React from 'react'
import axios from 'axios'

const parseData = (value) => {
  try {
    JSON.parse(value)
  } catch (error) {
    console.log('Parse error: ' + value)
    return value
  }
  return JSON.parse(value)
}

const parseString = (string) => {
  const parsedString = string.replace(/\(.*\.com\)|\r|\n|<.*>|http.*|….*/g, '')
  return parsedString
}

const getDates = (startDate, endDate) => {
  const dates = []
  let currentDate = startDate
  while (currentDate <= endDate) {
    const date = new Date(currentDate).toISOString().split('T')[0]
    dates.push(date)
    currentDate += 86400000
  }
  return dates
}

const NewsSentiment = () => {
  const [data, setData] = React.useState([])
  const [loading, setLoading] = React.useState(false)

  const handleTodaysNews = async (todaysNews, date) => {
    const todaysSymbolRatings = todaysNews && todaysNews.length > 0 && todaysNews.reduce((acc, { sentiment, symbol }) => {
      const newAcc = { ...acc }
      const assignment = sentiment === 'positive' ? 1 : sentiment === 'negative' ? -1 : 0
      newAcc[symbol] = symbol in newAcc ? { rating: newAcc[symbol].rating + assignment, aggregate: newAcc[symbol].aggregate + 1 } : { rating: assignment, aggregate: 1 }
      return newAcc
    }, {})
    await Promise.all(Object.entries(todaysSymbolRatings).map(async ([symbol, symbolObject]) => {
      const { rating, aggregate } = symbolObject
      const data = { date, symbol, rating, aggregate }
      await axios
        .post('https://127.0.0.1:8000/api/symbolRating/', data)
        .catch((err) => console.log(err))
    }))
  }

  const processData = (data, titles) => {
    const removeExtraneous = data.replace(/"|'|\n| /g, '')
    const processSymbol = removeExtraneous.replace(/symbol:.*?\}/g, (string) => {
      const removeExtra = string.replace(/symbol:|}/g, '')
      const symbol = removeExtra.match(/(\w+)$/)[0]
      return `symbol:${symbol}}`
    })
    const quotedString = processSymbol.replace(/\w+/g, (str) => `"${str}"`)
    const splitObjects = quotedString.match(/\{.*?\}/g)
    const parsedData = splitObjects.map((data) => parseData(data))
    const processedData = parsedData.reduce((acc, data, i) => {
      if (typeof data !== 'object') return acc
      const { sentiment = '', symbol = '' } = data || {}
      return symbol === 'null' || !titles[i] ? acc : [...acc, { title: titles[i], sentiment, symbol }]
    }, [])
    return processedData
  }

  const filterData = async (data, loadedNews) => {
    const loadedNewsTitles = loadedNews && loadedNews.length > 0 ? loadedNews.map(({ title }) => title) : []
    const newsContent = []
    for(let i = 0; i < data.length; i += 20) {
      const splicedData = [...data].splice(i, 20)
      const newContentObject = splicedData && splicedData.length > 0
        ? splicedData.reduce((acc, object) => {
          const { params = [], titles = [] } = acc || {}
          const { title, content, description } = object || {}
          const parsedDescription = parseString(description || '')
          const parsedContent = parseString(content || '')
          const allTitles = [...loadedNewsTitles, ...titles]
          const descriptionString = parsedDescription.length > parsedContent.length ? parsedDescription : parsedContent
          const prompt = `title: ${title}, description: ${descriptionString}`
          const newObject = { params: [...params, prompt], titles: [...titles, title] }
          return title === '[Removed]' || allTitles.includes(title) ? acc : newObject
        }, { params: [], titles: [] })
        : { params: [], titles: [] }
      newsContent.push(newContentObject)
    }
    const allSentiment = await axios.all(newsContent.map(({ params }) => axios.get('https://127.0.0.1:8000/api/get_sentiment/', { params })))
    const allProcessed = allSentiment.reduce((acc, { data }, i) => {
      const stringData = Array.isArray(data) ? JSON.stringify(data).replace(/\[|\]/g, '') : data
      const processedData = processData(stringData, newsContent[i].titles)
      return [...acc, ...processedData]
    }, [])
    return allProcessed
  }

  const handleGetNews = async (date) => {
    setLoading(() => true)
    const allNews = await axios.all([
      axios.get('https://127.0.0.1:8000/api/get_news/', { params: { date, fromTime: '00:00:00', toTime: '07:59:59' }}),
      axios.get('https://127.0.0.1:8000/api/get_news/', { params: { date, fromTime: '08:00:00', toTime: '08:59:59' }}),
      axios.get('https://127.0.0.1:8000/api/get_news/', { params: { date, fromTime: '09:00:00', toTime: '09:59:59' }}),
      axios.get('https://127.0.0.1:8000/api/get_news/', { params: { date, fromTime: '10:00:00', toTime: '10:59:59' }}),
      axios.get('https://127.0.0.1:8000/api/get_news/', { params: { date, fromTime: '11:00:00', toTime: '11:59:59' }}),
      axios.get('https://127.0.0.1:8000/api/get_news/', { params: { date, fromTime: '12:00:00', toTime: '12:59:59' }}),
      axios.get('https://127.0.0.1:8000/api/get_news/', { params: { date, fromTime: '13:00:00', toTime: '13:59:59' }}),
      axios.get('https://127.0.0.1:8000/api/get_news/', { params: { date, fromTime: '14:00:00', toTime: '14:59:59' }}),
      axios.get('https://127.0.0.1:8000/api/get_news/', { params: { date, fromTime: '15:00:00', toTime: '15:59:59' }}),
      axios.get('https://127.0.0.1:8000/api/get_news/', { params: { date, fromTime: '16:00:00', toTime: '23:59:59' }})
    ])
    const todaysNews = await allNews.reduce(async (promise, { data: { articles } }) => {
      return promise.then(async (acc) => {
        const result = await filterData(articles, acc)
        return [...acc, ...result]
      })
    }, Promise.resolve([]))
    await handleTodaysNews(todaysNews, date)
    setLoading(() => false)
    handleDateChange()
  }

  const handleDateChange = () => {
    const startDate = document.getElementById('startDate').value
    const endDate = document.getElementById('endDate').value
    if (startDate && endDate) {
      axios
        .get('https://127.0.0.1:8000/api/load_symbol_ratings/', { params: { startDate, endDate }})
        .then((res) => setData(res.data))
        .catch((err) => console.log(err))
    }
  }

  const handleDeleteAllSymbolRatings = async () => {
    if (window.confirm('Are you sure you want to clear all?')) {
      axios
        .get('https://127.0.0.1:8000/api/delete_all_symbol_ratings/')
        .catch((err) => console.log(err))
    }
  }

  const handleLoadSymbolRatings = async (e) => {
    e.preventDefault()
    const startDateValue = document.getElementById('startDate').value
    const endDateValue = document.getElementById('endDate').value
    if (startDateValue && endDateValue) {
      const startDate = new Date(startDateValue)
      const endDate = new Date(endDateValue)
      const dates = getDates(startDate.getTime(), endDate.getTime())
      await dates.reduce(async (promise, date) => {
        return promise.then(async () => {
          await handleGetNews(date)
        })
      }, Promise.resolve())
    }
  }

  return { handleLoadSymbolRatings, handleDeleteAllSymbolRatings, handleDateChange, data, loading }
}

export default NewsSentiment
