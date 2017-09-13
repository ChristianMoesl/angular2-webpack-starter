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
        .ofType<Settings.UpdateAction>(Settings.UPDATE)
        .map((action: Settings.UpdateAction) => action.payload)
        .switchMap(async (action) => {
            const answer = await this.settingsService.retreiveAll();

            if (answer)
                return new Settings.UpdateCompletedAction(answer);

            return new Settings.UpdateFailedAction();
        });

    @Effect()
    public change$: Observable<Action> = this.actions$
        .ofType<Settings.ChangeAction>(Settings.CHANGE)
        .map((action: Settings.ChangeAction) => action.payload)
        .switchMap(async (action) => {
            const answer = await this.settingsService.post(action.name, action.value);

            if (answer)
                return new Settings.ChangeCompletedAction(action.name, action.value);

            return new Settings.ChangeFailedAction();
        });

    constructor(private actions$: Actions, private settingsService: SettingsService) { }
}
