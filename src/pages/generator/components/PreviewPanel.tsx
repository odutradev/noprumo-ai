import { useMemo, useState } from 'react'
import { Badge, Tabs } from 'enchase'

import { buildTree, getArchitectureLayout } from '@/utils/generator/architecture'
import { buildSkillMarkdown } from '@/utils/generator/skillMarkdown'
import { buildSampleFiles } from '@/utils/generator/codeSample'
import useGeneratorStore from '@stores/generator'
import CodeBlock from '@components/CodeBlock'
import FileTree from '@components/FileTree'

import styles from './styles.module.css'

const PreviewPanel = () => {
  const config = useGeneratorStore((state) => state.config)
  const [fileIndex, setFileIndex] = useState(0)
  const files = useMemo(() => buildSampleFiles(config), [config])
  const tree = useMemo(() => buildTree(getArchitectureLayout(config).files), [config])
  const markdown = useMemo(() => buildSkillMarkdown(config), [config])
  const activeFile = files[Math.min(fileIndex, files.length - 1)]

  const items = [
    {
      value: 'code',
      label: 'Código',
      content: (
        <div className={styles.tabBody}>
          <div className={styles.fileList} role="group" aria-label="Arquivos de exemplo">
            {files.map((file, index) => (
              <button key={file.path} type="button" className={styles.fileButton} aria-pressed={file === activeFile} onClick={() => setFileIndex(index)}>
                {file.path.split('/').slice(-2).join('/')}
              </button>
            ))}
          </div>
          <CodeBlock code={activeFile.code} title={activeFile.path} copyable maxHeight="30rem" />
        </div>
      )
    },
    { value: 'tree', label: 'Estrutura', content: <div className={styles.tabBody}><FileTree nodes={tree} label="Estrutura de pastas gerada" /></div> },
    {
      value: 'skill',
      label: (
        <span className={styles.tabLabel}>
          SKILL.md <Badge size="sm">{markdown.split('\n').length} linhas</Badge>
        </span>
      ),
      content: (
        <div className={styles.tabBody}>
          <CodeBlock code={markdown} title="SKILL.md" plain copyable maxHeight="30rem" />
        </div>
      )
    }
  ]

  return (
    <aside className={styles.preview} aria-label="Pré-visualização">
      <div className={styles.previewHead}>
        <span className={styles.previewTitle}>Resultado ao vivo</span>
        <span className={styles.previewHint}>Atualiza a cada escolha</span>
      </div>
      <Tabs items={items} ariaLabel="Pré-visualização da skill" />
    </aside>
  )
}

export default PreviewPanel
