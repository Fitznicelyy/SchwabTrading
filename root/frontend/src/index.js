import React from 'react'
import './Styles/globalStyles.css'
import ReactDOM from 'react-dom/client'
import App from './App'

const Root = () => {
  const [dimensions, setDimensions] = React.useState({ width: 'auto', height: 'auto' })

  const handleResize = () => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight - 20  })
  }

  React.useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight - 20  })
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return <div style={{ width: '100%', height: dimensions.height }}><App /></div>
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
