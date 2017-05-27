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
        const promise = new Promise<object | Error>((resolve, reject) => {
            assert(this.resolver === null);
            assert(this.rejecter === null);

            this.resolver = resolve;
            this.rejecter = reject;
        });

        const msg = new Message(Command.GET, this.room, version);

        this.socket.emit('client-message', msg.serialize());

        return promise;
    }

    public async post(data: Object, version: Version = new Version(1, 0)): Promise<object | Error> {
        const promise = new Promise<Error | undefined>((resolve, reject) => {
            assert(this.resolver === null);
            assert(this.rejecter === null);

            this.resolver = resolve;
            this.rejecter = reject;
        });

        const msg = new Message(Command.POST, this.room, version, data);

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

    private processAnswer(msg: Message) {
        switch (msg.getCommand()) {
            case Command.ACK:
                this.resolver(msg.getData());
                break;
            case Command.NAK:
                if (msg.getData().hasOwnProperty('error')) {
                    let tmp: any = msg.getData();
                    this.rejecter(new Error(tmp.error.msg));
                } else {
                    this.rejecter(new Error('Received unkown nak format'));
                }
                break;
            default:
                throw RangeError(`Unkown command ${msg.getCommand()}`);
        }

        this.resolver = null;
        this.rejecter = null;
    }

    private onReceive(data: object) {
        let msg: Message;
        try {
            msg = Message.deserialize(data);

            if (msg.isAnswer()) {
                if (this.resolver === null) {
                    console.warn(`Got unexpected message`);
                } else {
                    this.processAnswer(msg);
                }
            } else {
                this.processRequest(msg);
            }
        } catch (e) {
            if (this.resolver !== null) {
                this.rejecter(e);
                this.rejecter = null;
                this.resolver = null;
            }
            console.warn(e);
        }
    }
}
