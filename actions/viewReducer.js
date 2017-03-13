import { WINDOW_RESIZE } from './view'

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
