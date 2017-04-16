import { combineReducers } from 'redux'
import { dataBySequence, selectedSequence } from './sequenceDataReducer'
import { ui } from './viewReducer'

const rootReducer = combineReducers({
  dataBySequence,
  selectedSequence,
  ui,
})

export default rootReducer
