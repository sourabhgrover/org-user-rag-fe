import { Outlet } from 'react-router-dom'
import './App.css'
import SignupForm from './components/SignupForm'
import LandingPage from './pages/Layout.jsx'

function App() {
  return (
    <>
      <Outlet />
    </>
  )
}

export default App
