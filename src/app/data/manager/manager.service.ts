import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

import { Manager } from 'src/app/models/manager.model';
import { BroadcastChannelService } from 'src/app/services/broadcast-channel/broadcast-channel.service';

@Injectable({
	providedIn: 'root'
})
export class ManagerService {
	private readonly deafultState: Manager = { tasks: { completed: 0, whole: 1 } };
	private readonly localStorageItem = 'manager';
	private get initialState(): Manager {
		return _.defaultsDeep((localStorage.manager ? JSON.parse(localStorage.manager) || {} : {}), this.deafultState);
	}
	// tslint:disable-next-line: variable-name
	private readonly _manager = new BehaviorSubject<Manager>(this.initialState);
	readonly manager = this._manager.asObservable();
	get currentManager(): Manager {
		return this._manager.getValue();
	}
	set currentManager(nManager: Manager) {
		const newManager = _.defaultsDeep(nManager, this.currentManager);
		this._manager.next(newManager);
		localStorage.setItem(this.localStorageItem, JSON.stringify(newManager));
	}

	get completed(): number { return this.currentManager.tasks.completed; } get whole(): number { return this.currentManager.tasks.whole; }
	set completed(nCompleted: number) { this.currentManager = { tasks: { whole: undefined, completed: nCompleted } }; this.bc.sendUpdated(); } set whole(nWhole: number) { this.currentManager = { tasks: { whole: nWhole, completed: undefined } }; this.bc.sendUpdated(); }

	reset() {
		localStorage.removeItem(this.localStorageItem);
		this.update();
	}

	update() {
		this.currentManager = this.initialState;
	}

	constructor(private bc: BroadcastChannelService) { 
		this.bc.addEventListener({ code: 0, cb: this.update.bind(this) });
	}
}
