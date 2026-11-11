import { useLocation } from "react-router"
import { CloseIcon } from "enchase/icons"
import { Button, Link } from "enchase"

import { privacyNotice, privacyPath } from "@assets/data/privacy"
import usePrivacyStore from "@stores/privacy"
import styles from "./styles.module.css"

import type { PrivacyNoticeProps } from "./types"

const PrivacyNotice = ({ className }: PrivacyNoticeProps) => {
  const { pathname } = useLocation()
  const isNoticeDismissed = usePrivacyStore((state) => state.isNoticeDismissed)
  const dismissNotice = usePrivacyStore((state) => state.dismissNotice)

  if (isNoticeDismissed || pathname === privacyPath) return null

  return (
    <aside className={[styles.notice, className].filter(Boolean).join(" ")} aria-label="Aviso de privacidade">
      <p className={styles.text}>
        {privacyNotice}{" "}
        <Link href={privacyPath} className={styles.link}>
          Saiba mais
        </Link>
      </p>
      <Button variant="ghost" size="sm" iconOnly aria-label="Fechar aviso de privacidade" onClick={dismissNotice}>
        <CloseIcon size={14} />
      </Button>
    </aside>
  )
}

export default PrivacyNotice
