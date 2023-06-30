import React, { useState } from 'react'

function StartScreen() {
  const [isVisible, setIsVisible] = useState(true)

  const handleStart = () => {
    setIsVisible(false)
  }

  return (
    <>
      {isVisible && (
        <div className='start-screen'>
          <h1 className='start-screen-h1'>
            Welcome to Fantasy Adventure!
            <br />
            <br />
            Scroll Up and Down to Navigate!
          </h1>
          <button className='start-button' onClick={handleStart}>
            Start
          </button>
        </div>
      )}
    </>
  )
}

export default StartScreen
