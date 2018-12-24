import React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {Router,hashHistory} from 'react-router';
import {syncHistoryWithStore} from 'react-router-redux';
import {LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import configureStore from './features/configureStore';
import routers from './features/routers';
import ErrorBoundary from './features/components/ErrorBoundary'

const store = configureStore();
const history = syncHistoryWithStore(hashHistory,store);

render(
  // <ErrorBoundary>
  <LocaleProvider locale={zh_CN}>
  <Provider store={store}>
    <Router routes={routers} history={history}></Router>
  </Provider>
  </LocaleProvider>
  // </ErrorBoundary>
  ,document.getElementById('craw-root-container')
)