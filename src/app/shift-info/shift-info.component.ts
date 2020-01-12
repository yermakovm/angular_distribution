import {
	Component,
	OnInit,
	Input,
	Inject
} from "@angular/core";
import {
	DataService
} from "./../data.service";
import {
	Subscription
} from "rxjs";
import Chart from 'chart.js';

@Component({
	selector: "shift-info",
	templateUrl: "./shift-info.component.html",
	styleUrls: ["./shift-info.component.css"]
})
export class ShiftInfo implements OnInit {
	dataService: DataService;
	private subscription: Subscription;

	summary: string = "";
	cities;
	
	constructor(@Inject(DataService) dataService: DataService) {
		this.dataService = dataService;
	}

	ngOnInit() {
		this.cities = this.dataService.totalCount();
        //this.dataService.stats.newbee
	}
}