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

export function selectSequence(sequence) {
  return {
    type: SELECT_SEQUENCE,
    sequence,
  }
}

export function invalidateSequenceData(sequence) {
  return {
    type: INVALIDATE_SEQUENCE_DATA,
    sequence,
  }
}

function receiveAquaria(sequence, json) {
  return {
    type: RECEIVE_AQUARIA,
    sequence,
    aquaria: json,
    receivedAt: Date.now(),
  }
}

function receivePDB(sequence, pdb) {
  return {
    type: RECEIVE_PDB,
    sequence,
    pdb,
    receivedAt: Date.now(),
  }
}

function receiveUniporot(sequence, uniprot) {
  return {
    type: RECEIVE_UNIPROT,
    sequence,
    uniprot,
    receivedAt: Date.now(),
  }
}

function aquariaFailed(sequence) {
  return {
    type: FAIL_AQUARIA,
    sequence,
  }
}

function pdbFailed(sequence) {
  return {
    type: FAIL_PDB,
    sequence,
  }
}

function uniprotFailed(sequence) {
  return {
    type: FAIL_UNIPROT,
    sequence,
  }
}

function requestSequenceData(sequence) {
  return dispatch => {
    dispatch({
      type: REQUEST_AQUARIA,
      sequence,
    })
    dispatch({
      type: REQUEST_PDB,
      sequence,
    })
    dispatch({
      type: REQUEST_UNIPROT,
      sequence,
    })
  }
}

function fetchSequenceData(sequence) {
  return dispatch => {
    dispatch(requestSequenceData(sequence))

    // Fetching PDB
    fetch(`https://files.rcsb.org/download/${sequence}.pdb`, { timeout: 5000 })
      .then(response => {
        if (response.status >= 400) {
          throw response.status
        } else {
          return response.text()
        }
      })
      .then(string => dispatch(receivePDB(sequence, string)))
      // .catch(dispatch(pdbFailed(sequence))) TODO Catch always triggered

    // Fetching Aquria
    fetch(`http://aquaria.ws/P04637/${sequence}/B.json`, { timeout: 5000 })
      .then(response => {
        if (response.status >= 400) {
          throw response.status
        } else {
          return response.json()
        }
      })
      .then(json => dispatch(receiveAquaria(sequence, json)))
      // .catch(dispatch(aquariaFailed(sequence)))

    fetch('http://www.uniprot.org/uniprot/P04637.xml', { timeout: 5000 })
      .then(response => {
        if (response.status >= 400) {
          throw response.status
        } else {
          return response.text()
        }
      })
      .then(xml => dispatch(receiveUniporot(sequence, xml)))
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
