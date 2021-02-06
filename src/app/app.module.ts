import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { BroadcastChannelService } from './services/broadcast-channel/broadcast-channel.service';
import { ManagerService } from './data/manager/manager.service';
import { HomeComponent } from './components/home/home.component';
import { FormsModule } from '@angular/forms';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
	],
	providers: [
		ManagerService,
		BroadcastChannelService,
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
