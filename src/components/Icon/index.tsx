import { MdArrowForward, MdExpandLess, MdExpandMore, MdLightMode, MdDarkMode, MdClose, MdMenu, MdMail } from 'react-icons/md'
import { SiGithub } from 'react-icons/si'

import type { IconProps } from './types'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  dark_mode: MdDarkMode,
  light_mode: MdLightMode,
  arrow_forward: MdArrowForward,
  expand_less: MdExpandLess,
  expand_more: MdExpandMore,
  close: MdClose,
  menu: MdMenu,
  mail: MdMail,
  github: SiGithub
}

const Icon = ({ name, className }: IconProps) => {
  const IconComponent = iconMap[name]

  if (!IconComponent) return null

  return <IconComponent className={className} />
}

export default Icon
