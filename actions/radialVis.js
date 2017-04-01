export const SELECT_AXIS = 'SELECT_AXIS'
export const DESELECT_AXIS = 'DESELECT_AXIS'
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
