import { compose } from '@ngrx/core/compose';
import { ActionReducer, combineReducers } from '@ngrx/store';

import { SettingsState, settingsReducer } from './reducers/settings';

export interface AppState {
    settings: SettingsState;
}

export const reducers = {
  settings: settingsReducer,
};

// Generate a reducer to set the root state in dev mode for HMR
function stateSetter(reducer: ActionReducer<any>): ActionReducer<any> {
  return (state, action) => {
    if (action.type === 'SET_ROOT_STATE') {
      return action.payload;
    }
    return reducer(state, action);
  };
}

export const rootReducer = compose(stateSetter, combineReducers)(reducers);
