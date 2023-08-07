import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})

export class MeetingsComponent implements OnInit {
  items!: MenuItem[];
  activeItem!: MenuItem;

  tabmenus: boolean = true;
  constructor(private irService:IRServiceService, private router: Router ) { }

  ngOnInit(): void {
    this.irService.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data,"!!");
      this.tabmenus=!this.tabmenus;
    })
    this.items = [
      { label: 'Scheduler', routerLink: ['/document/nav/meetings/meetings/scheduler'] },
      {label:'Meeting Data', routerLink:['/document/nav/meetings/meetings/shMeetingData']},
      { label: 'Analysis', routerLink: ['/document/nav/meetings/meetings/analysis'] },

 
    ];
  }
  status: boolean = false;
  onClickMenu(){

  }
}
