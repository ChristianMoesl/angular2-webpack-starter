import { Action } from '@ngrx/store';

import { Settings } from 'poolcontroller-protocol';

export const UPDATE = '[Settings] update';
export const UPDATE_COMPLETE = '[Settings] update complete';
export const UPDATE_FAILED = '[Settings] update failed';

export class UpdateAction implements Action {
    public readonly type = UPDATE;
}

export class UpdateCompleteAction implements Action {
    public readonly type = UPDATE_COMPLETE;

    constructor(public payload: Settings) { }
}

export class UpdateFailedAction implements Action {
    public readonly type = UPDATE_FAILED;
}
