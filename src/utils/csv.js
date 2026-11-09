export function baixarCsv(nomeArquivo, linhas) {
  const csv = linhas
    .map((linha) =>
      linha.map((valor) => `"${String(valor ?? '').replace(/"/g, '""')}"`).join(';'),
    )
    .join('\r\n')

  const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = nomeArquivo
  link.click()
  URL.revokeObjectURL(url)
}