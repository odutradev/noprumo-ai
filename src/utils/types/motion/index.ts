export interface PendulumOptions {
  initialAngle?: number
  delay?: number
  sensitivity?: number
}

export interface ScrollProgressOptions {
  anchor?: number
  isPinned?: boolean
  smoothing?: number
  onProgress?: (progress: number) => void
}

export interface CursorRipple {
  id: number
  x: number
  y: number
}
