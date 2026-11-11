export const downloadBlob = (filename: string, blob: Blob) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = filename
  link.click()
  URL.revokeObjectURL(url)
}

export const downloadText = (filename: string, content: string, type = "text/markdown") => downloadBlob(filename, new Blob([content], { type: `${type};charset=utf-8` }))
