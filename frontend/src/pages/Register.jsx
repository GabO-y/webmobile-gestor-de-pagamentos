import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    try {
      const response = await api.post('/auth/register', form)
      const token = response.data.token
      localStorage.setItem('token', token)
      navigate('/clientes')
    } catch {
      setErro('Erro ao cadastrar. Verifique os dados.')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Criar Conta</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome"
          className="border rounded p-2"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="border rounded p-2"
          required
        />
        <input
          name="senha"
          value={form.senha}
          onChange={handleChange}
          placeholder="Senha"
          type="password"
          className="border rounded p-2"
          required
        />
        {erro && <p className="text-red-500 text-sm">{erro}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white rounded p-2 hover:bg-blue-700"
        >
          Cadastrar
        </button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">
        Ja tem conta? <Link to="/login" className="text-blue-600 hover:underline">Entrar</Link>
      </p>
    </div>
  )
}
