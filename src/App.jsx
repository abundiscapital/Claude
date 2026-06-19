import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import SplashIntro from './components/SplashIntro.jsx'
import Home from './components/client/Home.jsx'
import SearchResults from './components/client/SearchResults.jsx'
import CarDetail from './components/client/CarDetail.jsx'
import Dashboard from './components/pro/Dashboard.jsx'
import Connexion from './components/auth/Connexion.jsx'

export default function App() {
  const [showSplash, setShowSplash] = useState(
    () => sessionStorage.getItem('asphalt:seen-intro') !== '1'
  )

  const dismiss = () => {
    sessionStorage.setItem('asphalt:seen-intro', '1')
    setShowSplash(false)
  }

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashIntro key="splash" onEnter={dismiss} />}
      </AnimatePresence>

      {!showSplash && (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/recherche" element={<SearchResults />} />
            <Route path="/vehicule/:id" element={<CarDetail />} />
            <Route path="/pro" element={<Dashboard />} />
            <Route path="/connexion" element={<Connexion />} />
          </Routes>
          <Footer />
        </>
      )}
    </>
  )
}
