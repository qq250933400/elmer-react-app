import { get } from 'lodash';
import { ModReducers } from './index';

const InitializeState = {
    AppMobile: 'testProject',
    ModIndex: {}
};

const getExtendReducerState = (state, action) => {
    const keys = Object.keys(ModReducers);
    let returnState = null;
    keys.map((key) => {
        const rKey = key.replace(/(Reducer)$/, '');
        const newStateValue = ModReducers[key](get(state, rKey, {}), action);
        if (newStateValue !== undefined && newStateValue !== null) {
            const nState = {
                ...state
            };
            nState[rKey] = {
                ...newStateValue
            };
            returnState = nState;
            return nState;
        }
    });
    return returnState;
};
export default (state = InitializeState, action) => {
    const newState = getExtendReducerState(state, action);
    let newActionState = {};
    if (newState !== undefined && newState !== null) {
        newActionState = {
            ...state,
            ...newState
        };
    } else {
        switch (action.type) {
            default:
                newActionState = state;
        }
    }
    return newActionState;
};
