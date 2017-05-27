import { Action } from '@ngrx/store';

import { Settings } from 'poolcontroller-protocol';

export const UPDATE = '[Settings] update';
export const UPDATE_COMPLETED = '[Settings] update completed';
export const UPDATE_FAILED = '[Settings] update failed';
export const CHANGE = '[Settings] change';
export const CHANGE_COMPLETED = '[Settings] change completed';
export const CHANGE_FAILED = '[Settings] change failed';

export class UpdateAction implements Action {
    public readonly type = UPDATE;
}

export class UpdateCompletedAction implements Action {
    public readonly type = UPDATE_COMPLETED;

    constructor(public payload: Settings) { }
}

export class UpdateFailedAction implements Action {
    public readonly type = UPDATE_FAILED;
}

export class ChangeAction implements Action {
    public readonly type = CHANGE;
    public payload: object;

    constructor(name: string, value: any) {
        this.payload = {
            name,
            value,
        };
    }
}

export class ChangeCompletedAction implements Action {
    public readonly type = CHANGE_COMPLETED;
    public payload: object;

    constructor(name: string, value: any) {
        this.payload = {
            name,
            value,
        };
    }
}

export class ChangeFailedAction implements Action {
    public readonly type = CHANGE_FAILED;
}
