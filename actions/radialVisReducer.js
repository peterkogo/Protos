import { SELECT_AXIS, DESELECT_AXIS } from './radialVis'

export function visState(state = { selected: '' }, action) {
  switch (action.type) {
    case SELECT_AXIS:
      return Object.assign({}, state, {
        selected: action.axis,
      })
    case DESELECT_AXIS:
      return Object.assign({}, state, {
        selected: '',
      })
    default:
      return state
  }
}
