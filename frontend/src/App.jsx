import { BrowserRouter, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import Clientes from './pages/Clientes'
import Faturas from './pages/Faturas'
import Login from './pages/Login'
import Register from './pages/Register'

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/login" />
}

function sair() {
  localStorage.removeItem('token')
  window.location.href = '/login'
}

function Navbar() {
  const location = useLocation()

  const linkClass = (path) =>
    `px-3 py-2 rounded text-sm font-medium transition ${
      location.pathname === path
        ? 'bg-blue-700 text-white'
        : 'text-blue-100 hover:bg-blue-500 hover:text-white'
    }`

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-4">
        <span className="text-white font-bold text-lg mr-4">Gestor de Pagamentos</span>
        <Link to="/clientes" className={linkClass('/clientes')}>Clientes</Link>
        <Link to="/faturas" className={linkClass('/faturas')}>Faturas</Link>
        <button
          onClick={sair}
          className="ml-auto bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded text-sm font-medium transition"
        >
          Sair
        </button>
      </div>
    </nav>
  )
}

export default function App() {
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      {token && <Navbar />}
      <div className="py-6">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
          <Route path="/faturas" element={<PrivateRoute><Faturas /></PrivateRoute>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
