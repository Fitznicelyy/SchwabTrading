import React from 'react'
import axios from 'axios'

const redirectURI = 'https://127.0.0.1:8000'
const url = `https://api.schwabapi.com/v1/oauth/authorize?client_id=${process.env.REACT_APP_SCHWAB_API_KEY}&redirect_uri=${redirectURI}`

const Login = ({ setTokenObject }) => {
  const [code, setCode] = React.useState('')

  const handleGetToken = async (code) => {
    await axios
      .get('https://127.0.0.1:8000/api/get_token/', { params: { code }})
      .then(async (res) => setTokenObject(res.data))
      .catch((err) => console.log(err))
  }

  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.has('code')) {
      const newCode = searchParams.get('code')
      if (newCode !== code) {
        setCode(newCode)
        handleGetToken(newCode)
      }
    }
  }, [])

  return <a href={url}><button className='standard-button'>login</button></a>
}

export default Login
