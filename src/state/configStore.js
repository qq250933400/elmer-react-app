import { createStore } from 'redux';
import Reducers from './reducers';
import devToolsEnhancer from 'remote-redux-devtools';
/* eslint-disable no-underscore-dangle */
const store = createStore(
    Reducers,
    {},
    devToolsEnhancer()
);
/* eslint-enable no-underscore-dangle */
export default store;
