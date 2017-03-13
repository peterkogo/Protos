import { combineReducers } from 'redux'
import { dataBySequence, selectedSequence } from './sequenceDataReducer'
import { ui } from './viewReducer'
import { visState } from './radialVisReducer'

const rootReducer = combineReducers({
  dataBySequence,
  selectedSequence,
  ui,
  visState,
})

export default rootReducer
