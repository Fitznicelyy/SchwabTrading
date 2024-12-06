import React from 'react'

const DropdownMenu = ({ id, label, menuOptions, selected }) => {
  const handleClick = () => {
    document.getElementById(id).classList.toggle('show')
  }
  return (
    <div className='dropdown'>
      <button className='standard-button' onClick={handleClick}>{label}</button>
      <div id={id} className='dropdown-content'>
        {menuOptions.map(({ name, label, handler }) => (
          <label
            key={label}
            style={{
              backgroundColor: selected && selected === name ? 'var(--main)' : null,
              color: selected && selected === name ? 'white' : null
            }}
            className='dropdown-option'
            onClick={() => handler(name)}
          >
            {label}
          </label>
        ))}
      </div>
    </div>
  )
}

export default DropdownMenu
