import { Component, OnInit, Input, Inject } from "@angular/core";
import { DataService } from "./../data.service";
import { Subscription } from "rxjs";
import { faClone } from '@fortawesome/free-solid-svg-icons';
@Component({
  selector: "canned-reply",
  templateUrl: "./canned-reply.component.html",
  styleUrls: ["./canned-reply.component.css"]
})
export class CannedReply implements OnInit {
  faClone=faClone;
  reply: string = "";
  distribution: string = "";
  private subscription: Subscription;
  dataService: DataService;
  constructor(@Inject(DataService) dataService: DataService) {
    this.dataService = dataService;
  }
  ngOnInit() {
    this.buildReply();
    this.subscription = this.dataService.notifyObservable$.subscribe(res => {
      if (res.hasOwnProperty("option") && res.option === "call_other") {
        {
            this.buildReply();
            this.updateDistribution();
        }
      }
    });
  }

  copyToClipboard() {
    let el = document.getElementById("reply1");
    let val = el.innerText;
    el = document.getElementById("reply2");
    val+="\n\n"+el.innerText;
    let selBox = document.createElement("textarea");
    selBox.style.position = "fixed";
    selBox.style.left = "0";
    selBox.style.top = "0";
    selBox.style.opacity = "0";
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand("copy");
    document.body.removeChild(selBox);
    let btn = document.getElementById("copy-status");
    btn.innerHTML = "Copied to clipboard!";
    setTimeout(function() {
      btn.innerHTML = " Copy";
    }, 2000);
  }

  printData(datafunction) {
    let message = "";
    let data = datafunction();
    if (Array.isArray(data)) {
      data.forEach(el => {
        message += `@${el.name} `;
      });
    } else {
      message += `@${data.name} `;
    }
    this.reply += message;
  }

  buildReply() {
    this.reply="";
    let shift = this.dataService.info.periodName;
    this.reply = `Welcome to the ${shift} shift!\nToday you may contact:\n`;
    let event = this.dataService.parseFlockEvent();
    this.reply += `*SL* : @${event.userName}\n`;
    this.reply += "*SMEs* : ";
    this.printData(this.dataService.getSmeList);
    let trOnShift = false;
    if(this.dataService.getTRList().length)
    {
    this.reply += "\n*TRs* : ";
    this.printData(this.dataService.getTRList);
    trOnShift = true;
    }
    trOnShift ? this.reply += "\n*RR* : " : this.reply += "\nRR/TR: ";
    this.printData(this.dataService.getRR);
    if(this.dataService.getPE().length)
    {
    this.reply += "\n*PE* : ";
    this.printData(this.dataService.getPE);
    }
    

    this.updateDistribution();
  }

  updateDistribution() {
      let dnTime=this.dataService.info.period.split('-')[0].replace(/:0/i,':3');
    this.distribution = "*SME distribution* : ";
    this.dataService.smes.forEach(sme => {
        if(sme.location=="Dnipro")
      this.distribution += `\n@${sme.name} (from ${dnTime}) - `;
      else this.distribution += `\n@${sme.name} - `;
      //this.distribution += `\n@${sme.name} - `;
      
       if(!Array.isArray(sme.teams))
       {
           sme.teams=[];
       }
       let temp=sme.teams.slice();
      if(Array.isArray(sme.hasOnly))
       for (let i = 0; i < sme.hasOnly.length; i++)
      {
          this.distribution += 'All '+ sme.hasOnly[i]+', ';
           for (let j = 0; j < temp.length; j++){
               if(temp[j].name.includes(sme.hasOnly[i]))
               {
                     temp.splice(j, 1); 
                     j--;
               }
           }
      }
      if(temp.length)
      for (let i = 0; i < temp.length; i++) {
          this.distribution += temp[i].name +', ';
      };
        this.distribution=this.distribution.substring(0, this.distribution.length - 2);
       
    });
  }
}
