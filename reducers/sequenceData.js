import {
  SELECT_SEQUENCE, INVALIDATE_SEQUENCE_DATA,
  REQUEST_AQUARIA, RECEIVE_AQUARIA,
  REQUEST_PDB, RECEIVE_PDB,
  FAIL_AQUARIA, FAIL_PDB,
  REQUEST_UNIPROT, RECEIVE_UNIPROT,
  FAIL_UNIPROT
} from '../actions/sequenceData'

function sequenceData(state = {
  didInvalidate: false,
  aquaria: {},
  pdb: '',
  uniprot: '',
}, action) {
  switch (action.type) {
    case INVALIDATE_SEQUENCE_DATA:
      return Object.assign({}, state, {
        didInvalidate: true,
      })
    // AQUARIA
    case REQUEST_AQUARIA:
      return Object.assign({}, state, {
        isFetchingAquaria: true,
        isFailedAquaria: false,
        didInvalidate: false,
      })
    case RECEIVE_AQUARIA:
      return Object.assign({}, state, {
        isFetchingAquaria: false,
        isFailedAquaria: false,
        didInvalidate: false,
        aquaria: action.aquaria,
        lastUpdatedAquaria: action.receivedAt,
      })
    case FAIL_AQUARIA:
      return Object.assign({}, state, {
        isFetchingAquaria: false,
        isFailedAquaria: true,
      })
    // PDB
    case REQUEST_PDB:
      return Object.assign({}, state, {
        isFetchingPDB: true,
        isFailedPDB: false,
        didInvalidate: false,
      })
    case RECEIVE_PDB:
      return Object.assign({}, state, {
        isFetchingPDB: false,
        isFailedPDB: false,
        didInvalidate: false,
        pdb: `${action.pdb}`,
        lastUpdatedPDB: action.receivedAt,
      })
    case FAIL_PDB:
      return Object.assign({}, state, {
        isFetchingPDB: false,
        isFailedPDB: true,
      })
    // UNIPROT
    case REQUEST_UNIPROT:
      return Object.assign({}, state, {
        isFetchingUniprot: true,
        isFailedUniprot: false,
        didInvalidate: false,
      })
    case RECEIVE_UNIPROT:
      return Object.assign({}, state, {
        isFetchingUniprot: false,
        isFailedUniprot: false,
        didInvalidate: false,
        uniprot: `${action.uniprot}`,
        lastUpdatedUniprot: action.receivedAt,
      })
    case FAIL_UNIPROT:
      return Object.assign({}, state, {
        isFetchingUniprot: false,
        isFailedUniprot: true,
      })
    default:
      return state
  }
}

export function dataBySequence(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_SEQUENCE_DATA:
    case RECEIVE_AQUARIA:
    case REQUEST_AQUARIA:
    case FAIL_AQUARIA:
    case RECEIVE_PDB:
    case REQUEST_PDB:
    case FAIL_PDB:
    case RECEIVE_UNIPROT:
    case REQUEST_UNIPROT:
    case FAIL_UNIPROT:
      return Object.assign({}, state, {
        [action.sequence]: sequenceData(state[action.sequence], action),
      })
    default:
      return state
  }
}
export function selectedSequence(state = '4qo1', action) {
  switch (action.type) {
    case SELECT_SEQUENCE:
      return action.sequence
    default:
      return state
  }
}
