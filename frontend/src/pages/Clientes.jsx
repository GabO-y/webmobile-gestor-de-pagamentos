import { useEffect, useState, useCallback } from 'react'
import api from '../api/axios'
import ClienteForm from '../components/ClienteForm'
import ClienteList from '../components/ClienteList'
import Toast from '../components/Toast'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [toast, setToast] = useState({ mensagem: '', tipo: '' })

  const mostrarToast = useCallback((mensagem, tipo) => {
    setToast({ mensagem, tipo })
  }, [])

  async function carregar() {
    try {
      setCarregando(true)
      const response = await api.get('/clientes')
      setClientes(response.data)
    } catch {
      mostrarToast('Erro ao carregar clientes', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  async function salvar(dados) {
    try {
      await api.post('/clientes', dados)
      mostrarToast('Cliente cadastrado com sucesso!', 'sucesso')
      carregar()
    } catch {
      mostrarToast('Erro ao salvar cliente', 'erro')
    }
  }

  async function deletar(id) {
    try {
      await api.delete(`/clientes/${id}`)
      mostrarToast('Cliente removido com sucesso!', 'sucesso')
      carregar()
    } catch {
      mostrarToast('Erro ao remover cliente', 'erro')
    }
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Toast mensagem={toast.mensagem} tipo={toast.tipo} onFechar={() => setToast({ mensagem: '', tipo: '' })} />
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Clientes</h1>
      <ClienteForm onSalvar={salvar} />
      {carregando ? (
        <p className="text-center text-gray-500 mt-8">Carregando...</p>
      ) : (
        <ClienteList clientes={clientes} onDeletar={deletar} />
      )}
    </div>
  )
}
