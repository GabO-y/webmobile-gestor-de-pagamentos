import { useEffect, useState, useCallback } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import { ptBR } from 'date-fns/locale'
import api from '../api/axios'
import FaturaForm from '../components/FaturaForm'
import FaturaList from '../components/FaturaList'
import Modal from '../components/Modal'
import Toast from '../components/Toast'
import { parseDate, formatDate, formatDateBR } from '../utils/date'

registerLocale('pt-BR', ptBR)

const statusEstilos = {
  PENDENTE: 'bg-yellow-100 text-yellow-700',
  PAGO: 'bg-green-100 text-green-700',
  ATRASADO: 'bg-red-100 text-red-700',
}

export default function Faturas() {
  const [faturas, setFaturas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [sidebarAberta, setSidebarAberta] = useState(false)
  const [selecionado, setSelecionado] = useState(null)
  const [editando, setEditando] = useState(false)
  const [formEdit, setFormEdit] = useState({ clienteId: '', valor: '', vencimento: null, status: '' })
  const [clientes, setClientes] = useState([])
  const [toast, setToast] = useState({ mensagem: '', tipo: '' })

  const mostrarToast = useCallback((mensagem, tipo) => {
    setToast({ mensagem, tipo })
  }, [])

  async function carregar() {
    try {
      setCarregando(true)
      const [resFaturas, resClientes] = await Promise.all([
        api.get('/faturas'),
        api.get('/clientes'),
      ])
      setFaturas(resFaturas.data)
      setClientes(resClientes.data)
    } catch {
      mostrarToast('Erro ao carregar dados', 'erro')
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
      if (selecionado?.id === id) setSelecionado(null)
      carregar()
    } catch {
      mostrarToast('Erro ao remover fatura', 'erro')
    }
  }

  async function atualizar(id, dados) {
    try {
      // O backend não tem PUT para faturas, faremos um POST (criar nova) e deletar a antiga
      await api.post('/faturas', dados)
      await api.delete(`/faturas/${id}`)
      mostrarToast('Fatura atualizada com sucesso!', 'sucesso')
      setSelecionado(null)
      setEditando(false)
      carregar()
    } catch {
      mostrarToast('Erro ao atualizar fatura', 'erro')
    }
  }

  function abrirDetalhes(fatura) {
    setSelecionado(fatura)
    setFormEdit({
      clienteId: fatura.cliente?.id || '',
      valor: fatura.valor,
      vencimento: parseDate(fatura.vencimento),
      status: fatura.status,
    })
    setEditando(false)
  }

  function handleEditChange(e) {
    setFormEdit({ ...formEdit, [e.target.name]: e.target.value })
  }

  function handleEditSubmit(e) {
    e.preventDefault()
    if (!formEdit.vencimento) return
    atualizar(selecionado.id, {
      cliente: { id: Number(formEdit.clienteId) },
      valor: Number(formEdit.valor),
      vencimento: formatDate(formEdit.vencimento),
      status: formEdit.status,
    })
  }

  function nomeCliente(fatura) {
    if (fatura.cliente?.nome) return fatura.cliente.nome
    const c = clientes.find((c) => c.id === fatura.cliente?.id)
    return c?.nome || '—'
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
        <FaturaList faturas={faturas} onDeletar={deletar} onClick={abrirDetalhes} />
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

      <Modal aberta={!!selecionado} onFechar={() => { setSelecionado(null); setEditando(false) }} titulo="Detalhes da Fatura">
        {selecionado && !editando && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Cliente</label>
              <p className="text-gray-800 font-medium">{nomeCliente(selecionado)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Valor</label>
              <p className="text-gray-800 font-medium">R$ {Number(selecionado.valor).toFixed(2).replace('.', ',')}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Vencimento</label>
              <p className="text-gray-800">{formatDateBR(selecionado.vencimento)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
              <span className={`inline-block text-sm font-medium px-3 py-1 rounded-full ${statusEstilos[selecionado.status] || 'bg-gray-100 text-gray-700'}`}>
                {selecionado.status}
              </span>
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
              <label className="block text-sm font-medium text-gray-600 mb-1">Cliente</label>
              <select
                name="clienteId"
                value={formEdit.clienteId}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Valor</label>
              <input
                name="valor"
                value={formEdit.valor}
                onChange={handleEditChange}
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Vencimento</label>
              <DatePicker
                selected={formEdit.vencimento}
                onChange={(date) => setFormEdit({ ...formEdit, vencimento: date })}
                dateFormat="dd/MM/yyyy"
                locale="pt-BR"
                inline
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
              <select
                name="status"
                value={formEdit.status}
                onChange={handleEditChange}
                className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="PENDENTE">Pendente</option>
                <option value="PAGO">Pago</option>
                <option value="ATRASADO">Atrasado</option>
              </select>
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
