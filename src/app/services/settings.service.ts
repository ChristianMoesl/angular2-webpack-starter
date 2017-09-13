import { Injectable } from '@angular/core';
import { RoomService } from './room.service';
import { Settings } from 'poolcontroller-protocol';

@Injectable()
export class SettingsService {
    constructor(private room: RoomService) {
        this.room.connect('settings');
    }

    public async retreiveAll(): Promise<Settings | null> {
        return this.room.get()
            .then((result) => {
                return <Settings> result;
            }, (rej) => {
                return null;
            });
    }

    public async post(name: string, value: object): Promise<boolean> {
        let data = {};
        data[name] = value;

        return this.room.post(data)
            .then((result) => {
                return !(result as any).hasOwnProperty('error');
            }, (rej) => {
                return false;
            });
    }
}
