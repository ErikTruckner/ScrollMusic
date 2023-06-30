import React, { useEffect, useRef } from 'react'
import { PositionalAudio as ThreePositionalAudio } from 'three'

const PositionalAudio = ({ url, loop, distance, autoplay, position }) => {
  const audioRef = useRef()

  useEffect(() => {
    const audioLoader = new THREE.AudioLoader()
    const audioListener = new THREE.AudioListener()

    const audio = new ThreePositionalAudio(audioListener)
    audioRef.current = audio

    audioLoader.load(url, (buffer) => {
      audio.setBuffer(buffer)
      audio.setLoop(loop)
      audio.setRefDistance(distance)
      if (autoplay) {
        audio.play()
      }
    })

    return () => {
      audio.stop()
      audio.listener.context.suspend()
    }
  }, [])

  return <positionalAudio ref={audioRef} position={position} />
}

export default PositionalAudio
