import { SELECT_AXIS, DESELECT_AXIS,
        INIT_PROTEIN_VIEWER, INIT_PROTEIN_STRUCTURE,
        SELECT_FEATURE, DESELECT_FEATURE,
        SELECT_AXIS_FEATURE, DESELECT_AXIS_FEATURE } from './radialVis'

export function visState(state = {
  selectedAxis: '',
  viewer: {},
  selectedFeature: '',
}, action) {
  switch (action.type) {
    case SELECT_AXIS:
      return Object.assign({}, state, {
        selectedAxis: action.axis,
      })
    case DESELECT_AXIS:
      return Object.assign({}, state, {
        selectedAxis: '',
      })
    case SELECT_FEATURE:
      return Object.assign({}, state, {
        selectedFeature: action.feature,
      })
    case DESELECT_FEATURE:
      return Object.assign({}, state, {
        selectedFeature: '',
      })
    case SELECT_AXIS_FEATURE:
      return Object.assign({}, state, {
        selectedFeature: action.feature,
        selectedAxis: action.axis,
      })
    case DESELECT_AXIS_FEATURE:
      return Object.assign({}, state, {
        selectedFeature: '',
        selectedAxis: '',
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
