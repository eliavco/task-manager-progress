import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as _ from 'lodash';

import { Manager } from 'src/app/models/manager.model';

@Injectable({
	providedIn: 'root'
})
export class ManagerService {
	private readonly deafultState: Manager = { tasks: { completed: 0, whole: 1 } };

	private readonly initialState = _.defaultsDeep((localStorage.manager ? JSON.parse(localStorage.manager) || {} : {}), this.deafultState);
	// tslint:disable-next-line: variable-name
	private readonly _manager = new BehaviorSubject<Manager>(this.initialState);
	readonly manager = this._manager.asObservable();
	get currentManager(): Manager {
		return this._manager.getValue();
	}
	set currentManager(nManager: Manager) {
		const newManager = _.defaultsDeep(nManager, this.currentManager);
		this._manager.next(newManager);
		localStorage.setItem('manager', JSON.stringify(newManager));
	}

	get completed(): number { return this.currentManager.tasks.completed; } get whole(): number { return this.currentManager.tasks.whole; }
	set completed(nCompleted: number) { this.currentManager = { tasks: { whole: undefined, completed: nCompleted } }; } set whole(nWhole: number) { this.currentManager = { tasks: { whole: nWhole, completed: undefined } }; }

	constructor() { }
}
