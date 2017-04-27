import {
  SELECT_SEQUENCE, INVALIDATE_SEQUENCE_DATA,
  REQUEST_AQUARIA, RECEIVE_AQUARIA,
  REQUEST_PDB, RECEIVE_PDB,
  FAIL_AQUARIA, FAIL_PDB,
  REQUEST_UNIPROT, RECEIVE_UNIPROT,
  FAIL_UNIPROT, DATA_ACTION_GROUP, SET_VARIANTS,
} from './sequenceData'
import { VIS_ACTION_GROUP } from './radialVis'
import { visState } from './radialVisReducer'
import parseUniprot from './parsers/parseUniprot'
import parseAquaria from './parsers/parseAquaria'

function sequenceData(state = {
  proteinDataHealth: {
    aquaria: {
      lastUpdated: '',
    },
    pdb: {
      lastUpdated: '',
    },
    uniprot: {
      lastUpdated: '',
    },
  },
  proteinData: {
    pdb: '',
    length: 0,
  },
  visState: {
    selectedAxis: '',
    viewer: {},
    selectedFeature: '',
    selectedVariant: '',
    selectedCluster: '',
    order: [],
  },
  variants: {
    // clusterUNIQUE1: {
    //   prevDist: 5,
    //   nextDist: 10,
    //   center: 98,
    //   variants: {
    //     variantUNIQUE1: {
    //       pos: 98,
    //       type: 'splice',
    //       known: true,
    //       knownType: {},
    //       refAA: 'S',
    //       varAA: 'T',
    //       class: 'uncharged?',
    //     },
    //   },
    // },
    // clusterUNIQUE2: {
    //   prevDist: 5,
    //   nextDist: 10,
    //   center: 0,
    //   variants: {
    //     variantUNIQUE1: {
    //       pos: 15,
    //       type: 'stop',
    //       known: false,
    //       knownType: {},
    //       refAA: 'S',
    //       varAA: 'A',
    //       class: 'uncharged?',
    //     },
    //   },
    // },
    // clusterUNIQUE3: {
    //   prevDist: 5,
    //   nextDist: 10,
    //   center: 196,
    //   variants: {
    //     variantUNIQUE1: {
    //       pos: 196,
    //       type: 'deletion',
    //       known: true,
    //       knownType: {},
    //       refAA: 'T',
    //       varAA: 'A',
    //       class: 'uncharged?',
    //     },
    //     variantUNIQUE2: {
    //       pos: 225,
    //       type: 'insertion',
    //       known: false,
    //       knownType: {},
    //       refAA: 'S',
    //       varAA: 'T',
    //       class: 'uncharged?',
    //     },
    //   },
    // },
    // clusterUNIQUE4: {
    //   prevDist: 5,
    //   nextDist: 10,
    //   center: 255,
    //   variants: {
    //     variantUNIQUE1: {
    //       pos: 255,
    //       type: 'frameshift',
    //       known: false,
    //       knownType: {},
    //       refAA: 'T',
    //       varAA: 'S',
    //       class: 'uncharged?',
    //     },
    //     variantUNIQUE2: {
    //       pos: 310,
    //       type: 'indel',
    //       known: true,
    //       knownType: {},
    //       refAA: 'T',
    //       varAA: 'V',
    //       class: 'uncharged?',
    //     },
    //     variantUNIQUE3: {
    //       pos: 322,
    //       type: 'nonsynonym',
    //       known: true,
    //       knownType: {},
    //       refAA: 'A',
    //       varAA: 'T',
    //       class: 'uncharged?',
    //     },
    //   },
    // },
  },
}, action) {
  switch (action.type) {
    case INVALIDATE_SEQUENCE_DATA:
      return Object.assign({}, state, {
        proteinDataHealth: Object.assign({}, state.proteinDataHealth, {
          aquaria: Object.assign({}, state.proteinDataHealth.aquaria, {
            didInvalidate: true,
          }),
          uniprot: Object.assign({}, state.proteinDataHealth.uniprot, {
            didInvalidate: true,
          }),
          pdb: Object.assign({}, state.proteinDataHealth.pdb, {
            didInvalidate: true,
          }),
        }),
      })
    // AQUARIA
    case REQUEST_AQUARIA:
      return Object.assign({}, state, {
        proteinDataHealth: Object.assign({}, state.proteinDataHealth, {
          aquaria: Object.assign({}, state.proteinDataHealth.aquaria, {
            isFetching: true,
            didFail: false,
            didInvalidate: false,
          }),
        }),
      })
    case RECEIVE_AQUARIA:
      return Object.assign({}, state, {
        proteinDataHealth: Object.assign({}, state.proteinDataHealth, {
          aquaria: Object.assign({}, state.proteinDataHealth.aquaria, {
            isFetching: false,
            didFail: false,
            didInvalidate: false,
            lastUpdated: action.receivedAt,
          }),
        }),
        proteinData: Object.assign({}, state.proteinData,
            parseAquaria(action.aquaria)),
      })
    case FAIL_AQUARIA:
      return Object.assign({}, state, {
        proteinDataHealth: Object.assign({}, state.proteinDataHealth, {
          aquaria: Object.assign({}, state.proteinDataHealth.aquaria, {
            isFetching: false,
            didFail: true,
          }),
        }),
      })
    // PDB
    case REQUEST_PDB:
      return Object.assign({}, state, {
        proteinDataHealth: Object.assign({}, state.proteinDataHealth, {
          pdb: Object.assign({}, state.proteinDataHealth.pdb, {
            isFetching: true,
            didFail: false,
            didInvalidate: false,
          }),
        }),
      })
    case RECEIVE_PDB:
      return Object.assign({}, state, {
        proteinDataHealth: Object.assign({}, state.proteinDataHealth, {
          pdb: Object.assign({}, state.proteinDataHealth.pdb, {
            isFetching: false,
            didFail: false,
            didInvalidate: false,
            lastUpdated: action.receivedAt,
          }),
        }),
        proteinData: Object.assign({}, state.proteinData, {
          pdb: action.pdb }),
      })
    case FAIL_PDB:
      return Object.assign({}, state, {
        proteinDataHealth: Object.assign({}, state.proteinDataHealth, {
          pdb: Object.assign({}, state.proteinDataHealth.pdb, {
            isFetching: false,
            didFail: true,
          }),
        }),
      })
    // UNIPROT
    case REQUEST_UNIPROT:
      return Object.assign({}, state, {
        proteinDataHealth: Object.assign({}, state.proteinDataHealth, {
          uniprot: Object.assign({}, state.proteinDataHealth.uniprot, {
            isFetching: true,
            didFail: false,
            didInvalidate: false,
          }),
        }),
      })
    case RECEIVE_UNIPROT: {
      const uniprot = parseUniprot(action.uniprot)
      return Object.assign({}, state, {
        proteinDataHealth: Object.assign({}, state.proteinDataHealth, {
          uniprot: Object.assign({}, state.proteinDataHealth.uniprot, {
            isFetching: false,
            didFail: false,
            didInvalidate: false,
            lastUpdated: action.receivedAt,
          }),
        }),
        proteinData: Object.assign({}, state.proteinData, {
          features: uniprot.data,
          length: uniprot.chainLength,
        }),
      })
    }
    case FAIL_UNIPROT:
      return Object.assign({}, state, {
        proteinDataHealth: Object.assign({}, state.proteinDataHealth, {
          uniprot: Object.assign({}, state.proteinDataHealth.uniprot, {
            isFetching: false,
            didFail: true,
          }),
        }),
      })
    case SET_VARIANTS:
      return Object.assign({}, state, {
        variants: action.variants,
      })
    default:
      return state
  }
}

function subReducer(state, action) {
  switch (action.group) {
    case DATA_ACTION_GROUP:
      return Object.assign({}, state, sequenceData(state, action))
    case VIS_ACTION_GROUP:
      return Object.assign({}, state, {
        visState: visState(state.visState, action),
      })
    default:
      return state
  }
}

export function dataBySequence(state = {}, action) {
  switch (action.group) {
    case DATA_ACTION_GROUP:
    case VIS_ACTION_GROUP:
      return Object.assign({}, state, {
        // [action.sequence]: sequenceData(state[action.sequence], action),
        [action.sequence]: subReducer(state[action.sequence], action),
      })
    default:
      return state
  }
}

export function selectedSequence(state = 'P04637#4qo1#B', action) {
  switch (action.type) {
    case SELECT_SEQUENCE:
      return action.sequence
    default:
      return state
  }
}
