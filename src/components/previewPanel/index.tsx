import { useMemo, useState } from "react"
import { Badge, Tabs } from "enchase"

import { buildFullstackSampleFiles, getFullstackFiles } from "@utils/functions/generator/fullstack"
import { buildTree, getProjectFiles } from "@utils/functions/generator/architecture"
import { buildOutputFiles } from "@utils/functions/generator/outputFormat"
import { buildSampleFiles } from "@utils/functions/generator/codeSample"
import { buildDeployFiles } from "@utils/functions/generator/deploy"
import useGeneratorStore from "@stores/generator"
import CodeBlock from "@components/codeBlock"
import FileTree from "@components/fileTree"
import styles from "./styles.module.css"

import type { PreviewPanelProps } from "./types"

const PreviewPanel = ({ hasHeader = true }: PreviewPanelProps) => {
  const config = useGeneratorStore((state) => state.config)
  const format = useGeneratorStore((state) => state.format)
  const configs = useGeneratorStore((state) => state.configs)
  const isFullstack = config.projectType === "fullstack"
  const [fileIndex, setFileIndex] = useState(0)
  const files = useMemo(() => (isFullstack ? buildFullstackSampleFiles(config) : [...buildSampleFiles(config), ...buildDeployFiles(config)]), [config, isFullstack])
  const tree = useMemo(() => buildTree(isFullstack ? getFullstackFiles(config, configs) : [...getProjectFiles(config), ...buildDeployFiles(config).map((file) => ({ path: file.path }))]), [config, configs, isFullstack])
  const output = useMemo(() => buildOutputFiles(config, format, configs)[0], [config, format, configs])
  const markdown = output.content
  const fileName = output.path.split("/").pop() ?? output.path
  const activeFile = files[Math.min(fileIndex, files.length - 1)]

  const items = [
    {
      value: "code",
      label: "Código",
      content: (
        <div className={styles.tabBody}>
          <div className={styles.fileList} role="group" aria-label="Arquivos de exemplo">
            {files.map((file, index) => (
              <button key={file.path} type="button" className={styles.fileButton} aria-pressed={file === activeFile} onClick={() => setFileIndex(index)}>
                {file.path.split("/").slice(-2).join("/")}
              </button>
            ))}
          </div>
          <CodeBlock code={activeFile.code} title={activeFile.path} isCopyable />
        </div>
      )
    },
    {
      value: "tree",
      label: "Estrutura",
      content: (
        <div className={styles.tabBody}>
          <FileTree nodes={tree} label="Estrutura de pastas gerada" />
        </div>
      )
    },
    {
      value: "skill",
      label: (
        <span className={styles.tabLabel}>
          {fileName} <Badge size="sm">{markdown.split("\n").length}</Badge>
        </span>
      ),
      content: (
        <div className={styles.tabBody}>
          <CodeBlock code={markdown} title={fileName} isPlain isCopyable />
        </div>
      )
    }
  ]

  return (
    <div className={styles.preview}>
      {hasHeader && (
        <div className={styles.previewHead}>
          <span className={styles.previewTitle}>Prévia ao vivo</span>
          <span className={styles.previewHint}>Atualiza a cada escolha</span>
        </div>
      )}
      <Tabs items={items} ariaLabel="Prévia da skill" />
    </div>
  )
}

export default PreviewPanel
