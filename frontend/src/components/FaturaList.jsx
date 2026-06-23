const statusEstilos = {
  PENDENTE: 'bg-yellow-100 text-yellow-700',
  PAGO: 'bg-green-100 text-green-700',
  ATRASADO: 'bg-red-100 text-red-700',
}

export default function FaturaList({ faturas, onDeletar, onClick }) {
  return (
    <div className="space-y-3">
      {faturas.length === 0 && (
        <p className="text-gray-500 text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
          Nenhuma fatura cadastrada.
        </p>
      )}
      {faturas.map((fatura) => (
        <div
          key={fatura.id}
          onClick={() => onClick(fatura)}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center hover:shadow-md transition cursor-pointer"
        >
          <div className="space-y-1">
            <p className="font-semibold text-gray-800">
              R$ {Number(fatura.valor).toFixed(2).replace('.', ',')}
            </p>
            <p className="text-sm text-gray-500">
              Vencimento: {new Date(fatura.vencimento).toLocaleDateString('pt-BR')}
            </p>
            <span className={`inline-block text-xs font-medium px-2.5 py-0.5 rounded-full ${statusEstilos[fatura.status] || 'bg-gray-100 text-gray-700'}`}>
              {fatura.status}
            </span>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDeletar(fatura.id) }}
            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition text-sm font-medium"
          >
            Remover
          </button>
        </div>
      ))}
    </div>
  )
}
