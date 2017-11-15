export const SELECT_AXIS = 'SELECT_AXIS'
export const DESELECT_AXIS = 'DESELECT_AXIS'
export const SELECT_FEATURE = 'SELECT_FEATURE'
export const DESELECT_FEATURE = 'DESELECT_FEATURE'
export const SELECT_AXIS_FEATURE = 'SELECT_AXIS_FEATURE'
export const DESELECT_AXIS_FEATURE = 'DESELECT_AXIS_FEATURE'
export const SELECT_VARIANT = 'SELECT_VARIANT'
export const DESELECT_VARIANT = 'DESELECT_VARIANT'
export const INIT_PROTEIN_VIEWER = 'INIT_PROTEIN_VIEWER'
export const INIT_PROTEIN_STRUCTURE = 'INIT_PROTEIN_STRUCTURE'
export const CHANGE_AXIS_POS_TO = 'CHANGE_AXIS_POS_TO'
export const CREATE_AXIS_ORDER = 'CREATE_AXIS_ORDER'
export const SHOW_VARIANT_TABLE = 'SHOW_VARIANT_TABLE'
export const HIDE_VARIANT_TABLE = 'HIDE_VARIANT_TABLE'

export const VIS_ACTION_GROUP = 'VIS_ACTION_GROUP'

export function showVariantTable(sequence) {
  return {
    type: SHOW_VARIANT_TABLE,
    group: VIS_ACTION_GROUP,
    sequence,
  }
}

export function hideVariantTable(sequence) {
  return {
    type: HIDE_VARIANT_TABLE,
    group: VIS_ACTION_GROUP,
    sequence,
  }
}

export function selectAxis(sequence, axis) {
  return {
    type: SELECT_AXIS,
    group: VIS_ACTION_GROUP,
    axis,
    sequence,
  }
}

export function deselectAxis(sequence) {
  return {
    type: DESELECT_AXIS,
    group: VIS_ACTION_GROUP,
    sequence,
  }
}

export function selectFeature(sequence, feature) {
  return {
    type: SELECT_FEATURE,
    group: VIS_ACTION_GROUP,
    feature,
    sequence,
  }
}

export function deselectFeature(sequence) {
  return {
    type: DESELECT_FEATURE,
    group: VIS_ACTION_GROUP,
    sequence,
  }
}

export function selectAxisFeature(sequence, axis, feature) {
  return {
    type: SELECT_AXIS_FEATURE,
    group: VIS_ACTION_GROUP,
    axis,
    feature,
    sequence,
  }
}

export function deselectAxisFeature(sequence) {
  return {
    type: DESELECT_AXIS_FEATURE,
    group: VIS_ACTION_GROUP,
    sequence,
  }
}

export function selectVariant(sequence, cluster, variant) {
  return {
    type: SELECT_VARIANT,
    group: VIS_ACTION_GROUP,
    sequence,
    cluster,
    variant,
  }
}

export function deselectVariant(sequence) {
  return {
    type: DESELECT_VARIANT,
    group: VIS_ACTION_GROUP,
    sequence,
  }
}

export function initProteinViewer(sequence, viewer) {
  return {
    type: INIT_PROTEIN_VIEWER,
    group: VIS_ACTION_GROUP,
    viewer,
    sequence,
  }
}

export function initProteinStructure(sequence, structure) {
  return {
    type: INIT_PROTEIN_STRUCTURE,
    group: VIS_ACTION_GROUP,
    structure,
    sequence,
  }
}

export function changeAxisPosFromTo(sequence, from, to) {
  return {
    type: CHANGE_AXIS_POS_TO,
    group: VIS_ACTION_GROUP,
    from,
    to,
    sequence,
  }
}

export function createAxisOrder(sequence, uniprotData) {
  return {
    type: CREATE_AXIS_ORDER,
    group: VIS_ACTION_GROUP,
    uniprotData,
    sequence,
  }
}
