import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
// import extension from '@theatre/r3f/dist/extension'
// import studio from '@theatre/studio'

// studio.initialize()
// studio.extend(extension)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Suspense fallback={null}>
      <App />
    </Suspense>
  </React.StrictMode>
)
