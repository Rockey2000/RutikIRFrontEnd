import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { IRServiceService } from 'src/app/ir-service.service';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css'],
})
export class ConfigurationComponent implements OnInit {
  items!: MenuItem[];
  activeItem!: MenuItem;

  outerTabMenu!: string;

  tabmenus:boolean=true;

  constructor(private irSrvice:IRServiceService) {}

  ngOnInit(): void {

    this.irSrvice.dialogFormDataSubscriber$.subscribe((data: any) => {
      console.log(data,"!!");
      this.tabmenus=!this.tabmenus;
    })

    this.status = false;
    this.outerTabMenu = JSON.stringify(localStorage.getItem('outertabmenu'));

    this.items = [
      { label: 'Role', routerLink: ['/document/nav/config', 'role'] },
      { label: 'User', routerLink: ['/document/nav/config', 'user'] },
      // { label: 'User', routerLink: ['/document/home','masterDb'] },
      { label: 'Master Database', routerLink: ['/document/nav/config/master-db','balance-sheet'] },
      { label: 'Analyst Setup', routerLink: ['/document/nav/config','analyst'] },
    ];
    this.activeItem = this.items[0];
  }

  status: boolean = false;
  onClickMenu() {
    this.status = true;
  }
}
