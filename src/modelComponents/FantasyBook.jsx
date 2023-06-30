import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

const actionNames = ['The Life']

const FantasyBook = () => {
  const model = useGLTF('./fantasyBook/fantasyBookModded-v1.glb')

  const animations = useAnimations(model.animations, model.scene)

  useFrame(() => {
    const action = animations.actions['The Life']
    action.play()
  })

  return (
    <mesh>
      <primitive object={model.scene} />
    </mesh>
  )
}

export default FantasyBook
