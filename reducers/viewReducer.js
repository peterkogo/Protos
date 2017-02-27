import { SHOW_DATA, HIDE_DATA, WINDOW_RESIZE } from '../actions/view'

export function dataVisibility(state = false, action) {
  switch (action.type) {
    case SHOW_DATA:
      return true
    case HIDE_DATA:
      return false
    default:
      return state
  }
}

const initialUiState = {
  windowWidth: typeof window === 'object' ? window.innerWidth : null,
  windowHeight: typeof window === 'object' ? window.innerHeight : null,
}

export function ui(state = initialUiState, action) {
  switch (action.type) {
    case WINDOW_RESIZE:
      return Object.assign({}, state, {
        windowWidth: action.width,
        windowHeight: action.height,
      })
    default:
      return state
  }
}
