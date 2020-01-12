import {Component, OnInit, Inject} from "@angular/core";
import { DataService} from "./data.service";
import {Subscription} from "rxjs";
import { faUserAstronaut, faPlusCircle, faHistory, faSync} from '@fortawesome/free-solid-svg-icons';
import { faConfluence } from '@fortawesome/free-brands-svg-icons';
import { ActivatedRoute } from "@angular/router";
import { SortablejsOptions } from "angular-sortablejs";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    department;
    smes;
    faSync=faSync;
    faConfluence=faConfluence;
    faPlusCircle=faPlusCircle;
    faHistory=faHistory;
    faUserAstronaut=faUserAstronaut;
    spinIcon:boolean;
    dataService: DataService;
    isDataAvailable:boolean=false;
    loading:boolean = false;
    private subscription: Subscription;
    totalLoad: number = 0;
    user: any={};
    event={};
    private querySubscription: Subscription;
     constructor(@Inject(DataService) dataService: DataService, private route: ActivatedRoute) {
        this.dataService = dataService;
        this.spinIcon=false;
    }
    scrollbarConfig={
        wheelSpeed : 0.75
    }
    
  smeOptions: SortablejsOptions = {
        group: {
      name: 'sme',
      put: ['cs','sme'],
    },
    animation: 150,
  };
    
    async ngOnInit(){
     this.LoadData();
    }
    AddSme(form)
    {
        form.name;
        let temp = {
            name: form.name,
            teams:[],
            load:0,
            team: "",
            avatar: "assets/profile.png"
        }
        this.dataService.smes.push(temp);
    }

    LoadData() {
        this.isDataAvailable=false;
        this.loading=true;
        this.totalLoad =0;
        this.dataService.GetData().then((data) => {
            this.smes=this.dataService.smes=data;
            this.dataService.assignColor();
            this.dataService.assignLevel();
            this.dataService.smes.forEach(sme => {
            this.totalLoad += sme.load;
            this.isDataAvailable = true;
            this.loading=false;
        });
            });
        
        }

    }