export const WINDOW_RESIZE = 'WINDOW_RESIZE'

export function resizeWindow(width, height) {
  return {
    type: WINDOW_RESIZE,
    width,
    height,
  }
}
