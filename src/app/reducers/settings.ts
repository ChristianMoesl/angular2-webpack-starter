import { ActionReducer, Action } from '@ngrx/store';
import * as setting from '../actions/settings';
import { Settings, OperationMode } from 'poolcontroller-protocol';

export interface SettingsState {
    settings: Settings;
    isValid: boolean;
}

export const initialState: SettingsState = {
    settings: {
        pumpTime: 0,
        pumpIntervall: 0,
        operationMode: OperationMode.automatic,
        targetTemperature: 0,
        temperatureThreshold: 0,
    },
    isValid: false,
};

export function settingsReducer(state: SettingsState = initialState, action: setting.Actions): SettingsState {
    switch (action.type) {
        case setting.UPDATE_COMPLETED:
            return {
                ...state,
                settings: action.payload,
                isValid: true,
            };
        case setting.UPDATE_FAILED:
            return {
                ...state,
                isValid: false,
            };
        case setting.CHANGE:
            return {
                ...state,
                isValid: false,
            };
        case setting.CHANGE_COMPLETED:
            let tmp = {
                isValid: true,
                settings: {
                    ...state.settings,
                }
            };

            tmp.settings[action.payload.name] = action.payload.value;

            return tmp;
        case setting.CHANGE_FAILED:
            return {
                ...state,
                isValid: true,
            };
        default:
            return state;
    }
}
