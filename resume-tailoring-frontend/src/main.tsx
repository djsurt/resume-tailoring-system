import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './pages/App.tsx'
import Landing from './pages/Landing.tsx'
import ResumeStorage from './pages/ResumeStorage.tsx'
// import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
   <BrowserRouter>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/analyze' element={<App />} />
        <Route path='/storage' element={<ResumeStorage />} />
      </Routes>
   </BrowserRouter>
  </StrictMode>,
)
