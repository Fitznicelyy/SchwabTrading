import React from 'react'

const TextAreaDisplay = ({ value, handleChange }) => {
  const [input, setInput] = React.useState('')

  React.useEffect(() => { input !== value && setInput(value) }, [value])

  return (
    <textarea
      id='TextAreaDisplay.input'
      value={input || ''}
      onChange={(e) => setInput(e.target.value)}
      onBlur={(e) => handleChange(e.target.value)}
    />
  )
}

export default TextAreaDisplay
