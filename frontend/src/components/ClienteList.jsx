export default function ClienteList({ clientes, onDeletar, onClick }) {
  return (
    <div className="space-y-3">
      {clientes.length === 0 && (
        <p className="text-gray-500 text-center py-8 bg-white rounded-xl border border-dashed border-gray-300">
          Nenhum cliente cadastrado.
        </p>
      )}
      {clientes.map((cliente) => (
        <div
          key={cliente.id}
          onClick={() => onClick(cliente)}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex justify-between items-center hover:shadow-md transition cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 text-blue-600 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm">
              {cliente.nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{cliente.nome}</p>
              <p className="text-sm text-gray-500">{cliente.email}{cliente.telefone ? ` — ${cliente.telefone}` : ''}</p>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onDeletar(cliente.id) }}
            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition text-sm font-medium"
          >
            Remover
          </button>
        </div>
      ))}
    </div>
  )
}
