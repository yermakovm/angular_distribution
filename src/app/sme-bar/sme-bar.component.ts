import { Component, OnInit, Input, Inject } from "@angular/core";
import { SortablejsOptions } from "angular-sortablejs";
import { DataService } from "./../data.service";
import { faTimes, faUserPlus, faUsers, faAngleUp, faAngleDown, faEllipsisH, faTrashAlt, faPlusCircle, faPlus, faMinus, faBars, faList} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: "sme-bar",
  templateUrl: "./sme-bar.component.html",
  styleUrls: ["./sme-bar.component.css"],
  //providers: [SortableService]

})
export class SMEBar implements OnInit {
  currentRate = 0;
  faList=faList;
  faPlus=faPlus;
  faBars=faBars;
  faMinus=faMinus;
  faTrashAlt=faTrashAlt;
  faPlusCircle=faPlusCircle;
  faEllipsisH=faEllipsisH;
  faAngleUp=faAngleUp;
  faAngleDown=faAngleDown;
  faTimes = faTimes;
  faUserPlus=faUserPlus;
  faUsers=faUsers;
  @Input() name: string;
  @Input() teams;
  @Input() avatar:string;
  @Input() load: number;
  @Input() totalLoad: any;
  @Input() id: number;
  isRemovable=true;
  csnumber: number;
  progressbarLoad: number;
  progressbarColor: string;
  toggle = false;
  teamsToggle=false;
  dataService: DataService;
  constructor(@Inject(DataService) dataService: DataService) {
    this.dataService = dataService;
  }
  csOptions: SortablejsOptions = {
        group: {
      name: 'cs',
      put: false,
    },
    animation: 150,
    onRemove: (event: any) => {
      this.updateLoad();
    },
    onAdd: (event: any) => {
      this.updateLoad();
    }
  };
  
  teamOptions: SortablejsOptions = {
    group: "team",
    animation: 150,
    onRemove: (event: any) => {
      this.updateLoad();

    },
    onAdd: (event: any) => {
      this.updateLoad();
    }
  };

  updateLoad() {
      this.csnumber =0;
      this.progressbarLoad=0;
    this.teams.forEach(team => {
      this.csnumber += team.teammates.length;
    });
    
    let load: number = 0;
    this.teams.forEach(team => {
      load += team.total_weight;
    });
    this.load = load;
    this.progressbarLoad = +(load / this.totalLoad * 100).toFixed(1);
    let color: string = "#ffc107";
    if (+this.progressbarLoad < 50) color = "#28a745";
    else if (+this.progressbarLoad > 75) color = "#dc3545";
    this.progressbarColor = color;
    this.dataService.totalCount();
    this.dataService.notifyOther({
      option: "call_other",
      value: "From sme-bar"
    });
    this.BlendTeamColors();
    this.csnumber===0 ? this.isRemovable=true : this.isRemovable=false;
  }
  
    DeleteSME(){
        for( var i = 0; i < this.dataService.smes.length; i++){ 
   if ( this.dataService.smes[i].name === this.name) {
     this.dataService.smes.splice(i, 1); 
   }
   this.dataService.notifyOther({
      option: "call_other",
      value: "From sme-bar"
    });
    }
    }
  ngOnInit() {
    this.updateLoad();
   
    
  }
  
  BlendTeamColors(){
             var cslist= document.getElementsByName('teammate');
    Array.from(cslist).forEach(cs => {
        const style = getComputedStyle(cs);
        let rgb = style["background-color"].substring(4, style["background-color"].length-1)
         .replace(/ /g, '')
         .split(',');
        cs.style.backgroundColor=`rgba(${rgb[0]},${rgb[1]},${rgb[2]},0.2)`;
    })
  }
  toggleTeams(){
    this.teamsToggle=!this.teamsToggle;
  }
  ngAfterViewInit(){
    this.BlendTeamColors();
  }

}
