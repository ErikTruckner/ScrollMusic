import React, { useState, useEffect } from 'react'

const MasterVolumeControl = () => {
  const [volume, setVolume] = useState(0.5)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    const handleMouseUp = () => {
      setIsDragging(false)
    }

    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [])

  const handleMouseDown = () => {
    setIsDragging(true)
  }

  const handleMouseMove = (event) => {
    if (!isDragging) return

    const volumeBar = document.getElementById('volume-bar')
    const boundingRect = volumeBar.getBoundingClientRect()
    const { left, width } = boundingRect
    const mouseX = event.clientX

    let newVolume = (mouseX - left) / width
    newVolume = Math.max(0, Math.min(1, newVolume)) // Clamp volume between 0 and 1
    setVolume(newVolume)
    updateAudioVolume(newVolume)
  }

  const updateAudioVolume = (newVolume) => {
    const audioElements = document.getElementsByTagName('audio')
    for (let i = 0; i < audioElements.length; i++) {
      audioElements[i].volume = newVolume
    }
  }

  return (
    <div
      id='volume-bar'
      style={{
        width: '200px',
        height: '8px',
        background: '#ccc',
        borderRadius: '4px',
        cursor: 'pointer',
      }}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}>
      <div
        style={{
          width: `${volume * 100}%`,
          height: '100%',
          background: '#ff0000',
          borderRadius: '4px',
        }}
      />
    </div>
  )
}

export default MasterVolumeControl
