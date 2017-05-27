import * as assert from 'assert';
import { connect } from 'socket.io-client';
import { Event, EventDispatcher } from '../util/Event';
import { Message, Version, Command } from 'poolcontroller-protocol';
import { Injectable } from '@angular/core';

@Injectable()
export class RoomService {
    private socket: any;
    private room: string;
    private resolver: (o: object) => void = null;
    private rejecter: (e: Error) => void = null;
    private notificationEvent = new EventDispatcher<RoomService, Message>();

    public notification(): Event<RoomService, Message> {
        return this.notificationEvent;
    }

    public async connect(room: string): Promise<void> {
        this.socket = connect(`http://localhost/${room}`);
        this.room = room;

        const promise = new Promise<void>((resolve, reject) => {
            const self = this;

            this.socket.on('connect', () => {
                self.socket.off('connect');
                resolve();
            });
            this.socket.on('connect_failed', () => {
                self.socket.off('connect_failed');
                reject(new Error('Connect to server failed'));
            });
        });

        this.socket.on('server-message', (d) => this.onReceive(d));

        return promise;
    }

    public async get(version: Version = new Version(1, 0)): Promise<object | Error> {
        const promise = new Promise<object>((resolve, reject) => {
            assert(this.resolver === null);
            assert(this.rejecter === null);

            this.resolver = resolve;
            this.rejecter = reject;
        });

        const msg = new Message(Command.GET, this.room, version);

        this.socket.emit('client-message', msg.serialize());

        return promise;
    }

    private processRequest(msg: Message) {
        assert(!msg.isAnswer());

        switch (msg.getCommand()) {
            case Command.GET:
            case Command.POST:
                console.warn(`Illegal command ${Command[msg.getCommand()]} from server to client`);
                break;
            case Command.NOTIFICATION:
                this.notificationEvent.dispatch(this, msg);
                break;
            default:
                throw Error(`Unkown command ${Command[msg.getCommand()]}`);
        }
    }

    private onReceive(data: object) {
        if (this.resolver === null) {
            try {
                const msg = Message.deserialize(data);

                if (msg.isAnswer()) {
                    console.warn(`Got unexpected message`);
                } else {
                    this.processRequest(msg);
                }
            } catch (e) {
                console.warn(e);
            }
        } else {
            try {
                const msg = Message.deserialize(data);
                this.resolver(msg.getData());
            } catch (e) {
                this.rejecter(e);
            }

            this.resolver = null;
            this.rejecter = null;
        }
    }
}
