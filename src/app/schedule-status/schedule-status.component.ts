import {
	Component,
	OnInit,
	Input,
	Inject,Output, EventEmitter
} from "@angular/core";
import {faHistory} from '@fortawesome/free-solid-svg-icons';

import {
	DataService
} from "./../data.service";
import {
	Subscription
} from "rxjs";
import { faLongArrowAltDown, faLongArrowAltUp} from '@fortawesome/free-solid-svg-icons';

@Component({
	selector: "schedule-status",
	templateUrl: "./schedule-status.component.html",
	styleUrls: ["./schedule-status.component.css"]
})
export class ScheduleStatus implements OnInit {
      @Output() rebuildEvent = new EventEmitter<string>();
      
    faHistory=faHistory;
	dataService: DataService;
	private subscription: Subscription;
	updatedMins:number;
	summary: string = "";
	cities;
    tabsOpened=false;
	faLongArrowAltDown=faLongArrowAltDown;
    faLongArrowAltUp=faLongArrowAltUp;
	constructor(@Inject(DataService) dataService: DataService) {
		this.dataService = dataService;
	}

	async ngOnInit() {
             this.updatedMins = Number(await this.dataService.GetSyncTime().toPromise());
			 this.cities = this.dataService.totalCount();
	}
	        callRebuild() {
    this.rebuildEvent.next();
  }
	    tabsToggle(){
        this.tabsOpened=!this.tabsOpened;
    }
}