import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import WebFontLoader from 'webfontloader';

import AppContainer from './containers/app';
import ElectronService from './services/electron';
import storeWrapper, { history } from './stores/store';

import './index.css';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

ElectronService.getInitialState(( initialState ) => {
  console.log('INITIAT', initialState);
  const store = storeWrapper(initialState);

  const target = document.querySelector('#root');

  render(
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <AppContainer />
      </ConnectedRouter>
    </Provider>,
    target
  );
})


