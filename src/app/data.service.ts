import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class DataService {
    private notify = new Subject < any > ();
    smes: any;
    event={};
    positions;
    stats={
    newbee:0,
    padawan:0,
    guru:0,
    jedi:0
    };
    department:string;
    info;
    shift_number: string;
    notifyObservable$ = this.notify.asObservable();
    totalNumber: number = 0;
    public notifyOther(data: any) {
        if (data) {
            this.notify.next(data);
        }
    }
    constructor(private http: HttpClient) {
        
    }
    GetSyncTime() {
        return this.http.get('https://mikesandbox.net/api/Distribution/synctime');
    }
    GetDepartment(){
       let event=this.parseFlockEvent();
       let nameSplitted=event.userName.split(' ')
       return this.http.get('https://mikesandbox.net:8043/user/department?name='+nameSplitted[0]+' '+nameSplitted[1]);
    }
    parseFlockEvent = () =>{
    var url_string = window.location.href;
    var url = new URL(url_string);
    var event = url.searchParams.get("flockEvent");
    return JSON.parse(event);
    }
    GetInfo()
    {
        return this.http.get('https://mikesandbox.net/api/Distribution/info?dep='+this.department);
    }
  GetData = async () => {
     this.department = String(await this.GetDepartment().toPromise());
     if (this.department=="CS Technical")
     this.department="Hosting";
     this.info=await this.GetInfo().toPromise();
     this.positions=await this.GetPositionStats().toPromise();
     console.log(this.positions);
     return this.http.get('https://mikesandbox.net/api/Distribution/?dep='+this.department).toPromise();
 }
    updateData(arr: any) {
        this.smes.next(arr);
    }
    GetPositionStats(){
         return this.http.get('https://mikesandbox.net/api/Distribution/positions?dep='+this.department);
    }
    
    assignLevel(): void {

        this.smes.forEach(sme => {
             if(Array.isArray(sme.teams))
            sme.teams.forEach(team => {
                team.teammates.forEach(cs => {
                    cs["levelClassName"] = cs.level.replace(/\s+/g, "-").toLowerCase();
                    switch (cs.levelClassName) {
                      case "newbee":
                        cs.stars=1;
                        this.stats.newbee++;
                        break;
                      case "skilled-padawan":
                        cs.stars=2;
                        this.stats.padawan++;
                        break;
                      case "google-guru":
                        this.stats.guru++;  
                        cs.stars=3;
                        break;
                        case "jedi-master":
                        this.stats.jedi++;
                        cs.stars=4;
                        break;
                    }
                });
            });
        });
    }
    assignColor(): void {
        this.smes.forEach(sme => {
             if(Array.isArray(sme.teams))
            sme.teams.forEach(team => {
                team["className"] = this.department.toLowerCase()+'-'+team.name.replace(/\s+/g, "-").toLowerCase();
            });
        });
    }
    
    totalCount(): any {
        let cities = [{
                name: "Kharkiv",
                count: 0
            },
            {
                name: "Lviv",
                count: 0
            },
            {
                name: "Dnipro",
                count: 0
            }
        ];
        
        this.smes.forEach(sme => {
              if (sme.location==="Kharkiv") cities[0].count++;
                if (sme.location==="Lviv")  cities[1].count++;
                if (sme.location==="Dnipro") cities[2].count++;
            sme.hasKharkiv=false;sme.hasLviv=false;sme.hasDnipro=false;
            sme.hasOnly=[];
            if(Array.isArray(sme.teams))
            sme.teams.forEach(team => {
                team.teammates.forEach(cs => {
                    if (cs.location==="Kharkiv") {
                        cities[0].count++;
                        sme.hasKharkiv=true;
                    }
                    if (cs.location==="Lviv") {
                        cities[1].count++;
                        sme.hasLviv=true;
                    }
                    if (cs.location==="Dnipro") {
                        cities[2].count++;
                        sme.hasDnipro=true;
                    }
                });
            });
        });
        this.smesHaveSingleLocation();
        return cities;
    }

    smesHaveSingleLocation(){
      for (let i = 0; i < this.smes.length; i++) {
        let temp = this.smes.slice();
        temp.splice(i,1);
        let kh=temp.every(x=>!x.hasKharkiv);
        let lv=temp.every(x=>!x.hasLviv);
        let dn=temp.every(x=>!x.hasDnipro);
        if(this.smes[i].hasKharkiv&&kh)
            this.smes[i].hasOnly.push("Kharkiv");
        if(this.smes[i].hasLviv&&lv)
            this.smes[i].hasOnly.push("Lviv");
        if(this.smes[i].hasDnipro&&dn)
            this.smes[i].hasOnly.push("Dnipro");
        }
    }
    
    getTRList = () => {
        let arr = [];
        this.smes.forEach(sme => {
            if(Array.isArray(sme.teams))
            sme.teams.forEach(team => {
                team.teammates.forEach(cs => {
                    if (cs.shift_role === "Tickets only") arr.push(cs);
                });
            });
        });
        return arr;
    };

    getSmeList = () => {
        let arr = [];
        this.smes.forEach(sme => {
            arr.push(sme);
        });
        return arr;
    };
    getRR = () => {
        let rr;
        this.smes.forEach(sme => {
             if(Array.isArray(sme.teams))
            sme.teams.forEach(team => {
                team.teammates.forEach(cs => {
                    if (cs.shift_role === "Flock") rr = cs;
                });
            });
        });
        return rr;
    };
    getPE = () => {
        let pe = [];
        this.smes.forEach(sme => {
             if(Array.isArray(sme.teams))
            sme.teams.forEach(team => {
                team.teammates.forEach(cs => {
                    if (cs.shift_role === "OX") pe.push(cs);
                });
            });
        });
        return pe;
    };

    getDistribution = () => {
        return this.smes;
    };
    convertToSME(csId:number){
        this.smes.forEach(sme =>{
            sme.teams.forEach(team =>{
                team.teammates.forEach(cs=>{
                    if(team.teammates.indexOf(cs)===csId)
                    {
                    team.teammates.splice(csId, 1);
                    this.smes.push({
                        load:0,
                        z3kid: cs.z3kId,
                        name: cs.name,
                        team: cs.team,
                        location: cs.location,
                        avatar: cs.avatar
                    })
                    }
                })
            })
        })
    }
}