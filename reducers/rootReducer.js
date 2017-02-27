import { combineReducers } from 'redux'
import { dataBySequence, selectedSequence } from './sequenceData'
import { dataVisibility, ui } from './viewReducer'

const rootReducer = combineReducers({
  dataBySequence,
  selectedSequence,
  dataVisibility,
  ui,
})

export default rootReducer
