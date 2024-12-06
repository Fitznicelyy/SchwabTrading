const findDataItemByName = (data = {}, name) => {
  const array = Object.entries(data).find(([k]) => k.includes(name))
  return Array.isArray(array) ? array[1] : null
}

const parseValue = (value) => {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const valueIsValid = (value) => value || value === false || value === '' || value === 0

const sortByName = (a, b, sortName, type) => {
  switch (type) {
    case 'string':
      return (a[sortName] || '').toString().localeCompare((b[sortName] || '').toString(), 'en', { sensitivity: 'base', numeric: true })
    case 'number':
      return (b[sortName] || 0) - (a[sortName] || 0)
    default:
      return (a[sortName] || '').toString().localeCompare((b[sortName] || '').toString(), 'en', { sensitivity: 'base', numeric: true })
  }
}

export {
  findDataItemByName,
  parseValue,
  valueIsValid,
  sortByName
}