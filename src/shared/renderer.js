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

import Socket      from '../client/socket'
import initReducer from '../client/reducers'
import AppView     from '../client/components/views/AppView'

import { ScreenSize } from '../client/reducers/mediaQuery'
import {
    setCourses, setStats, mediaQuery
} from '../client/actions'

export default function renderer (isServer = false, cb, preloadedState, req, courses, stats, isMobile) {
    const history = isServer ? null : createHistory();

    const socket = isServer ? null : new Socket();
    const store = initReducer(preloadedState, history, socket);
    if (isServer) {
        store.dispatch(setCourses(courses, false));
        store.dispatch(setStats(stats));
        //console.log(isMobile)
        if (isMobile) store.dispatch(mediaQuery(ScreenSize.SMALL));
    }
    if (!isServer) socket.setStore(store);

    const context = {};
    const html = cb(
        <Provider store={store}>
            {
                isServer ? (
                    <StaticRouter location={req.url} context={context}>
                        <Route path="/" render={() => (
                            <AppView isServer />
                        )} />
                    </StaticRouter>
                ) : (
                    <ConnectedRouter history={history}>
                        <Route path="/" component={AppView} />
                    </ConnectedRouter>
                )
            }
        </Provider>,
        !isServer && document.getElementById('root')
    );
    return [html, store.getState()];
}