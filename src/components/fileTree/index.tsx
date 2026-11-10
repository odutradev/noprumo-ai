import styles from "./styles"

import type { TreeNode } from "@utils/types/generator"
import type { FileTreeProps } from "./types"
import type { ReactElement } from "react"

const renderNodes = (nodes: TreeNode[], depth: number): ReactElement[] =>
  nodes.map((node) => (
    <li key={`${depth}-${node.name}`}>
      <span className={styles.row} data-highlight={node.isHighlighted || undefined} data-folder={node.children ? true : undefined}>
        <span className={styles.icon} aria-hidden="true">
          {node.children ? "▾" : "•"}
        </span>
        <span className={styles.name}>
          {node.name}
          {node.children ? "/" : ""}
        </span>
        {node.note && <span className={styles.note}>{node.note}</span>}
      </span>
      {node.children && <ul className={styles.list}>{renderNodes(node.children, depth + 1)}</ul>}
    </li>
  ))

const FileTree = ({ nodes, label }: FileTreeProps) => (
  <div className={styles.tree}>
    <ul className={styles.root} aria-label={label}>
      {renderNodes(nodes, 0)}
    </ul>
  </div>
)

export default FileTree
