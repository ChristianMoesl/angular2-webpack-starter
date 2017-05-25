import * as io from 'socket.io-client';
import { Injectable } from '@angular/core';

@Injectable()
export class RoomService {
    private socket: any;

    constructor() {
        this.socket = io('http://localhost/settings');
        this.socket.on('messageFromServer', d => {
            console.log('Receive');
            console.log(d);
        });
    }

    send() {
        this.socket.emit('messageFromClient', { command: 'GET', message: 'settings', version: { major: 1, minor: 0 }, data: {}});
    }
}
