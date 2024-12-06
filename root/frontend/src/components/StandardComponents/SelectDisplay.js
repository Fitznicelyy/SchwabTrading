import React from 'react'

const SelectDisplay = ({
  id = 'SelectDisplay.select',
  value = '',
  options = [],
  handleChange = () => {},
  className = '',
  style = {},
  disabled = false
}) => {
  const [input, setInput] = React.useState('')

  const selectableOptions = value ? options : ['', ...options]

  React.useEffect(() => { input !== value && setInput(value || '') }, [value])

  return (
    <select disabled={disabled} style={style} className={className} id={id} value={input || ''} onChange={(e) => handleChange(e.target.value)}>
      {selectableOptions.map((option, i) => <option key={i} value={option}>{option}</option>)}
    </select>
  )
}

export default SelectDisplay
