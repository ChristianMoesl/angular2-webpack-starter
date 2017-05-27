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
                return new Settings.UpdateCompleteAction(answer);
            }
            return new Settings.UpdateFailedAction();
        });

    constructor(private actions$: Actions, private settingsService: SettingsService) { }
}
