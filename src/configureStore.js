import { createStore, applyMiddleware, compose } from 'redux'
import { createBrowserHistory, routerMiddleware, startListener /* , push */ } from 'redux-first-routing'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'
import rootReducer from '../actions/rootReducer'

const history = createBrowserHistory()

const routingMiddleware = routerMiddleware(history)

const loggerMiddleware = createLogger()
// eslint-disable-next-line no-underscore-dangle
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

function configurePaths(store) {
  startListener(history, store)
  // store.dispatch(push('?protein=P04637&structure=4qo1&chain=B'))
}

export default function configureStore(preloadedState) {
  const store = createStore(
                  rootReducer,
                  preloadedState,
                  composeEnhancers(
                    applyMiddleware(
                      thunkMiddleware,
                      loggerMiddleware,
                      routingMiddleware,
                    ),
                  ),
                )
  configurePaths(store)
  return store
}
