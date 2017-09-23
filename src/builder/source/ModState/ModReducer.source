import { get } from 'lodash';
import Reducers, { InitState } from './index';

const InitializeState = {
    ...InitState
};

const getExtendReducerState = (state, action) => {
    const keys = Object.keys(Reducers);
    let returnState = null;
    keys.map((key) => {
        const rKey = key.replace(/(Reducer)$/, '');
        const newStateValue = Reducers[key](get(state, rKey, {}), action);
        if (newStateValue !== undefined && newStateValue !== null) {
            const nState = {
                ...state
            };
            nState[rKey] = {
                ...InitializeState[rKey],
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
