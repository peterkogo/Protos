import { combineReducers } from 'redux'
import { routerReducer } from 'redux-first-routing'
import { dataBySequence, selectedSequence } from './sequenceDataReducer'
import { ui } from './viewReducer'

const rootReducer = combineReducers({
  dataBySequence,
  selectedSequence,
  ui,
  router: routerReducer,
})

export default rootReducer
