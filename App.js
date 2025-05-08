import React from 'react';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import Navigation from './src/navigation';
import store from './src/store';

const App = () => {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
};

AppRegistry.registerComponent('main', () => App);

export default App; 