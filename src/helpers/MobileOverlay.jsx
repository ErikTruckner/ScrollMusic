const MobileOverlay = () => {
  const styles = {
    overlay: {
      position: 'absolute',
      width: '393px',
      height: '851px',
      backgroundColor: 'rgba(255, 255, 255, 0.5)',
      border: '2px solid white',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
    },
  }

  return <div style={styles.overlay}></div>
}

export default MobileOverlay
