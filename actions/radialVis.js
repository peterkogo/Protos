export const SELECT_AXIS = 'SELECT_AXIS'
export const DESELECT_AXIS = 'DESELECT_AXIS'
export const SELECT_FEATURE = 'SELECT_FEATURE'
export const DESELECT_FEATURE = 'DESELECT_FEATURE'
export const SELECT_AXIS_FEATURE = 'SELECT_AXIS_FEATURE'
export const DESELECT_AXIS_FEATURE = 'DESELECT_AXIS_FEATURE'
export const INIT_PROTEIN_VIEWER = 'INIT_PROTEIN_VIEWER'
export const INIT_PROTEIN_STRUCTURE = 'INIT_PROTEIN_STRUCTURE'

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

export function selectFeature(feature) {
  return {
    type: SELECT_FEATURE,
    feature,
  }
}

export function deselectFeature() {
  return {
    type: DESELECT_FEATURE,
  }
}

export function selectAxisFeature(axis, feature) {
  return {
    type: SELECT_AXIS_FEATURE,
    axis,
    feature,
  }
}

export function deselectAxisFeature() {
  return {
    type: DESELECT_AXIS_FEATURE,
  }
}

export function initProteinViewer(viewer) {
  return {
    type: INIT_PROTEIN_VIEWER,
    viewer,
  }
}

export function initProteinStructure(structure) {
  return {
    type: INIT_PROTEIN_STRUCTURE,
    structure,
  }
}
