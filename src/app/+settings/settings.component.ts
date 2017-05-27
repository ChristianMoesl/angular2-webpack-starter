import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../app.store';
import * as Settings from '../actions/settings';
import { Observable } from 'rxjs';

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
export class SettingsComponent {
  public pumpTime: string;

  constructor(private store: Store<AppState>) {
    this.store.dispatch(new Settings.UpdateAction());
    this.store.subscribe((s) => {
      this.pumpTime = this.numberToTime(s.settings.settings.pumpTime);
    });
  }

  public saveSetting(setting: string) {
    switch (setting) {
      case 'pumpTime':
        this.store.dispatch(new Settings.ChangeAction('pumpTime', this.timeToNumber(this.pumpTime)));
        break;
      default:
        console.error('Unkown setting won\'t be saved');
    }
  }

  private numberToTime(num: number): string {
    const hours = Math.floor(num / 60);
    const minutes = num % 60;

    if (hours >= 24) {
      throw RangeError(`Cannot convert ${num} to time`);
    }

    let str: string;
    if (hours >= 10) {
      str = `${hours}`;
    } else {
      str = `0${hours}`;
    }

    if (minutes >= 10) {
      str = str.concat(`:${minutes}`);
    } else {
      str = str.concat(`:0${minutes}`);
    }

    return str;
  }

  private timeToNumber(time: string): number {
    return 60 * parseInt(time.substr(0, 2), 10)
          + parseInt(time.substr(3, 2), 10);
  }

}
