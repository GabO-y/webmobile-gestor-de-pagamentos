import { useState } from 'react'

export default function ClienteForm({ onSalvar }) {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSalvar(form)
    setForm({ nome: '', email: '', telefone: '' })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 className="font-semibold text-gray-700">Novo Cliente</h2>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
        <input
          name="nome"
          value={form.nome}
          onChange={handleChange}
          placeholder="Nome do cliente"
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email do cliente"
          type="email"
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Telefone</label>
        <input
          name="telefone"
          value={form.telefone}
          onChange={handleChange}
          placeholder="Telefone (opcional)"
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg p-2.5 transition cursor-pointer"
      >
        Salvar Cliente
      </button>
    </form>
  )
}
