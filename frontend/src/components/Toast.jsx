import { useEffect } from 'react'

export default function Toast({ mensagem, tipo, onFechar }) {
  useEffect(() => {
    if (!mensagem) return
    const timer = setTimeout(onFechar, 3000)
    return () => clearTimeout(timer)
  }, [mensagem, onFechar])

  if (!mensagem) return null

  const cor =
    tipo === 'sucesso' ? 'bg-green-500' :
    tipo === 'erro' ? 'bg-red-500' :
    'bg-blue-500'

  return (
    <div className={`fixed top-4 right-4 ${cor} text-white px-4 py-3 rounded-lg shadow-lg z-50 animate-slide-in`}>
      {mensagem}
    </div>
  )
}
