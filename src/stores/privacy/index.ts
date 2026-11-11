import { persist } from "zustand/middleware"
import { create } from "zustand"

interface PrivacyStore {
  isNoticeDismissed: boolean
  dismissNotice: () => void
}

const usePrivacyStore = create<PrivacyStore>()(
  persist(
    (set) => ({
      isNoticeDismissed: false,
      dismissNotice: () => set({ isNoticeDismissed: true })
    }),
    { name: "noprumo-privacy" }
  )
)

export default usePrivacyStore
