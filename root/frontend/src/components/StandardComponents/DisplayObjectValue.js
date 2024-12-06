import React from 'react'
import InputDisplay from './InputDisplay'
import SelectDisplay from './SelectDisplay'
import './standardComponentStyles.css'

export const PrimitiveDisplay = ({ name, value, type, defaultValue, handleUpdate }) => (
  <dt style={{ display: 'flex', alignItems: 'center' }}>
    <label size='small' className='object-value-label'>{name}</label>
    <div style={{ display: 'flex', width: type === 'checkbox' ? '19px' : '400px' }}>
      <InputDisplay id={`PrimitiveDisplay.${name}`} value={value} type={type} defaultValue={defaultValue} handleChange={handleUpdate} />
    </div>
  </dt>
)

export const EnumDisplay = ({ name, value, options, handleUpdate }) => (
  <dt style={{ display: 'flex', alignItems: 'center' }}>
    <label size='small' className='object-value-label'>{name}</label>
    <div style={{ display: 'flex', width: '400px' }}>
      <SelectDisplay id={`EnumDisplay.${name}`} value={value} options={options} handleChange={handleUpdate} />
    </div>
  </dt>
)

const TimestampDisplay = ({ name, value, handleUpdate }) => {
  const isoDate = value || new Date(Date.now()).toISOString()
  const date = isoDate.replace(/T.*Z/g, '')
  const time = isoDate.replace(/.*T|\..*Z/g, '')

  const handleDateChange = (newDate) => {
    const newISODate = `${newDate}T${time}.000Z`
    handleUpdate(newISODate)
  }
  const handleTimeChange = (newTime) => {
    const newISODate = `${date}T${newTime}.000Z`
    handleUpdate(newISODate)
  }

  React.useEffect(() => {
    if (value) return
    const newISODate = `${date}T${time}.000Z`
    handleUpdate(newISODate)
  }, [])

  return (
    <dt style={{ display: 'flex', alignItems: 'center' }}>
      <label size='small' className='object-value-label'>{name}</label>
      <div style={{ display: 'flex', width: '400px' }}>
        <InputDisplay id={`TimestampDisplay.${name}.Date`} value={date} type='date' handleChange={handleDateChange} />
        <InputDisplay id={`TimestampDisplay.${name}.Time`} value={time} type='time' handleChange={handleTimeChange} />
      </div>
    </dt>
  )
}

const KeyValueArrayDisplay = ({ name, value, handleUpdate }) => {
  const [inputValue, setInputValue] = React.useState('')
  const handleAdd = (v) => {
    const newValue = [...value]
    newValue.push(v)
    setInputValue(v)
    handleUpdate(newValue)
  }
  const handleRemove = (i) => {
    const newValue = [...value]
    newValue.splice(i, 1)
    handleUpdate(newValue)
  }

  React.useEffect(() => {
    inputValue && setInputValue('')
  }, [inputValue])

  return (
    <dt style={{ display: 'flex', alignItems: 'center' }}>
      <label size='small' className='object-value-label'>{name}</label>
      <div style={{ display: 'flex', width: '400px' }}><InputDisplay id={`KeyValueArrayDisplay.${name}`} value={inputValue} handleChange={handleAdd} /></div>
      <div style={{ display: 'flex', marginLeft: '8px' }}>
        {value && value.length > 0 && value.map((v, i) => <button key={i} className='key-value-array-button' sx={{ fontSize: 'small' }} onClick={() => handleRemove(i)}>{JSON.stringify(v)}</button>)}
      </div>
    </dt>
  )
}

const DynamicTypeDisplay = ({ name, value, type, typeValue, update }) => {
  const handleUpdate = (newValue) => {
    const newBuildObject = {}
    newBuildObject[name] = newValue
    update(newBuildObject)
  }
  switch (type) {
    case 'timestamp':
      return <TimestampDisplay name={name} value={value} type={type} handleUpdate={handleUpdate} />
    case 'string':
      return <PrimitiveDisplay name={name} value={value} type={type} defaultValue='' handleUpdate={handleUpdate} />
    case 'number':
      return <PrimitiveDisplay name={name} value={value} type={type} defaultValue={0} handleUpdate={handleUpdate} />
    case 'boolean':
      return <PrimitiveDisplay name={name} value={value} type='checkbox' defaultValue={false} handleUpdate={handleUpdate} />
    case 'enum':
      return <EnumDisplay name={name} value={value} options={typeValue} handleUpdate={handleUpdate} />
    case 'keyValueArray':
      return <KeyValueArrayDisplay name={name} value={value} handleUpdate={handleUpdate} />
    default:
      return null
  }
}

const CargoDisplay = ({ name, type, object, objectTypes, update }) => {
  const handleUpdate = (newObject) => {
    const newBuildObject = {}
    newBuildObject[name] = type === 'cargoArray'
      ? [Object.assign({}, object, newObject)]
      : Object.assign({}, object, newObject)
    update(newBuildObject)
  }
  return (
    <div>
      <dt><label>{name}</label></dt>
      <dd>
        <dl style={{ margin: 0 }}>
          <DisplayObjectValue object={object} objectTypes={objectTypes} update={handleUpdate} />
        </dl>
      </dd>
    </div>
  )
}

const DisplayObjectValue = ({ object, objectTypes, update }) => (
  Object.entries(object).map(([name, value]) => {
    const typeValue = objectTypes[name]
    const type = Array.isArray(typeValue)
      ? typeof typeValue[0] === 'string'
        ? 'enum'
        : 'cargoArray'
      : typeof typeValue === 'object'
        ? 'cargo'
        : typeValue
    return (
      type.includes('cargo')
        ? <CargoDisplay key={name} name={name} type={type} object={type === 'cargoArray' ? value[0] : value} objectTypes={type === 'cargoArray' ? typeValue[0] : typeValue} update={update} />
        : <DynamicTypeDisplay key={name} name={name} value={value} type={type} typeValue={typeValue} update={update} />
    )
  })
)

export default DisplayObjectValue
