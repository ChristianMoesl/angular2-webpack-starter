import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { SettingsService } from '../services/settings.service';
import * as Settings from '../actions/settings';

@Injectable()
export class SettingEffects {

    @Effect()
    public update$: Observable<Action> = this.actions$
        .ofType(Settings.UPDATE)
        .switchMap(async (action) => {
            const answer = await this.settingsService.retreiveAll();

            if (answer) {
                return new Settings.UpdateCompletedAction(answer);
            }
            return new Settings.UpdateFailedAction();
        });

    @Effect()
    public change$: Observable<Action> = this.actions$
        .ofType(Settings.CHANGE)
        .map((action) => action.payload)
        .switchMap(async (action) => {
            const answer = await this.settingsService.post(action.name, action.value);

            if (answer) {
                return new Settings.ChangeFailedAction();
            }

            return new Settings.ChangeCompletedAction(action.name, action.value);
        });

    constructor(private actions$: Actions, private settingsService: SettingsService) { }
}
