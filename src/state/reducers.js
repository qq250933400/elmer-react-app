import { combineReducers } from 'redux';
import AppReducer from './storeActions';

const initState = {
};
const rootReducer = (state = initState, action) => {
    return state;
};

const reducers = combineReducers({
    root: rootReducer,
    ...AppReducer
});

export default reducers;
