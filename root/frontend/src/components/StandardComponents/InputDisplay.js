import React from 'react'

const parseValue = (value) => {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const valueIsValid = (value) => value || value === false || value === '' || value === 0

const InputDisplay = ({
  id = 'InputDisplay.input',
  value,
  type = 'text',
  defaultValue = '',
  placeholder = '',
  handleChange = () => {},
  className = '',
  style = {}
}) => {
  const [input, setInput] = React.useState(defaultValue)

  React.useEffect(() => { input !== value && setInput(value) }, [value])

  return (
    <input
      id={id}
      className={className}
      type={type}
      style={style}
      placeholder={placeholder}
      value={valueIsValid(input) ? input : defaultValue}
      onChange={(e) => type === 'checkbox' ? setInput(e.target.checked) : setInput(e.target.value)}
      onBlur={() => parseValue(input) !== defaultValue && handleChange(parseValue(input))}
      onKeyDown={(e) => { if (e.key === 'Enter') document.activeElement.blur() }}
    />
  )
}

export default InputDisplay
