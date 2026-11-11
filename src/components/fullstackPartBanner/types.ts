import type { AppProjectType } from "@utils/types/generator"

export interface FullstackPartBannerProps {
  part: AppProjectType
  folder: string
  onFinish: () => void
}
