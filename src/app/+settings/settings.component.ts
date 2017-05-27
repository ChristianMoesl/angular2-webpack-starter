import {
  Component,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.store';
import * as Settings from '../actions/settings';

/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Settings` component loaded asynchronously');

@Component({
  selector: 'settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {

  constructor(private store: Store<AppState>) {
    this.store.dispatch(new Settings.UpdateAction());
  }

  public ngOnInit() {
    console.log('hello `Settings` component');
  }

}
