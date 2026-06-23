import { useEffect, useState, useCallback } from 'react'
import api from '../api/axios'
import ClienteForm from '../components/ClienteForm'
import ClienteList from '../components/ClienteList'
import Modal from '../components/Modal'
import Toast from '../components/Toast'

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const [selecionado, setSelecionado] = useState(null)
  const [editando, setEditando] = useState(false)
  const [formEdit, setFormEdit] = useState({ nome: '', email: '', telefone: '' })
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
      setSidebarAberta(false)
      carregar()
    } catch {
      mostrarToast('Erro ao salvar cliente', 'erro')
    }
  }

  async function deletar(id) {
    try {
      await api.delete(`/clientes/${id}`)
      mostrarToast('Cliente removido com sucesso!', 'sucesso')
      if (selecionado?.id === id) setSelecionado(null)
      carregar()
    } catch {
      mostrarToast('Erro ao remover cliente', 'erro')
    }
  }

  async function atualizar(id, dados) {
    try {
      await api.put(`/clientes/${id}`, dados)
      mostrarToast('Cliente atualizado com sucesso!', 'sucesso')
      setSelecionado(null)
      setEditando(false)
      carregar()
    } catch {
      mostrarToast('Erro ao atualizar cliente', 'erro')
    }
  }

  function abrirDetalhes(cliente) {
    setSelecionado(cliente)
    setFormEdit({ nome: cliente.nome, email: cliente.email, telefone: cliente.telefone || '' })
    setEditando(false)
  }

  function handleEditChange(e) {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value })
  }

  function handleEditSubmit(e) {
    e.preventDefault()
    atualizar(selecionado.id, formEdit)
  }

  useEffect(() => {
    carregar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="max-w-2xl mx-auto px-4">
      <Toast mensagem={toast.mensagem} tipo={toast.tipo} onFechar={() => setToast({ mensagem: '', tipo: '' })} />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Clientes</h1>
        <span className="text-sm text-gray-500">{clientes.length} cliente(s)</span>
      </div>
      {carregando ? (
        <p className="text-center text-gray-500 mt-8">Carregando...</p>
      ) : (
        <ClienteList clientes={clientes} onDeletar={deletar} onClick={abrirDetalhes} />
      )}

      <button
        onClick={() => setSidebarAberta(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl transition hover:scale-110 z-30 cursor-pointer"
      >
        +
      </button>

      <Modal aberta={sidebarAberta} onFechar={() => setSidebarAberta(false)} titulo="Novo Cliente">
        <ClienteForm onSalvar={salvar} />
      </Modal>

      <Modal aberta={!!selecionado} onFechar={() => { setSelecionado(null); setEditando(false) }} titulo="Detalhes do Cliente">
        {selecionado && !editando && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Nome</label>
              <p className="text-gray-800 font-medium">{selecionado.nome}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Email</label>
              <p className="text-gray-800">{selecionado.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Telefone</label>
              <p className="text-gray-800">{selecionado.telefone || '—'}</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditando(true)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg p-2.5 transition cursor-pointer"
              >
                Editar
              </button>
              <button
                onClick={() => deletar(selecionado.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg p-2.5 transition cursor-pointer"
              >
                Remover
              </button>
            </div>
          </div>
        )}
        {selecionado && editando && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Nome</label>
              <input
                name="nome"
                value={formEdit.nome}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                name="email"
                value={formEdit.email}
                onChange={handleEditChange}
                type="email"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Telefone</label>
              <input
                name="telefone"
                value={formEdit.telefone}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg p-2.5 transition cursor-pointer"
              >
                Salvar
              </button>
              <button
                type="button"
                onClick={() => setEditando(false)}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg p-2.5 transition cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  )
}
