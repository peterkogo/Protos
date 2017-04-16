import fetch from 'isomorphic-fetch'

export const SELECT_SEQUENCE = 'SELECT_SEQUENCE'
export const INVALIDATE_SEQUENCE_DATA = 'INVALIDATE_SEQUENCE_DATA'
export const REQUEST_AQUARIA = 'REQUEST_AQUARIA'
export const RECEIVE_AQUARIA = 'RECEIVE_AQUARIA'
export const FAIL_AQUARIA = 'FAIL_AQUARIA'
export const REQUEST_PDB = 'REQUEST_PDB'
export const RECEIVE_PDB = 'RECEIVE_PDB'
export const FAIL_PDB = 'FAIL_PDB'
export const REQUEST_UNIPROT = 'REQUEST_UNIPROT'
export const RECEIVE_UNIPROT = 'RECEIVE_UNIPROT'
export const FAIL_UNIPROT = 'FAIL_UNIPROT'

export const DATA_ACTION_GROUP = 'DATA_ACTION_GROUP'

const timeout = 5000 // TODO timeout not working

export function selectSequence(sequence) {
  return {
    type: SELECT_SEQUENCE,
    group: DATA_ACTION_GROUP,
    sequence,
  }
}

export function invalidateSequenceData(sequence) {
  return {
    type: INVALIDATE_SEQUENCE_DATA,
    group: DATA_ACTION_GROUP,
    sequence,
  }
}

function receiveAquaria(sequence, json) {
  return {
    type: RECEIVE_AQUARIA,
    group: DATA_ACTION_GROUP,
    sequence,
    aquaria: json,
    receivedAt: Date.now(),
  }
}

function receivePDB(sequence, pdb) {
  return {
    type: RECEIVE_PDB,
    group: DATA_ACTION_GROUP,
    sequence,
    pdb,
    receivedAt: Date.now(),
  }
}

function receiveUniporot(sequence, uniprot) {
  return {
    type: RECEIVE_UNIPROT,
    group: DATA_ACTION_GROUP,
    sequence,
    uniprot,
    receivedAt: Date.now(),
  }
}

function aquariaFailed(sequence, status) {
  return {
    type: FAIL_AQUARIA,
    group: DATA_ACTION_GROUP,
    sequence,
    status,
  }
}

function pdbFailed(sequence, status) {
  return {
    type: FAIL_PDB,
    group: DATA_ACTION_GROUP,
    status,
    sequence,
  }
}

function uniprotFailed(sequence, status) {
  return {
    type: FAIL_UNIPROT,
    group: DATA_ACTION_GROUP,
    sequence,
    status,
  }
}

function requestSequenceData(sequence) {
  return (dispatch) => {
    dispatch({
      type: REQUEST_AQUARIA,
      group: DATA_ACTION_GROUP,
      sequence,
    })
    dispatch({
      type: REQUEST_PDB,
      group: DATA_ACTION_GROUP,
      sequence,
    })
    dispatch({
      type: REQUEST_UNIPROT,
      group: DATA_ACTION_GROUP,
      sequence,
    })
  }
}

function fetchSequenceData(sequence) {
  const proteinMapping = sequence.split('#')
  return (dispatch) => {
    dispatch(requestSequenceData(sequence))
    // Fetching PDB
    fetch(`https://files.rcsb.org/download/${proteinMapping[1]}.pdb`, { timeout })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status)
        }
        return response.text()
      })
      .then(response => dispatch(receivePDB(sequence, response)))
      .catch((e) => {
        dispatch(pdbFailed(sequence, e.status))
      })

    // Fetching Aquria
    fetch(`http://aquaria.ws/${proteinMapping[0]}/${proteinMapping[1]}/B.json`, { timeout })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status)
        } else {
          return response.json()
        }
      })
      .then(json => dispatch(receiveAquaria(sequence, json)))
      .catch((e) => { dispatch(aquariaFailed(sequence, e.status)) })

    fetch(`http://www.uniprot.org/uniprot/${proteinMapping[0]}.xml`, { timeout })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status)
        } else {
          return response.text()
        }
      })
      .then(xml => dispatch(receiveUniporot(sequence, xml)))
      .catch((e) => { dispatch(uniprotFailed(sequence, e.status)) })
  }
}

function shouldFetchSequence(state, sequence) {
  const sequences = state.dataBySequence[sequence]
  if (!sequences) {
    return true
  } else if (sequences.aquaria.isFetching || sequences.pdb.isFetching) {
    return false
  }
  return sequences.didInvalidate
}

export function fetchSequenceIfNeeded(sequence) {
  return (dispatch, getState) => {
    if (shouldFetchSequence(getState(), sequence)) {
      return dispatch(fetchSequenceData(sequence))
    }
    return null
  }
}
