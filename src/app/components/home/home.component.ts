import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import ProgressBar from 'progressbar.js';

import { ManagerService } from 'src/app/data/manager/manager.service';

const barSettings = {
	color: '#aaa',
	// This has to be the same size as the maximum width to
	// prevent clipping
	strokeWidth: 4,
	trailWidth: 1,
	easing: 'easeInOut',
	duration: 1400,
	text: {
		autoStyleContainer: false
	},
	from: { color: '#aaa', width: 1 },
	to: { color: '#333', width: 4 },
	// Set default step function for all animate calls
	step: function (state, circle) {
		circle.path.setAttribute('stroke', state.color);
		circle.path.setAttribute('stroke-width', state.width);

		const value = Math.round(circle.value() * 100);
		circle.setText(value + '%');
	}
};

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {
	@ViewChild('container') private readonly _container;
	get container() { return this._container.nativeElement; }
	bar;
	whole = this.manager.whole;
	completed = this.manager.completed;

	constructor(private manager: ManagerService) { }

	ngOnInit(): void {
		this.initializeManager();
	}
	
	initializeManager() {
		this.manager.manager.subscribe(nManager => {
			this.completed = nManager.tasks.completed;
			this.whole = nManager.tasks.whole;
		});
	}

	reset() {
		this.manager.reset();
		this.animate();
	}

	incrementTasks(increment: boolean): void {
		const { completed, whole } = this.manager;
		if ((increment && (completed < whole)) || (!increment && (completed > 0))) {
			increment ? this.manager.completed += 1 : this.manager.completed -= 1;
			this.animate();
		}
	}

	animate(): void {
		this.bar.animate(this.manager.completed / this.manager.whole);
	}

	wholeChanged(): void {
		if (this.whole > 999 || this.whole < 1) { this.whole > 999 ? this.whole = 999 : this.whole = 1; }
		if (this.whole < this.completed) {
			this.manager.whole = this.manager.completed = this.whole;
		} else {
			this.manager.whole = this.whole;
		}
		this.animate();
	}

	ngAfterViewInit(): void {
		this.bar = new ProgressBar.Circle(this.container, barSettings);
		this.animate();
	}

}
