import React from 'react'

const Modal = ({ state, setState, content }) => {
  const foregroundStyle = {
    display:  state ? 'block' : 'none',
    width: '100%',
    height: '80%',
    background: 'white',
    overflow: 'auto'
  }

  const backgroundStyle = {
    display:  state ? 'block' : 'none',
    position: 'fixed',
    zIndex: 1,
    paddingTop: '100px',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.4)'
  }

  return (
    <div style={backgroundStyle} id='modalBackground' onClick={() => setState('')}>
      <div style={foregroundStyle} id='modalForeground' onClick={(e) => e.stopPropagation()}>
        {state ? content : null}
      </div>
    </div>
  )
}

export default Modal
