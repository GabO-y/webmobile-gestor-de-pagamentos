import { useState, useEffect } from 'react'
import api from '../api/axios'

export default function FaturaForm({ onSalvar }) {
  const [form, setForm] = useState({
    clienteId: '',
    valor: '',
    vencimento: '',
    status: 'PENDENTE',
  })
  const [clientes, setClientes] = useState([])

  useEffect(() => {
    api.get('/clientes').then((response) => setClientes(response.data))
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSalvar({
      cliente: { id: Number(form.clienteId) },
      valor: Number(form.valor),
      vencimento: form.vencimento,
      status: form.status,
    })
    setForm({ clienteId: '', valor: '', vencimento: '', status: 'PENDENTE' })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
      <h2 className="font-semibold text-gray-700">Nova Fatura</h2>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Cliente</label>
        <select
          name="clienteId"
          value={form.clienteId}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          required
        >
          <option value="">Selecione um cliente</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Valor</label>
        <input
          name="valor"
          value={form.valor}
          onChange={handleChange}
          placeholder="0,00"
          type="number"
          step="0.01"
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Vencimento</label>
        <input
          name="vencimento"
          value={form.vencimento}
          onChange={handleChange}
          type="date"
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        >
          <option value="PENDENTE">Pendente</option>
          <option value="PAGO">Pago</option>
          <option value="ATRASADO">Atrasado</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg p-2.5 transition cursor-pointer"
      >
        Salvar Fatura
      </button>
    </form>
  )
}
