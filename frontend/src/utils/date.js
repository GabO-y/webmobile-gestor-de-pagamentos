export function parseDate(str) {
  if (!str) return null
  const [ano, mes, dia] = str.split('-')
  return new Date(Number(ano), Number(mes) - 1, Number(dia))
}

export function formatDate(date) {
  if (!date) return ''
  const ano = date.getFullYear()
  const mes = String(date.getMonth() + 1).padStart(2, '0')
  const dia = String(date.getDate()).padStart(2, '0')
  return `${ano}-${mes}-${dia}`
}

export function formatDateBR(dateStr) {
  if (!dateStr) return ''
  const [ano, mes, dia] = dateStr.split('-')
  return `${dia}/${mes}/${ano}`
}
