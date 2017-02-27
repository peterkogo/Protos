export const SHOW_DATA = 'SHOW_DATA'
export const HIDE_DATA = 'HIDE_DATA'
export const WINDOW_RESIZE = 'WINDOW_RESIZE'

export function resizeWindow(width, height) {
  return {
    type: WINDOW_RESIZE,
    width,
    height,
  }
}

export function showData() {
  return ({
    type: SHOW_DATA,
  })
}

export function hideData() {
  return ({
    type: HIDE_DATA,
  })
}
