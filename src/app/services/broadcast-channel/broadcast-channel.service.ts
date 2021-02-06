import { Injectable } from '@angular/core';
import { ChannelEventListener } from 'src/app/models/event-listener.model';

const channelName = 'channel_1_messages';
const bc = new BroadcastChannel(channelName);

@Injectable({
	providedIn: 'root'
})
export class BroadcastChannelService {
	private readonly bc = bc;
	private readonly eventListeners: ChannelEventListener[] = [];

	constructor() {
		this.bc.onmessage = ev => { this.receiveMessage(ev); }
	}

	private sendMessage(m): void {
		this.bc.postMessage(m);
	}

	private receiveMessage(m): void {
		const { data } = m;
		this.eventListeners.forEach(evl => {
			if (data === evl.code) {
				evl.cb();
			}
		});
	}

	sendUpdated(): void {
		this.sendMessage(0);
	}

	addEventListener(ev: ChannelEventListener): void {
		this.eventListeners.push(ev);
	}
}
