import { compose } from '@ngrx/core/compose';
import { ActionReducer, ActionReducerMap, combineReducers } from '@ngrx/store';

import { SettingsState, settingsReducer, initialState as initialSettingsState } from './reducers/settings';

export interface AppState {
    settings: SettingsState;
}

export const reducers: ActionReducerMap<AppState> = {
  settings: settingsReducer,
};

export const initialState: AppState = {
  settings: initialSettingsState,
};
