import { useEffect, useState } from 'react'
import api from '../api/axios'
import ClienteForm from '../components/ClienteForm'
import ClienteList from '../components/ClienteList'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [erro, setErro] = useState('')

  async function carregar() {
    try {
      const response = await api.get('/clientes')
      setClientes(response.data)
    } catch {
      setErro('Erro ao carregar clientes')
    }
  }

  async function salvar(dados) {
    try {
      await api.post('/clientes', dados)
      setErro('')
      carregar()
    } catch {
      setErro('Erro ao salvar cliente')
    }
  }

  async function deletar(id) {
    try {
      await api.delete(`/clientes/${id}`)
      setErro('')
      carregar()
    } catch {
      setErro('Erro ao remover cliente')
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Clientes</h1>
      {erro && <p className="text-red-500 text-sm mb-2">{erro}</p>}
      <ClienteForm onSalvar={salvar} />
      <ClienteList clientes={clientes} onDeletar={deletar} />
    </div>
  )
}
