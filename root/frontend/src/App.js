import React from 'react'
import './Styles/elementStyles.css'
import './Styles/componentStyles.css'
import Login from './Login'
import Home from './components/Home'
import Orders from './components/Orders'
import Transactions from './components/Transactions'
import { DropdownMenu } from './components/StandardComponents'

const App = () => {
  const [page, setPage] = React.useState('home')
  const [tokenObject, setTokenObject] = React.useState({})

  const handlePageClick = (newPage) => {
    setPage(newPage)
    document.getElementById('Menu.Dropdown').classList.toggle('show')
  }

  const menuOptions = [
    { name: 'home', label: 'Home', handler: handlePageClick},
    { name: 'orders', label: 'Orders', handler: handlePageClick},
    { name: 'transactions', label: 'Transactions', handler: handlePageClick}
  ]

  return (
    <>
      <div className='header'>
        <DropdownMenu id='Menu.Dropdown' label='menu' menuOptions={menuOptions} selected={page} />
        <h1>TradingGPT</h1>
        <Login setTokenObject={setTokenObject} />
      </div>
      {page === 'home' && <Home tokenObject={tokenObject} />}
      {page === 'orders' && <Orders tokenObject={tokenObject} />}
      {page === 'transactions' && <Transactions tokenObject={tokenObject} />}
    </>
  )
}

export default App
