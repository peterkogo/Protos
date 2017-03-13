export const SELECT_AXIS = 'SELECT_AXIS'
export const DESELECT_AXIS = 'DESELECT_AXIS'

export function selectAxis(axis) {
  return {
    type: SELECT_AXIS,
    axis,
  }
}

export function deselectAxis() {
  return {
    type: DESELECT_AXIS,
  }
}
