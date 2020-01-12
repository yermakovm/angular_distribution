import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { SMEBar } from "./sme-bar/sme-bar.component";
import { CannedReply } from "./canned-reply/canned-reply.component";
import { AppComponent } from "./app.component";
import { SortablejsModule } from "ngx-sortablejs";
import { DataService } from "./data.service";
import { ShiftInfo } from "./shift-info/shift-info.component";
import { ScheduleStatus } from "./schedule-status/schedule-status.component";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule }   from '@angular/common/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Routes, RouterModule } from '@angular/router';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { ContentLoaderModule } from '@ngneat/content-loader';

@NgModule({
  declarations: [AppComponent, SMEBar, CannedReply, ShiftInfo, ScheduleStatus],
  imports: [ ContentLoaderModule, PerfectScrollbarModule, RouterModule.forRoot([]), FontAwesomeModule, FormsModule, ReactiveFormsModule, NgbModule, HttpClientModule, BrowserModule, SortablejsModule.forRoot({ animation: 150 })],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule {}
