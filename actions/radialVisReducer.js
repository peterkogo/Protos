import { SELECT_AXIS, DESELECT_AXIS,
        INIT_PROTEIN_VIEWER, INIT_PROTEIN_STRUCTURE,
        SELECT_FEATURE, DESELECT_FEATURE,
        SELECT_AXIS_FEATURE, DESELECT_AXIS_FEATURE,
        CHANGE_AXIS_POS_TO, CREATE_AXIS_ORDER } from './radialVis'
import { INITIAL_ORDER } from './ActionDefaults'


function createAxisOrder(features) {
  const keys = Object.keys(features)
  const ordered = []
  INITIAL_ORDER.forEach((elem) => {
    keys.some((key) => {
      if (elem === features[key].name) {
        ordered.push(key)
        return true
      }
      return false
    })
  })
  keys.forEach((key) => {
    if (INITIAL_ORDER.indexOf(features[key].name) === -1) {
      ordered.push(key)
    }
  })
  return ordered.reverse()
}

function changeAxisPosTo(from, to, order) {
  const newOrder = order.splice(0)
  newOrder.reverse()

  const element = newOrder[from]
  newOrder.splice(from, 1)
  newOrder.splice(to, 0, element)

  newOrder.reverse()
  return newOrder
}

export function visState(state = {
  selectedAxis: '',
  viewer: {},
  selectedFeature: '',
  order: [],
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
    case CHANGE_AXIS_POS_TO: {
      const order = changeAxisPosTo(action.from, action.to, state.order)
      // const order = state.order
      return Object.assign({}, state, {
        order,
      })
    }
    case CREATE_AXIS_ORDER: {
      const order = createAxisOrder(action.uniprotData)
      return Object.assign({}, state, {
        order,
      })
    }
    default:
      return state
  }
}
