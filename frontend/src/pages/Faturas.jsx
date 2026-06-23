import { useEffect, useState, useCallback } from 'react'
import api from '../api/axios'
import FaturaForm from '../components/FaturaForm'
import FaturaList from '../components/FaturaList'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

export default function Faturas() {
  const [faturas, setFaturas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const [toast, setToast] = useState({ mensagem: '', tipo: '' })

  const mostrarToast = useCallback((mensagem, tipo) => {
    setToast({ mensagem, tipo })
  }, [])

  async function carregar() {
    try {
      setCarregando(true)
      const response = await api.get('/faturas')
      setFaturas(response.data)
    } catch {
      mostrarToast('Erro ao carregar faturas', 'erro')
    } finally {
      setCarregando(false)
    }
  }

  async function salvar(dados) {
    try {
      await api.post('/faturas', dados)
      mostrarToast('Fatura cadastrada com sucesso!', 'sucesso')
      setSidebarAberta(false)
      carregar()
    } catch {
      mostrarToast('Erro ao salvar fatura', 'erro')
    }
  }

  async function deletar(id) {
    try {
      await api.delete(`/faturas/${id}`)
      mostrarToast('Fatura removida com sucesso!', 'sucesso')
      carregar()
    } catch {
      mostrarToast('Erro ao remover fatura', 'erro')
    }
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Toast mensagem={toast.mensagem} tipo={toast.tipo} onFechar={() => setToast({ mensagem: '', tipo: '' })} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Faturas</h1>
        <span className="text-sm text-gray-500">{faturas.length} fatura(s)</span>
      </div>
      {carregando ? (
        <p className="text-center text-gray-500 mt-8">Carregando...</p>
      ) : (
        <FaturaList faturas={faturas} onDeletar={deletar} />
      )}

      <button
        onClick={() => setSidebarAberta(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl transition hover:scale-110 z-30 cursor-pointer"
      >
        +
      </button>

      <Modal aberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} titulo="Nova Fatura">
        <FaturaForm onSalvar={salvar} />
      </Modal>
    </div>
  )
}
