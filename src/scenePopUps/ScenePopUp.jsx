import React, { useState } from 'react'

function ScenePopUp({ header }) {
  const [isVisible, setIsVisible] = useState(true)

  const handleExit = () => {
    setIsVisible(false)
  }

  return <>{isVisible && <h1 className='popUp-screen-h1'>{header}</h1>}</>
}

export default ScenePopUp
