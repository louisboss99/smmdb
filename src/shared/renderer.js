import React from 'react'
import {
  Provider
} from 'react-redux'
import {
  Route, StaticRouter
} from 'react-router-dom'
import {
  ConnectedRouter
} from 'react-router-redux'
import createHistory from 'history/createBrowserHistory'

import initReducer from '../client/reducers'
import AppView from '../client/components/views/AppView'

import { ScreenSize } from '../client/reducers/mediaQuery'
import {
  setCourses, setCourses64, setStats, mediaQuery
} from '../client/actions'

export default function renderer (isServer = false, cb, preloadedState, req, courses, courses64, stats, isPhone, isTablet) {
  const history = isServer ? null : createHistory()

  const store = initReducer(preloadedState, history)
  if (isServer) {
    store.dispatch(setCourses(courses.map(course => course.toJSON()), false))
    store.dispatch(setCourses64(courses64.map(course => course.toJSON()), false))
    store.dispatch(setStats(stats))
    if (isPhone) store.dispatch(mediaQuery(ScreenSize.SUPER_SMALL))
    else if (isTablet) store.dispatch(mediaQuery(ScreenSize.SMALL))
  }

  const context = {}
  const jsx = <Provider store={store}>
    {
      isServer ? (
        <StaticRouter location={req.url} context={context}>
          <Route path='/' render={() => (
            <AppView isServer />
          )} />
        </StaticRouter>
      ) : (
        <ConnectedRouter history={history}>
          <Route path='/' component={AppView} />
        </ConnectedRouter>
      )
    }
  </Provider>
  const html = cb(jsx, !isServer && document.getElementById('root'))
  return [html, store.getState()]
}
