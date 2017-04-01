import { SELECT_AXIS, DESELECT_AXIS,
          INIT_PROTEIN_VIEWER, INIT_PROTEIN_STRUCTURE } from './radialVis'

export function visState(state = { selected: '', viewer: {} }, action) {
  switch (action.type) {
    case SELECT_AXIS:
      return Object.assign({}, state, {
        selected: action.axis,
      })
    case DESELECT_AXIS:
      return Object.assign({}, state, {
        selected: '',
      })
    case INIT_PROTEIN_VIEWER:
      return Object.assign({}, state, {
        viewer: action.viewer,
      })
    case INIT_PROTEIN_STRUCTURE:
      return Object.assign({}, state, {
        structure: action.structure,
      })
    default:
      return state
  }
}
