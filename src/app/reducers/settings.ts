import { ActionReducer, Action } from '@ngrx/store';
import * as Actions from '../actions/settings';
import { Settings } from 'poolcontroller-protocol';

export interface SettingsState {
    settings: Settings;
    isValid: boolean;
}

const initialState: SettingsState = {
    settings: {
        pumpTime: 0,
        pumpIntervall: 0,
    },
    isValid: false,
};

export function settingsReducer(state: SettingsState = initialState, action: Action): SettingsState {
    switch (action.type) {
        case Actions.UPDATE_COMPLETE:
            return {
                ...state,
                settings: action.payload,
                isValid: true,
            };
        case Actions.UPDATE_FAILED:
            return {
                ...state,
                isValid: false,
            };
        default:
            return state;
    }
}
