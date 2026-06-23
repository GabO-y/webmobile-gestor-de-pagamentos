import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom'
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

export default function App() {
  const token = localStorage.getItem('token')

  return (
    <BrowserRouter>
      {token && (
        <nav className="bg-blue-600 text-white p-4 flex gap-6 items-center">
          <Link to="/clientes" className="hover:underline">Clientes</Link>
          <Link to="/faturas" className="hover:underline">Faturas</Link>
          <button
            onClick={sair}
            className="ml-auto bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Sair
          </button>
        </nav>
      )}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
        <Route path="/faturas" element={<PrivateRoute><Faturas /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}
