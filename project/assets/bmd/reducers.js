import _ from 'underscore';
import {deepCopy} from 'shared/utils';

import { combineReducers } from 'redux';

import config from 'shared/reducers/Config';
import * as types from 'bmd/constants';

const defaultState = {
    endpoint: null,
    dataType: null,
    models: [],
    selectedModelIndex: null,
    selectedModel: null,
    bmrs: [],
    selectedBmrIndex: null,
    selectedBmr: null,
    allModelOptions: [],
    allBmrOptions: null,
    isExecuting: false,
    validationErrors: [],
};

var tmp;


function bmd(state=defaultState, action){
    switch (action.type){

    case types.RECEIVE_ENDPOINT:
        return Object.assign({}, state, {
            endpoint: action.endpoint,
            dataType: action.endpoint.data.data_type,
        });

    case types.RECEIVE_SESSION:

        // add key-prop to each values dict for parameter
        _.each(action.settings.allModelOptions,
            (d) => _.each(d.defaults, (v, k) => v.key = k));

        return Object.assign({}, state, {
            models: action.settings.models,
            bmrs: action.settings.bmrs,
            allModelOptions: action.settings.allModelOptions,
            allBmrOptions: _.indexBy(action.settings.allBmrOptions, 'type'),
        });

    case types.CREATE_MODEL:
        tmp = Object.assign(
            deepCopy(state.allModelOptions[action.modelIndex]),
            {overrides: {}}
        );
        return Object.assign({}, state, {
            models: [...state.models, tmp],
        });

    case types.SELECT_MODEL:
        return Object.assign({}, state, {
            selectedModelIndex: action.modelIndex,
            selectedModel: state.models[action.modelIndex],
        });

    case types.UPDATE_MODEL:
        tmp = deepCopy(state.models);
        tmp[state.selectedModelIndex].overrides = action.values;
        return Object.assign({}, state, {
            models: tmp,
            selectedModelIndex: null,
            selectedModel: null,
        });

    case types.DELETE_MODEL:
        tmp = state.models
            .slice(0, state.selectedModelIndex)
            .concat(state.models.slice(state.selectedModelIndex+1));
        return Object.assign({}, state, {
            models: tmp,
            selectedModelIndex: null,
            selectedModel: null,
        });

    case types.CREATE_BMR:
        return Object.assign({}, state, {
            bmrs: [...state.bmrs, _.values(state.allBmrOptions)[0]],
        });

    case types.SELECT_BMR:
        return Object.assign({}, state, {
            selectedBmrIndex: action.bmrIndex,
            selectedBmr: state.bmrs[action.bmrIndex],
        });

    case types.UPDATE_BMR:
        tmp = deepCopy(state.bmrs);
        tmp[state.selectedBmrIndex] = action.values;
        return Object.assign({}, state, {
            bmrs: tmp,
            selectedBmrIndex: null,
            selectedBmr: null,
        });

    case types.DELETE_BMR:
        tmp = state.bmrs
            .slice(0, state.selectedBmrIndex)
            .concat(state.bmrs.slice(state.selectedBmrIndex+1));
        return Object.assign({}, state, {
            bmrs: tmp,
            selectedBmrIndex: null,
            selectedBmr: null,
        });

    case types.VALIDATE:
        return Object.assign({}, state, {
            validationErrors: action.validationErrors,
            isExecuting: false,
        });

    case types.EXECUTE_START:
        return Object.assign({}, state, {
            isExecuting: true,
        });

    case types.EXECUTE_STOP:
        return Object.assign({}, state, {
            isExecuting: false,
        });

    default:
        return state;
    }
}

const rootReducer = combineReducers({
    config,
    bmd,
});

export default rootReducer;
