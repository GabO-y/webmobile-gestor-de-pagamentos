import { useEffect, useState } from 'react'
import api from '../api/axios'
import FaturaForm from '../components/FaturaForm'
import FaturaList from '../components/FaturaList'

export default function Faturas() {
  const [faturas, setFaturas] = useState([])
  const [erro, setErro] = useState('')

  async function carregar() {
    try {
      const response = await api.get('/faturas')
      setFaturas(response.data)
    } catch {
      setErro('Erro ao carregar faturas')
    }
  }

  async function salvar(dados) {
    try {
      await api.post('/faturas', dados)
      setErro('')
      carregar()
    } catch {
      setErro('Erro ao salvar fatura')
    }
  }

  async function deletar(id) {
    try {
      await api.delete(`/faturas/${id}`)
      setErro('')
      carregar()
    } catch {
      setErro('Erro ao remover fatura')
    }
  }

  useEffect(() => {
    carregar()
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Faturas</h1>
      {erro && <p className="text-red-500 text-sm mb-2">{erro}</p>}
      <FaturaForm onSalvar={salvar} />
      <FaturaList faturas={faturas} onDeletar={deletar} />
    </div>
  )
}
